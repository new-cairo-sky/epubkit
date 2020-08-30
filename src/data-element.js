import { generateXml } from "./utils/xml";

export default class DataElement {
  constructor(element, value = undefined, attributes = {}) {
    this._attributes = {};
    this.addAttributes(attributes);

    this.element = element;
    this.value = value;
  }

  get attributes() {
    return this._attributes;
  }

  removeAttribute(key, value = undefined) {
    if (this._attributes[key]) {
      if (value && this._attributes[key] === value) {
        delete this._attributes[key];
      } else if (!value) {
        delete this._attributes[key];
      }

      if (this.hasOwnProperty(key)) {
        if (value && this[key] === value) {
          delete this[key];
        } else if (!value) {
          delete this[key];
        }
      }
    }
  }

  addAttributes(attributes) {
    Object.assign(this._attributes, attributes);
    Object.entries(attributes).forEach(([key, value]) => {
      //this._attributes[key] = value;
      if (!this.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          // see: https://stackoverflow.com/questions/7141210/how-do-i-undo-a-object-defineproperty-call
          configurable: true,
          get() {
            return this._attributes[key];
          },
          set(val) {
            this._attributes[key] = val;
          },
        });
      }
    });
  }

  /**
   * Generate the actual xml data
   */
  async getXml(isFragment = false) {
    const xml = await generateXml(this.prepareForXml(), isFragment);
    return xml;
  }

  /**
   * Convert self into a plain data object, recursing children as needed.
   * This data can be passed to xml2Js builder method to convert to xml
   */
  prepareForXml(dataElement = undefined) {
    let data = {};

    // if no dataElement is provided, assume self to be the root element
    const isRoot = dataElement ? false : true;
    if (!dataElement) {
      dataElement = this;
    }

    for (let [key, value] of Object.entries(dataElement)) {
      if (key === "_attributes") {
        const attr = this.filterAttributes(value);
        if (attr) {
          data.attr = attr;
        }
      } else if (key === "value" && value) {
        data.val = value;
      } else if (value instanceof DataElement) {
        // this is a child dataelement
        data[value.element] = this.prepareForXml(value);
      } else if (Array.isArray(value) && value.length > 0) {
        // if entry is an array, recurse through it as children objects
        const children = {};
        value.forEach((child) => {
          // if children[element] array is already defined, add to it.
          if (Array.isArray(children[child.element])) {
            children[child.element].push(this.prepareForXml(child));
          } else {
            // otherwise make a new array
            children[child.element] = [this.prepareForXml(child)];
          }
        });
        Object.assign(data, children);
      }
    }

    if (isRoot) {
      return { [this.element]: data };
    } else {
      return data;
    }
  }

  filterAttributes(attributes) {
    if (Object.keys(attributes).length) {
      const attr = Object.entries(attributes)
        .filter(([key, value]) => {
          return value !== undefined;
        })
        .reduce((obj, [key, value]) => {
          obj[key] = attributes[key];
          return obj;
        }, {});

      if (Object.keys(attr).length) {
        return attr;
      }
    }
    return undefined;
  }
}

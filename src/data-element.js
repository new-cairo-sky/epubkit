import { generateXml, parseXml } from "./utils/xml";

export default class DataElement {
  constructor(element, value = undefined, attributes = {}) {
    this._attributes = {};

    // organizes children data-elements by element type
    this._childen = {};

    // organizes flat list of children by absolut order
    this._orderedChildren = [];

    this.addAttributes(attributes);

    this.element = element;
    this.value = value;
  }

  get attributes() {
    return this._attributes;
  }

  /**
   * Load and parse xml
   * @param {string} xml - the xml to parse
   * @param {boolean} recursive - set true to recursively parse children elements
   */
  async loadXml(xml, recursive = true) {
    const xmlObj = await parseXml(xml);

    for (let [key, value] of Object.entries(xmlObj)) {
      this.element = key;
      if (value?.attr) {
        this.addAttributes(value.attr);
      }
      await this.parseXmlObj(value, recursive);
    }
  }

  /**
   * Parse an xml2Js object - primarily intended for use by loadXml method only
   * @param {object} xmlObj - an xml2js object
   * @param {boolean} recursive - if it should recurse through the children
   */
  async parseXmlObj(xmlObj, recursive = true) {
    for (let [valKey, valValue] of Object.entries(xmlObj)) {
      if (valKey === "attr") {
        this.addAttributes(valValue);
      } else if (valKey === "val") {
        this.value = valValue;
      } else if (recursive) {
        // console.log("parsing", valKey);
        if (Array.isArray(valValue)) {
          this[valKey] = [];
          valValue.forEach(async (child) => {
            const length = this[valKey].push(new DataElement(valKey)); //await this.parseXmlObj()
            await this[valKey][length - 1].parseXmlObj(child, recursive);
          });
        } else if (
          Object.prototype.toString.call(valValue) === "[object Object]"
        ) {
          this[valKey] = new DataElement(valKey);
          await this[valKey].parseXmlObj(valValue, recursive);
        }
      }
    }
  }

  addChild(name, child) {
    const safeName = name.toLowerCase();
    const foundNames = Object.keys(this).filter(function (key) {
      return key.toLowerCase() === safeName;
    });
    const actualName = foundNames.length > 0 ? foundNames[0] : name;

    this._orderedChildren.push(child);

    if (this[safeName]) {
      // already exists
      this._children[actualName].push(val);
    } else {
      // does not already exist
      Object.defineProperty(this, safeName, {
        configurable: true,
        get() {
          const foundChild = this._children[safeName];
          if (foundChild.length === 1) {
            // if there is only one element, return the single item instead of array
            return this._children[safeName][0];
          } else {
            return this._children[safeName];
          }
        },
        set(val) {
          // is val is an array, assume that is meant to replace existing array
          if (Array.isArray(val)) {
            this._children[safeName] = val;
          } else {
            // otherwise add it the the array
            this._children[safeName] = [val];
          }
        },
      });
    }
  }

  get children() {
    return this._orderedChildren;
  }

  /**
   * Get the attributes, filtering out any that are empty
   */
  getFilteredAttributes() {
    const attributes = this._attributes;
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
    const preparedObject = this.prepareForXml();
    const xml = await generateXml(preparedObject, isFragment);
    return xml;
  }

  /**
   * Convert self into a plain data object, recursing children as needed.
   * This data can be passed to xml2Js builder method to convert to xml
   */
  prepareForXml() {
    let data = {};

    const dataElement = this;

    for (let [key, value] of Object.entries(dataElement)) {
      if (key === "_attributes") {
        const attr = this.getFilteredAttributes();
        if (attr) {
          data.attr = attr;
        }
      } else if (key === "value" && value) {
        data.val = value;
      } else if (value instanceof DataElement) {
        // this is a child dataElement
        const childData = value.prepareForXml();
        data[value.element] = childData[value.element];
      } else if (Array.isArray(value) && value.length > 0) {
        // if entry is an array, recurse through it as children objects
        const children = {};
        value.forEach((child) => {
          const childData = child.prepareForXml();

          // if children[child.element] array is already defined, add to it.
          if (Array.isArray(children[child.element])) {
            children[child.element].push(childData[child.element]);
          } else {
            // otherwise make a new array
            children[child.element] = [childData[child.element]];
          }
        });
        Object.assign(data, children);
      }
    }

    return { [this.element]: data };
  }
}

"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _xml = require("./utils/xml");function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}









class DataElement {





  // TODO this should be removed once object properties are refactored as members of children


  constructor(element, value, attributes) {_defineProperty(this, "_attributes", void 0);_defineProperty(this, "_children", void 0);_defineProperty(this, "_orderedChildren", void 0);_defineProperty(this, "element", void 0);_defineProperty(this, "value", void 0);
    this._attributes = {};

    // organizes children data-elements by element type
    this._children = {};

    // organizes flat list of children by absolut order
    this._orderedChildren = [];

    if (attributes) {
      this.addAttributes(attributes);
    }

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
    const xmlObj = await (0, _xml.parseXml)(xml);

    for (let [key, value] of Object.entries(xmlObj)) {
      this.element = key;
      if (value !== null && value !== void 0 && value.attr) {
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
          valValue.forEach(async child => {
            const length = this[valKey].push(new DataElement(valKey)); //await this.parseXmlObj()
            await this[valKey][length - 1].parseXmlObj(child, recursive);
          });
        } else if (
        Object.prototype.toString.call(valValue) === "[object Object]")
        {
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
      this._children[safeName].push(child);
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
        } });

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
      const attr = Object.entries(attributes).
      filter(([key, value]) => {
        return value !== undefined;
      }).
      reduce((obj, [key, value]) => {
        obj[key] = attributes[key];
        return obj;
      }, {});

      if (Object.keys(attr).length) {
        return attr;
      }
    }
    return;
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
          } });

      }
    });
  }

  /**
   * Generate the actual xml data
   */
  async getXml(isFragment = false) {
    const preparedObject = this.prepareForXml();
    const xml = await (0, _xml.generateXml)(preparedObject, isFragment);
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
        value.forEach(child => {
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
  }}exports.default = DataElement;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhLWVsZW1lbnQudHMiXSwibmFtZXMiOlsiRGF0YUVsZW1lbnQiLCJjb25zdHJ1Y3RvciIsImVsZW1lbnQiLCJ2YWx1ZSIsImF0dHJpYnV0ZXMiLCJfYXR0cmlidXRlcyIsIl9jaGlsZHJlbiIsIl9vcmRlcmVkQ2hpbGRyZW4iLCJhZGRBdHRyaWJ1dGVzIiwibG9hZFhtbCIsInhtbCIsInJlY3Vyc2l2ZSIsInhtbE9iaiIsImtleSIsIk9iamVjdCIsImVudHJpZXMiLCJhdHRyIiwicGFyc2VYbWxPYmoiLCJ2YWxLZXkiLCJ2YWxWYWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJjaGlsZCIsImxlbmd0aCIsInB1c2giLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJhZGRDaGlsZCIsIm5hbWUiLCJzYWZlTmFtZSIsInRvTG93ZXJDYXNlIiwiZm91bmROYW1lcyIsImtleXMiLCJmaWx0ZXIiLCJhY3R1YWxOYW1lIiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJnZXQiLCJmb3VuZENoaWxkIiwic2V0IiwidmFsIiwiY2hpbGRyZW4iLCJnZXRGaWx0ZXJlZEF0dHJpYnV0ZXMiLCJ1bmRlZmluZWQiLCJyZWR1Y2UiLCJvYmoiLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYXNPd25Qcm9wZXJ0eSIsImFzc2lnbiIsImdldFhtbCIsImlzRnJhZ21lbnQiLCJwcmVwYXJlZE9iamVjdCIsInByZXBhcmVGb3JYbWwiLCJkYXRhIiwiZGF0YUVsZW1lbnQiLCJjaGlsZERhdGEiXSwibWFwcGluZ3MiOiJvR0FBQSxrQzs7Ozs7Ozs7OztBQVVlLE1BQU1BLFdBQU4sQ0FBa0I7Ozs7OztBQU0vQjs7O0FBR0FDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUFrQkMsS0FBbEIsRUFBa0NDLFVBQWxDLEVBQXVEO0FBQ2hFLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUE7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCOztBQUVB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QixDQUE2QmdDLFNBQVMsQ0FBQ2xDLEtBQUssQ0FBQ3JCLE9BQVAsQ0FBdEM7QUFDRCxXQUZELE1BRU87QUFDTDtBQUNBeUMsWUFBQUEsUUFBUSxDQUFDcEIsS0FBSyxDQUFDckIsT0FBUCxDQUFSLEdBQTBCLENBQUN1RCxTQUFTLENBQUNsQyxLQUFLLENBQUNyQixPQUFQLENBQVYsQ0FBMUI7QUFDRDtBQUNGLFNBVkQ7QUFXQVksUUFBQUEsTUFBTSxDQUFDb0MsTUFBUCxDQUFjSyxJQUFkLEVBQW9CWixRQUFwQjtBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxFQUFFLENBQUMsS0FBS3pDLE9BQU4sR0FBZ0JxRCxJQUFsQixFQUFQO0FBQ0QsR0FsTzhCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZVhtbCwgcGFyc2VYbWwgfSBmcm9tIFwiLi91dGlscy94bWxcIjtcblxuaW50ZXJmYWNlIF9jaGlsZHJlbiB7XG4gIFtrZXk6IHN0cmluZ106IERhdGFFbGVtZW50W107XG59XG5cbmludGVyZmFjZSBBdHRyaWJ1dGVzIHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhRWxlbWVudCB7XG4gIF9hdHRyaWJ1dGVzOiBBdHRyaWJ1dGVzO1xuICBfY2hpbGRyZW46IF9jaGlsZHJlbjtcbiAgX29yZGVyZWRDaGlsZHJlbjogRGF0YUVsZW1lbnRbXTtcbiAgZWxlbWVudDogc3RyaW5nO1xuICB2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAvLyBUT0RPIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgb25jZSBvYmplY3QgcHJvcGVydGllcyBhcmUgcmVmYWN0b3JlZCBhcyBtZW1iZXJzIG9mIGNoaWxkcmVuXG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nLCBhdHRyaWJ1dGVzPzogb2JqZWN0KSB7XG4gICAgdGhpcy5fYXR0cmlidXRlcyA9IHt9O1xuXG4gICAgLy8gb3JnYW5pemVzIGNoaWxkcmVuIGRhdGEtZWxlbWVudHMgYnkgZWxlbWVudCB0eXBlXG4gICAgdGhpcy5fY2hpbGRyZW4gPSB7fTtcblxuICAgIC8vIG9yZ2FuaXplcyBmbGF0IGxpc3Qgb2YgY2hpbGRyZW4gYnkgYWJzb2x1dCBvcmRlclxuICAgIHRoaXMuX29yZGVyZWRDaGlsZHJlbiA9IFtdO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgIHRoaXMuYWRkQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBhdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYW5kIHBhcnNlIHhtbFxuICAgKiBAcGFyYW0ge3N0cmluZ30geG1sIC0gdGhlIHhtbCB0byBwYXJzZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlY3Vyc2l2ZSAtIHNldCB0cnVlIHRvIHJlY3Vyc2l2ZWx5IHBhcnNlIGNoaWxkcmVuIGVsZW1lbnRzXG4gICAqL1xuICBhc3luYyBsb2FkWG1sKHhtbDogc3RyaW5nLCByZWN1cnNpdmU6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgY29uc3QgeG1sT2JqID0gYXdhaXQgcGFyc2VYbWwoeG1sKTtcblxuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh4bWxPYmopKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBrZXk7XG4gICAgICBpZiAodmFsdWU/LmF0dHIpIHtcbiAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVzKHZhbHVlLmF0dHIpO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5wYXJzZVhtbE9iaih2YWx1ZSwgcmVjdXJzaXZlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYW4geG1sMkpzIG9iamVjdCAtIHByaW1hcmlseSBpbnRlbmRlZCBmb3IgdXNlIGJ5IGxvYWRYbWwgbWV0aG9kIG9ubHlcbiAgICogQHBhcmFtIHtvYmplY3R9IHhtbE9iaiAtIGFuIHhtbDJqcyBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSByZWN1cnNpdmUgLSBpZiBpdCBzaG91bGQgcmVjdXJzZSB0aHJvdWdoIHRoZSBjaGlsZHJlblxuICAgKi9cbiAgYXN5bmMgcGFyc2VYbWxPYmooeG1sT2JqOiBvYmplY3QsIHJlY3Vyc2l2ZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICBmb3IgKGxldCBbdmFsS2V5LCB2YWxWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoeG1sT2JqKSkge1xuICAgICAgaWYgKHZhbEtleSA9PT0gXCJhdHRyXCIpIHtcbiAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVzKHZhbFZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsS2V5ID09PSBcInZhbFwiKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWxWYWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAocmVjdXJzaXZlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFyc2luZ1wiLCB2YWxLZXkpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxWYWx1ZSkpIHtcbiAgICAgICAgICB0aGlzW3ZhbEtleV0gPSBbXTtcbiAgICAgICAgICB2YWxWYWx1ZS5mb3JFYWNoKGFzeW5jIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpc1t2YWxLZXldLnB1c2gobmV3IERhdGFFbGVtZW50KHZhbEtleSkpOyAvL2F3YWl0IHRoaXMucGFyc2VYbWxPYmooKVxuICAgICAgICAgICAgYXdhaXQgdGhpc1t2YWxLZXldW2xlbmd0aCAtIDFdLnBhcnNlWG1sT2JqKGNoaWxkLCByZWN1cnNpdmUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWxWYWx1ZSkgPT09IFwiW29iamVjdCBPYmplY3RdXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpc1t2YWxLZXldID0gbmV3IERhdGFFbGVtZW50KHZhbEtleSk7XG4gICAgICAgICAgYXdhaXQgdGhpc1t2YWxLZXldLnBhcnNlWG1sT2JqKHZhbFZhbHVlLCByZWN1cnNpdmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkQ2hpbGQobmFtZTogc3RyaW5nLCBjaGlsZDogRGF0YUVsZW1lbnQpIHtcbiAgICBjb25zdCBzYWZlTmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBmb3VuZE5hbWVzID0gT2JqZWN0LmtleXModGhpcykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gc2FmZU5hbWU7XG4gICAgfSk7XG4gICAgY29uc3QgYWN0dWFsTmFtZSA9IGZvdW5kTmFtZXMubGVuZ3RoID4gMCA/IGZvdW5kTmFtZXNbMF0gOiBuYW1lO1xuXG4gICAgdGhpcy5fb3JkZXJlZENoaWxkcmVuLnB1c2goY2hpbGQpO1xuXG4gICAgaWYgKHRoaXNbc2FmZU5hbWVdKSB7XG4gICAgICAvLyBhbHJlYWR5IGV4aXN0c1xuICAgICAgdGhpcy5fY2hpbGRyZW5bc2FmZU5hbWVdLnB1c2goY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgc2FmZU5hbWUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgY29uc3QgZm91bmRDaGlsZCA9IHRoaXMuX2NoaWxkcmVuW3NhZmVOYW1lXTtcbiAgICAgICAgICBpZiAoZm91bmRDaGlsZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGVsZW1lbnQsIHJldHVybiB0aGUgc2luZ2xlIGl0ZW0gaW5zdGVhZCBvZiBhcnJheVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW3NhZmVOYW1lXVswXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW3NhZmVOYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWwpIHtcbiAgICAgICAgICAvLyBpcyB2YWwgaXMgYW4gYXJyYXksIGFzc3VtZSB0aGF0IGlzIG1lYW50IHRvIHJlcGxhY2UgZXhpc3RpbmcgYXJyYXlcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltzYWZlTmFtZV0gPSB2YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBhZGQgaXQgdGhlIHRoZSBhcnJheVxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5bc2FmZU5hbWVdID0gW3ZhbF07XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmRlcmVkQ2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBhdHRyaWJ1dGVzLCBmaWx0ZXJpbmcgb3V0IGFueSB0aGF0IGFyZSBlbXB0eVxuICAgKi9cbiAgZ2V0RmlsdGVyZWRBdHRyaWJ1dGVzKCk6IEF0dHJpYnV0ZXMgfCB2b2lkIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5fYXR0cmlidXRlcztcbiAgICBpZiAoT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhdHRyID0gT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcylcbiAgICAgICAgLmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pXG4gICAgICAgIC5yZWR1Y2UoKG9iaiwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgb2JqW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSwge30gYXMgQXR0cmlidXRlcyk7XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhhdHRyKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGF0dHI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIHJlbW92ZUF0dHJpYnV0ZShrZXk6IHN0cmluZywgdmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5fYXR0cmlidXRlc1trZXldKSB7XG4gICAgICBpZiAodmFsdWUgJiYgdGhpcy5fYXR0cmlidXRlc1trZXldID09PSB2YWx1ZSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fYXR0cmlidXRlc1trZXldO1xuICAgICAgfSBlbHNlIGlmICghdmFsdWUpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2F0dHJpYnV0ZXNba2V5XTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAodmFsdWUgJiYgdGhpc1trZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEF0dHJpYnV0ZXMoYXR0cmlidXRlczogb2JqZWN0KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLl9hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIC8vdGhpcy5fYXR0cmlidXRlc1trZXldID0gdmFsdWU7XG4gICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgICAgICAgLy8gc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MTQxMjEwL2hvdy1kby1pLXVuZG8tYS1vYmplY3QtZGVmaW5lcHJvcGVydHktY2FsbFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fYXR0cmlidXRlc1trZXldID0gdmFsO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBhY3R1YWwgeG1sIGRhdGFcbiAgICovXG4gIGFzeW5jIGdldFhtbChpc0ZyYWdtZW50ID0gZmFsc2UpIHtcbiAgICBjb25zdCBwcmVwYXJlZE9iamVjdCA9IHRoaXMucHJlcGFyZUZvclhtbCgpO1xuICAgIGNvbnN0IHhtbCA9IGF3YWl0IGdlbmVyYXRlWG1sKHByZXBhcmVkT2JqZWN0LCBpc0ZyYWdtZW50KTtcbiAgICByZXR1cm4geG1sO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgc2VsZiBpbnRvIGEgcGxhaW4gZGF0YSBvYmplY3QsIHJlY3Vyc2luZyBjaGlsZHJlbiBhcyBuZWVkZWQuXG4gICAqIFRoaXMgZGF0YSBjYW4gYmUgcGFzc2VkIHRvIHhtbDJKcyBidWlsZGVyIG1ldGhvZCB0byBjb252ZXJ0IHRvIHhtbFxuICAgKi9cbiAgcHJlcGFyZUZvclhtbCgpOiBvYmplY3Qge1xuICAgIGxldCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cbiAgICBjb25zdCBkYXRhRWxlbWVudCA9IHRoaXM7XG5cbiAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YUVsZW1lbnQpKSB7XG4gICAgICBpZiAoa2V5ID09PSBcIl9hdHRyaWJ1dGVzXCIpIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IHRoaXMuZ2V0RmlsdGVyZWRBdHRyaWJ1dGVzKCk7XG4gICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgZGF0YS5hdHRyID0gYXR0cjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwidmFsdWVcIiAmJiB2YWx1ZSkge1xuICAgICAgICBkYXRhLnZhbCA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGFFbGVtZW50KSB7XG4gICAgICAgIC8vIHRoaXMgaXMgYSBjaGlsZCBkYXRhRWxlbWVudFxuICAgICAgICBjb25zdCBjaGlsZERhdGE6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB2YWx1ZS5wcmVwYXJlRm9yWG1sKCk7XG4gICAgICAgIGRhdGFbdmFsdWUuZWxlbWVudF0gPSBjaGlsZERhdGFbdmFsdWUuZWxlbWVudF07XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gaWYgZW50cnkgaXMgYW4gYXJyYXksIHJlY3Vyc2UgdGhyb3VnaCBpdCBhcyBjaGlsZHJlbiBvYmplY3RzXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG4gICAgICAgIHZhbHVlLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hpbGREYXRhID0gY2hpbGQucHJlcGFyZUZvclhtbCgpO1xuXG4gICAgICAgICAgLy8gaWYgY2hpbGRyZW5bY2hpbGQuZWxlbWVudF0gYXJyYXkgaXMgYWxyZWFkeSBkZWZpbmVkLCBhZGQgdG8gaXQuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW5bY2hpbGQuZWxlbWVudF0pKSB7XG4gICAgICAgICAgICBjaGlsZHJlbltjaGlsZC5lbGVtZW50XS5wdXNoKGNoaWxkRGF0YVtjaGlsZC5lbGVtZW50XSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBtYWtlIGEgbmV3IGFycmF5XG4gICAgICAgICAgICBjaGlsZHJlbltjaGlsZC5lbGVtZW50XSA9IFtjaGlsZERhdGFbY2hpbGQuZWxlbWVudF1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGF0YSwgY2hpbGRyZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IFt0aGlzLmVsZW1lbnRdOiBkYXRhIH07XG4gIH1cbn1cbiJdfQ==
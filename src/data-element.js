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
}
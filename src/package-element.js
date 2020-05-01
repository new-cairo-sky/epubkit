export default class PackageElement {
  constructor(name, value = undefined, attributes = {}) {
    this.sharedAttributes = {
      id: undefined,
    };
    this._attributes = {};

    this.addAttributes(this.sharedAttributes);
    this.addAttributes(attributes);

    this.element = name;
    this.value = value;
  }

  // get attributes() {
  //   // dont return undefined attributes
  //   let filteredAttributes = {};
  //   Object.entries(this._attributes).forEach(([key, value]) => {
  //     if (value) {
  //       filteredAttributes[key] = value;
  //     }
  //   });

  //   return filteredAttributes;
  // }

  get attributes() {
    return this._attributes;
  }

  removeAttribute(key) {
    if (this._attributes[key]) {
      delete this._attributes[key];
      if (this.hasOwnProperty(key)) {
        delete this[key];
      }
    }
  }

  addAttributes(attributes) {
    Object.assign(this._attributes, attributes);
    Object.entries(this._attributes).forEach(([key, value]) => {
      this._attributes[key] = value;
      if (!this.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
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

export default class PackageElement {
  constructor(name, value = undefined, attributes = {}) {
    this.sharedAttributes = {
      id: undefined,
    };
    this.attributes = {};

    this.addAttributes(this.sharedAttributes);
    this.addAttributes(attributes);

    this.name = name;
    this.value = value;
  }

  addAttributes(attributes) {
    Object.assign(this.attributes, attributes);
    Object.entries(this.attributes).forEach(([key, value]) => {
      if (!this.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          get() {
            return this.attributes[key];
          },
          set(val) {
            this.attributes[key] = val;
          },
        });
      }
    });
  }
}

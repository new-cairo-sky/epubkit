import DataElement from "./data-element";
export default class PackageElement extends DataElement {
  constructor(name, value = undefined, attributes = {}) {
    const allAttributes = Object.assign({ id: undefined }, attributes);
    super(name, value, allAttributes);
  }
}

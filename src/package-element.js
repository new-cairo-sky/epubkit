import DataElement from "./data-element";
export default class PackageElement extends DataElement {
  constructor(element, value = undefined, attributes = {}) {
    const allAttributes = Object.assign({ id: undefined }, attributes);
    super(element, value, allAttributes);
  }
}

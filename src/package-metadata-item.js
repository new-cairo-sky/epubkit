import PackageElement from "./package-element";

export default class PackageMetaDataItem extends PackageElement {
  constructor(name, value = "", attributes = {}) {
    super(name, value, attributes);

    const sharedAttributes = {
      id: undefined,
      dir: undefined,
      "xml:lang": undefined,
    };

    this.addAttributes(sharedAttributes);
  }
}

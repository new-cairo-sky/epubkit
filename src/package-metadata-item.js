import PackageElement from "./package-element";

export default class PackageMetaDataItem extends PackageElement {
  constructor(name, value = "", attributes = {}) {
    super(name, value, attributes);
  }
}

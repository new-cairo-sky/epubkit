import DataElement from "./data-element";
import ContainerRootfilesRootfile from "./container-rootfiles-rootfile";

export default class ContainerRootfiles extends DataElement {
  constructor(items = []) {
    super("rootfiles");

    this.items = [];

    items.forEach((itemData) => {
      const { "full-path": fullPath, "media-type": mediaType } = itemData;
      this.addItem(fullPath, mediaType);
    });
  }

  addItem(fullPath, mediaType) {
    this.items.push(new ContainerRootfilesRootfile(fullPath, mediaType));
  }

  removeItem(fullPath) {
    this.items = this.items.filter((item) => {
      return item["full-path"] !== fullPath;
    });
  }
}

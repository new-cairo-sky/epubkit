import PackageElement from "./package-element";
import PackageMetadataItem from "./package-metadata-item";

export default class PackageMetadata extends PackageElement {
  constructor(items = [], attributes = {}) {
    super("metadata");
    const requiredMetadata = [
      { name: "dc:identifier", value: undefined },
      { name: "dc:title", value: "Untitled" },
      { name: "dc:language", value: "en-US" },
    ];

    const neededMetadata = requiredMetadata.filter((requiredItem) => {
      return (
        items.findIndex((item) => {
          return item.name === requiredItem.name;
        }) === -1
      );
    });

    this.items = items.concat(neededMetadata).map((itemData) => {
      return new PackageMetadataItem(
        itemData.name,
        itemData.value,
        itemData?.attributes
      );
    });
  }

  addItem(name, value = "", attributes = []) {
    this.items.push(new PackageMetadataItem(name, value, attributes));
  }

  removeItemsWithName(name) {
    this.items = this.items.filter((item) => {
      item.name !== name;
    });
  }

  findItemsWithName(name) {
    return this.items.filter((item) => {
      return item.name === name;
    });
  }

  findItemWithId(name, id) {
    return this.items.find((item) => {
      return item.name === name && item.id === id;
    });
  }

  removeItemWithId(name, id) {
    this.items = this.items.filter((item) => {
      item.name !== name && item.id !== id;
    });
  }

  findItemsWithAttributes(name, attributes) {
    return this.items.filter((item) => {
      return attributes.every((attr) => {
        return item?.[attr];
      });
    });
  }
}

import PackageElement from "./package-element";
import PackageMetadataItem from "./package-metadata-item";

export default class PackageMetadata extends PackageElement {
  constructor(items = [], attributes = {}) {
    super("metadata", undefined, attributes);

    const requiredMetadata = [
      { element: "dc:identifier", value: undefined },
      { element: "dc:title", value: "Untitled" },
      { element: "dc:language", value: "en-US" },
    ];

    const neededMetadata = requiredMetadata.filter((requiredItem) => {
      return (
        items.findIndex((item) => {
          return item.element === requiredItem.element;
        }) === -1
      );
    });

    this.items = items.concat(neededMetadata).map((itemData) => {
      return new PackageMetadataItem(
        itemData.element,
        itemData.value,
        itemData?.attributes
      );
    });
  }

  addItem(element, value = "", attributes = {}) {
    this.items.push(new PackageMetadataItem(element, value, attributes));
  }

  removeItemsWithName(element) {
    this.items = this.items.filter((item) => {
      item.element !== element;
    });
  }

  findItemsWithName(element) {
    return this.items.filter((item) => {
      return item.element === element;
    });
  }

  findItemWithId(element, id) {
    return this.items.find((item) => {
      return item.element === element && item.id === id;
    });
  }

  removeItemWithId(element, id) {
    this.items = this.items.filter((item) => {
      item.element !== element && item.id !== id;
    });
  }

  /**
   * Finds items that have all of the attributes listed in the provided object.
   * If the onject attribute's value is undefined, then only the attribute name
   * is matched.
   * @param {object} attributes
   */
  findItemsWithAttributes(attributes) {
    return this.items.filter((item) => {
      return Object.keys(attributes).every((key) => {
        if (item.hasOwnProperty(key)) {
          if (attributes[key] !== undefined) {
            return item[key] === attributes[key];
          } else {
            return true;
          }
        }
        return false;
      });
    });
  }
}

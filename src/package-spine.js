import PackageElement from "./package-element";
import PackageSpineItem from "./package-spine-item";

export default class PackageSpine extends PackageElement {
  constructor(items = [], options = {}) {
    const attr = Object.assign(
      {
        id: undefined,
        "page-progression-direction": undefined,
        toc: undefined,
      },
      options
    );

    super("manifest", undefined, attr);

    this.items = [];

    items.forEach((itemData) => {
      const { idref, ...options } = itemData;
      this.addItem(idref, options);
    });
  }

  addItem(idref, options = {}) {
    this.items.push(new PackageSpineItem(idref, options));
  }

  findItemWithId(id) {
    return this.items.find((item) => {
      return item.id === id;
    });
  }

  removeItemWithId(id) {
    this.items = this.items.filter((item) => {
      return item.id !== id;
    });
  }

  findItemWithIdref(idref) {
    return this.items.find((item) => {
      return item.idref === idref;
    });
  }

  removeItemWithIdref(idref) {
    this.items = this.items.filter((item) => {
      return item.idref !== idref;
    });
  }

  findItemsWithLinear(value) {
    return this.items.filter((item) => {
      if (value === "no") {
        return item.linear === "no";
      } else {
        return item.linear !== "no";
      }
    });
  }

  findItemsWithAttributes(attributes) {
    return this.items.filter((item) => {
      return attributes.every((attr) => {
        return item?.[attr];
      });
    });
  }
}

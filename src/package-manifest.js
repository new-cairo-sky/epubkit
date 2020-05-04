import PackageElement from "./package-element";
import PackageManifestItem from "./package-manifest-item";

export default class PackageManifest extends PackageElement {
  constructor(items = [], id = undefined) {
    const attr = {};
    if (id) {
      attr.id = id;
    }
    super("manifest", undefined, attr);

    this.items = [];

    items.forEach((itemData) => {
      const { id, href, "media-type": mediaType, ...options } = itemData;
      this.addItem(id, href, mediaType, options);
    });
  }

  addItem(id, href, mediaType, options = {}, index = undefined) {
    const pos = index !== undefined ? index : this.items.length;
    this.items.splice(
      pos,
      0,
      new PackageManifestItem(id, href, mediaType, options)
    );
  }

  addItemAfterId(posId, id, href, mediaType, options = {}) {
    const searchPos = this.items.findIndex((item) => {
      return item.id === posId;
    });
    if (searchPos !== -1) {
      this.addItem(id, href, mediaType, options, searchPos + 1);
    } else {
      this.addItem(id, href, mediaType, options);
    }
  }

  addItemBeforeId(posId, id, href, mediaType, options = {}) {
    const searchPos = this.items.findIndex((item) => {
      return item.id === posId;
    });
    if (searchPos !== -1) {
      this.addItem(id, href, mediaType, options, searchPos);
    } else {
      this.addItem(id, href, mediaType, options, 0);
    }
  }

  findItemWithId(id) {
    return this.items.find((item) => {
      return item.id === id;
    });
  }

  removeItemWithId(id) {
    this.items = this.items.filter((item) => {
      item.id !== id;
    });
  }

  findNav() {
    return this.items.find((item) => {
      return item?.properties === "nav";
    });
  }

  setNav(id) {
    const oldNav = this.findNav();
    if (oldNav) {
      oldNav.removeAttribute("properties", "nav");
    }
    const newNav = this.findItemWithId(id);
    newNav.addAttributes({ properties: "nav" });
  }

  findItemWithHref(href) {
    return this.items.find((item) => {
      return item.href === href;
    });
  }

  removeItemWithHref(href) {
    this.items = this.items.filter((item) => {
      return item.href !== href;
    });
  }

  findItemsWithMediaType(mediaType) {
    return this.items.filter((item) => {
      return item["media-type"] === mediaType;
    });
  }

  removeItemsWithMediaType(mediaType) {
    this.items = this.items.filter((item) => {
      return item["media-type"] !== mediaType;
    });
  }

  findItemsWithAttributes(attributes) {
    return this.items.filter((item) => {
      return Object.keys(attributes).every((key) => {
        if (item.hasOwnProperty(key)) {
          return item[key] === attributes[key];
        }
        return false;
      });
    });
  }
}

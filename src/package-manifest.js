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
      const { id, href, mediaType, ...options } = itemData;
      this.addItem(id, href, mediaType, options);
    });
  }

  addItem(id, href, mediaType, options = {}) {
    this.items.push(new PackageManifestItem(id, href, mediaType, options));
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
      item.removeAttribute("nav");
    }
    const newNav = this.findItemWithId(id);
    newNav.addAttributes({ properties: "nav" });
  }

  findItemsWithHref(href) {
    return this.items.find((item) => {
      return item.href === href;
    });
  }

  removeItemsWithHref(href) {
    this.items = this.items.filter((item) => {
      item.href !== href;
    });
  }

  findItemsWithMediaType(mediaType) {
    return this.items.find((item) => {
      return item.mediaType === mediaType;
    });
  }

  removeItemsWithMediaType(mediaType) {
    this.items = this.items.filter((item) => {
      item.mediaType !== mediaType;
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

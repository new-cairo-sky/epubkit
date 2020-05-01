import PackageElement from "./package-element";

export default class PackageManifestItem extends PackageElement {
  constructor(id, href, mediaType, options = {}) {
    const attr = Object.assign(
      {
        id: id,
        href: href,
        "media-type": mediaType,
        fallback: undefined,
        "media-overlay": undefined,
        properties: undefined,
      },
      options
    );
    super("item", undefined, attr);
  }
}

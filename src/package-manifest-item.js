import FileManager from "./file-manager";
import PackageElement from "./package-element";

export default class PackageManifestItem extends PackageElement {
  constructor(id, href, mediaType, options = {}, opfLocation = "") {
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

    this._opfLocation = opfLocation;
  }

  set opfLocation(locationInEpub) {
    this._opfLocation = locationInEpub;
  }

  get opfLocation() {
    return this._opfLocation;
  }

  /**
   * If href is relative, get's the href location as relative to the epub's root.
   */
  get location() {
    return FileManager.resolveIriToEpubLocation(this.href, this._opfLocation);
  }
}

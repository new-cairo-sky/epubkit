import path from "path";
import FileManager from "./file-manager";
import PackageElement from "./package-element";
import PackageMetadata from "./package-metadata";
import PackageManifest from "./package-manifest";
import PackageSpine from "./package-spine";
import {
  parseXml,
  generateXml,
  filterAttributes,
  prepareItemsForXml,
} from "./utils/xml";

export default class PackageManager extends PackageElement {
  constructor(locationInEpub = "") {
    super("package", {
      xmlns: "http://www.idpf.org/2007/opf",
      dir: undefined,
      id: undefined,
      prefix: undefined,
      "xml:lang": undefined,
      "unique-identifier": undefined,
      version: undefined,
    });

    this._location = locationInEpub; // the path relative to the epub root.
    this.metadata = undefined;
    this.manifest = undefined;
    this.spine = undefined;
    this.rawData = undefined;
  }

  set location(locationInEpub) {
    this._location = locationInEpub; // the path relative to the epub root.
    if (this.manifest) {
      this.manifest.location = locationInEpub;
    }
  }

  get location() {
    return this._location;
  }

  findUniqueIdentifier() {
    const metadataId = this.attributes["unique-identifier"];
    if (metadataId) {
      const uidMetadata = this.metadata.findItemWithId(
        "dc:identifier",
        metadataId
      );
      if (uidMetadata) {
        return uidMetadata.value;
      }
    }
  }

  /**
   * Legacy Epub 2.0 specification states that a spine element with the 'toc' attribute
   * identifies the idref of the NCX file in the manifest
   * TODO - handle relative and absolute urls. resolve path
   */
  findNcxFilePath() {
    const tocId = this.spine.toc;
    if (tocId) {
      const ncxItem = this.manifest.findItemWithId(tocId);
      if (ncxItem) {
        return FileManager.resolveIriToEpubLocation(
          ncxItem.href,
          this.location
        );
      }
    }
    return;
  }

  /**
   * Find the href of the manifest item with properties="nav" attribute
   * https://www.w3.org/publishing/epub32/epub-packages.html#sec-package-nav
   * TODO - handle relative and absolute urls. resolve path
   */
  findNavigationFilePath() {
    const spineItem = this.manifest.findNav();
    if (spineItem) {
      return FileManager.resolveIriToEpubLocation(
        spineItem.href,
        this.location
      );
    }
    return;
  }

  async loadXml(data) {
    const result = await parseXml(data);

    if (result) {
      this.rawData = result;

      if (this.rawData.package.attr) {
        this.addAttributes(this.rawData.package.attr);
      }

      // construct metadata section
      const rawMetadata = result.package.metadata[0];
      const formatedMetadata = Object.entries(rawMetadata).flatMap(
        ([key, value]) => {
          if (key === "attr") return [];
          if (Array.isArray(value)) {
            return value.flatMap((entry) => {
              return {
                element: key,
                value: entry?.val,
                attributes: entry?.attr,
              };
            });
          }
        }
      );

      this.metadata = new PackageMetadata(formatedMetadata, rawMetadata?.attr);

      // construct the manifest section
      const rawManifest = result.package.manifest[0];
      const manifestItems = Object.entries(rawManifest).flatMap(
        ([key, value]) => {
          if (key === "attr") return [];
          if (Array.isArray(value)) {
            return value.flatMap((entry) => {
              return entry.attr;
            });
          }
        }
      );

      this.manifest = new PackageManifest(
        manifestItems,
        rawManifest?.attr,
        this._location
      );

      // construct the manifest section
      const rawSpine = result.package.spine[0];
      const spineItems = Object.entries(rawSpine).flatMap(([key, value]) => {
        if (key === "attr") return [];
        if (Array.isArray(value)) {
          return value.flatMap((entry) => {
            return entry.attr;
          });
        }
      });

      this.spine = new PackageSpine(spineItems, rawSpine?.attr);
    } else {
      console.error("Error parsing XML");
    }
  }

  /**
   * Get the xml string data
   * @returns {string}
   */
  async getXml() {
    const xml = await generateXml(this.getXml2JsObject());
    return xml;
  }

  /**
   * Build the xml2Js object for conversion to raw xml
   * @returns {object}
   */
  getXml2JsObject() {
    const filterAttributes = (attributes) => {
      if (Object.keys(attributes).length) {
        const attr = Object.entries(attributes)
          .filter(([key, value]) => {
            return value !== undefined;
          })
          .reduce((obj, [key, value]) => {
            obj[key] = attributes[key];
            return obj;
          }, {});

        if (Object.keys(attr).length) {
          return attr;
        }
      }
      return undefined;
    };

    const prepareChildrenForXml = (items) => {
      const dataList = {};
      items.forEach((item) => {
        const data = {};
        if (item.attributes) {
          const attr = filterAttributes(item.attributes);
          if (attr) {
            data.attr = attr;
          }
        }
        if (item.value) {
          data.val = item.value;
        }
        if (Array.isArray(dataList[item.element])) {
          dataList[item.element].push(data);
        } else {
          dataList[item.element] = [data];
        }
      });
      return dataList;
    };

    /* Metadata */
    let xmlJsMetadata = prepareChildrenForXml(this.metadata.items);
    const metadataAttr = filterAttributes(this.metadata.attributes);

    if (metadataAttr) {
      xmlJsMetadata.attr = metadataAttr;
    }

    /* Manifest */
    let xmlJsManifest = prepareChildrenForXml(this.manifest.items);
    const manifestAttr = filterAttributes(this.manifest.attributes);

    if (manifestAttr) {
      xmlJsManifest.attr = manifestAttr;
    }

    /* Spine */
    let xmlJsSpine = prepareChildrenForXml(this.spine.items);
    const spineAttr = filterAttributes(this.manifest.attributes);

    if (spineAttr) {
      xmlJsSpine.attr = spineAttr;
    }

    return {
      package: {
        attr: filterAttributes(this.attributes),
        metadata: [xmlJsMetadata],
        manifest: [xmlJsManifest],
        spine: [xmlJsSpine],
      },
    };
  }
}

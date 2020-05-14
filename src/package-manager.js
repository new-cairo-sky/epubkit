import path from "path";
import { v4 as uuidv4 } from "uuid";
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

/**
 * Package manager to create and edit opf files.
 * https://www.w3.org/publishing/epub32/epub-packages.html
 */
export default class PackageManager extends PackageElement {
  constructor(locationInEpub = "") {
    super("package", undefined, {
      xmlns: "http://www.idpf.org/2007/opf",
      dir: undefined,
      id: undefined,
      prefix: undefined,
      "xml:lang": undefined,
      "unique-identifier": undefined,
      version: "3.0",
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

  /**
   * Set the unique identifier of the ebook. This sets both the package
   * 'unique-identifier' id value which refers to a meta tag as well as the
   * meta tag value and id.
   * Note that the uid has side-effects with epub font obfuscation. The UID
   * is used as the obfuscation key and obfuscated fonts must be
   * re-processed when changing this value.
   * @param {string} value the UUID or other unique identifier
   * @param {string} id - the id of the meta tag that marks it as the uid.
   */
  setUniqueIdentifier(value, id = "pub-id") {
    const existingId = this.attributes["unique-identifier"];
    this.attributes["unique-identifier"] = id;

    const uidMetadata = existingId
      ? this.metadata.findItemWithId("dc:identifier", existingId)
      : undefined;

    if (uidMetadata) {
      uidMetadata.value = value;
      uidMetadata.id = id;
    } else {
      this.metadata.addItem("dc:identifier", value, { id: id });
    }
  }

  /**
   * Find the epub unique-identifer value
   */
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

  /**
   * Initialize a new empty package.
   */
  create() {
    const uuid = `urn:uuid:${uuidv4()}`;

    this.metadata = new PackageMetadata();
    this.manifest = new PackageManifest();
    this.spine = new PackageSpine();
    this.setUniqueIdentifier(uuid);
  }

  /**
   * Initialize a new package object using the provided xml.
   * @param {string | buffer} data - the xml data
   */
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

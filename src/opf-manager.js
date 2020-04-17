import path from "path";

/**
 * Manager for the opf file
 * http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
 */
class OpfManager {
  constructor() {
    this._content = undefined;
    this._loaded = false;
  }

  init(data) {
    this._content = data;
    this._loaded = true;
    return data;
  }

  /**
   * Public API Getters and Setters
   */

  get content() {
    return this._content;
  }

  get manifestItems() {
    const items = this._content.package.manifest[0].item.map((item) => {
      return {
        id: item.attr.id,
        href: item.attr.href,
        mediaType: item.attr["media-type"],
      };
    });
    return items;
  }

  /**
   * Metadata
   * http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.2
   */

  /**
   * Get the opf metadata as an object with keys for each entry.
   * The metadata tags attributes are added to the key 'attributes'
   * @returns {object} - an object of keyed metadata
   */
  get metadata() {
    //const metadata = this._content.package.metadata[0].;
    let metadata = {};

    for (let [key, value] of Object.entries(
      this._content.package.metadata[0]
    )) {
      if (key === "attr") {
        metadata["attributes"] = value;
      } else if (this._content.package.metadata[0].hasOwnProperty(key)) {
        metadata[key] = this.findMetadataValue(key);
      }
    }

    return metadata;
  }

  get rawMetadata() {
    return this._content.package.metadata[0];
  }

  addMetadata(key, value, attributes = []) {
    if (!this._content.package.metadata[0][key]) {
      this._content.package.metadata[0][key] = [];
    }
    if (attributes.length > 0) {
      const item = {
        val: value,
        attr: attributes,
      };
      this._content.package.metadata[0][key].push(item);
    } else {
      this._content.package.metadata[0][key].push(value);
    }
  }
  /**
   * Find a metadata entry with the specified key.
   *
   * @param {string} key the metadata key to retrieve
   * @returns {array} an array of objects in the shape of:
   *   [{
   *    attributes: {array},
   *    value: string
   *    },
   *    ...
   *   ]
   */
  findMetadataValue(key) {
    const metadata = [];

    if (this._content.package.metadata[0][key]) {
      const value = this._content.package.metadata[0][key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "object" && item !== null) {
            const newMetadata = {};
            for (let [itemKey, itemValue] of Object.entries(item)) {
              if (item.hasOwnProperty(itemKey)) {
                if (itemKey === "val") {
                  newMetadata["value"] = itemValue;
                } else if (itemKey === "attr") {
                  newMetadata["attributes"] = itemValue;
                }
                if (!newMetadata["value"]) {
                  newMetadata["value"] = undefined;
                }
                if (!newMetadata["attributes"]) {
                  newMetadata["attributes"] = undefined;
                }
              }
            }
            metadata.push(newMetadata);
          } else {
            metadata.push({ value: item, attributes: undefined });
          }
        });
      }
    }
    return metadata;
  }

  /**
   * Find the title metadate entries, if any
   * @returns {array}
   */
  findMetadataTitles() {
    const titles = this.findMetadataValue["dc:title"];
    if (titles) {
      return titles;
    }
    return [];
  }

  findMetadataCreators() {
    const creators = this.findMetadataValue["dc:creator"];
    if (creators) {
      return creators;
    }
    return [];
  }

  /**
   * Get's the toc attribute of the spine tag
   * The toc attribute value is the id of the toc item in the manifest
   */
  get spineToc() {
    return this?._content?.package?.spine?.attr?.toc;
  }

  /**
   * Set the spine's TOC attribute
   * @param {string} toc
   */
  set spineToc(toc) {
    if (!this._content.package.spine.attr) {
      this._content.package.spine.attr = { toc: toc };
    } else {
      this._content.package.spine.attr.toc = toc;
    }
  }

  /**
   * Try to find the href of the nav file.
   * Looks for nav attribute and matches that to item id in the manifest.
   * Order of search is: OPF Spine toc, manifest item with nav "properties", ncx path
   */
  findTocHref() {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const tocId = this.spineToc;

    if (tocId) {
      const manifestItem = this.findManifestItemWithId(tocId);
      if (manifestItem) {
        const href = manifestItem.href;
        if (!!href) {
          throw `Malformed OPF: Spine does not contain toc with id ${tocId}`;
        }
        return href;
      }
    } else {
      // the spine's toc attribute is not defined.
      // look for a manifest item with the nav property
      const item = this.findManifestItemWithProperties("nav");
      if (item) {
        if (!item?.href) {
          throw `Malformed OPF: Manifest contains item with property "nav" but href is empty.`;
        }
        return item.href;
      } else {
        // no nav item found - look for an ncx file
        const ncxItems = this.findManifestItemsWithMediaType(
          "application/x-dtbncx+xml"
        );

        if (ncxItems.length < 1) {
          throw `Ncx not found in manifest.`;
        }

        const href = ncxItems[0]?.href;

        if (!href) {
          throw `Malformed OPF: Manifest contains ncx but href is empty.`;
        }

        return ncxItems[0].href;
      }
    }

    return;
  }

  /**
   * Find the relative TOC file path.
   * @param {string} relativeTo - return path relative to this directory
   */
  findTocPath(relativeTo = "/") {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const href = this.findTocHref();
    if (href) {
      const tocPath = path.resolve(path.dirname(relativeTo), href);
      return tocPath;
    }
    return;
  }

  /**
   * Find the path to the ncx file, if any.
   */
  findNcxPath(relativeTo) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const ncxItems = this.findManifestItemsWithMediaType(
      "application/x-dtbncx+xml"
    );
    if (ncxItems.length > 0) {
      const href = ncxItems[0].href;
      if (!!href) {
        throw "Ncx found in manifest, but href is empty.";
      }
      const ncxPath = path.resolve(path.dirname(relativeTo), href);
      return ncxPath;
    } else {
      throw "No ncx found in manifest.";
    }
  }

  /**
   * Manifest Methods
   */

  addManifestItem(href, id, mediaType) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    this._content.package.manifest[0].item.push({
      attr: {
        href: href,
        id: id,
        "media-type": mediaType,
      },
    });
    this.sortManifest();
    return this._content.package.manifest;
  }

  sortManifest() {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    // sort by type and then by ID.
    const sortedManifest = this._content?.package?.manifest[0].item.sort(
      (a, b) => {
        const mediaTypeA = a.attr["media-type"].toUpperCase();
        const mediaTypeB = b.attr["media-type"].toUpperCase();
        if (mediaTypeA < mediaTypeB) {
          return -1;
        }
        if (mediaTypeA > mediaTypeB) {
          return 1;
        }

        const idA = a.attr.id.toUpperCase();
        const idB = b.attr.id.toUpperCase();

        if (idA < idB) {
          return -1;
        }
        if (idA > idB) {
          return 1;
        }

        return 0;
      }
    );
    return sortedManifest;
  }

  /**
   * Find the first manifest item with the given "properties" attribute value
   * @param {string} prop
   */
  findManifestItemWithProperties(prop) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const item = this._content.package.manifest[0].item.find((item) => {
      return item?.attr?.properties === prop;
    });

    if (item) {
      return {
        id: item.attr.id,
        href: item.attr.href,
        mediaType: item.attr["media-type"],
        properties: item.attr?.properties,
      };
    }
  }

  /**
   * Find the manifest items with the given media-type attribute
   * @param {string} mediaType
   */
  findManifestItemsWithMediaType(mediaType) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const items = this._content.package.manifest[0].item
      .filter((item) => {
        return item?.attr["media-type"] === mediaType;
      })
      .map((item) => {
        return {
          id: item.attr.id,
          href: item.attr.href,
          mediaType: item.attr["media-type"],
          properties: item.attr?.properties,
        };
      });

    return items;
  }

  /**
   * Find a manifest item with the given id value
   * @param {string} id
   */
  findManifestItemWithId(id) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const item = this._content.package.manifest[0].item.find((item) => {
      return item.attr.id === id;
    });

    if (item) {
      return {
        id: item.attr.id,
        href: item.attr.href,
        mediaType: item.attr["media-type"],
        properties: item.attr?.properties,
      };
    }
  }

  /**
   * Get the position of a manifest item with id
   * @param {string} id
   */
  findManifestItemIdSpinePosition(id) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const index = this._content.package.spine[0].itemref.findIndex(
      (itemref) => {
        return itemref.attr.idref === id;
      }
    );

    return index;
  }

  /**
   * Spine Methods
   */

  /**
   * Get the spine's array of itemref elements. Each itemref has an idref attribute.
   * The idref references a manifest item id.
   * The order of this array determines the order of repesentation of the manifest items.
   * the linear attribute indicates if the itemref is in linear representation order
   * or is auxiliary content.
   * see: http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4
   */
  get spineItemrefs() {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const items = this._content.package.spine[0].item.map((item) => {
      return {
        idref: item.attr.idref,
        linear: item.attr.linear || true,
      };
    });
    return items;
  }

  /**
   * Add an itemref item to the spine
   * @param {int} position
   * @param {string} idref
   * @param {bool} linear
   */
  addSpineItemrefAtPosition(position, idref, linear = true) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    this._content.package.spine[0].itemref.splice(position, 0, {
      attr: {
        idref: idref,
        linear: linear ? "yes" : "no",
      },
    });
    return this._content.package.spine;
  }

  addSpineItemrefAfterIdref(positionIdref, idref, linear = true) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const position = this.findManifestItemIdSpinePosition(positionIdref);
    if (position !== -1) {
      this.addSpineItemrefAtPosition(position, idref, linear);
    } else {
      console.error(`Id "${positionIdref}" not found in manifest.`);
      throw `Id "${positionIdref}" not found in manifest.`;
    }
  }
}

export default OpfManager;

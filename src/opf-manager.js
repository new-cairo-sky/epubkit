import util from "util";
import xml2js from "xml2js";
import FileManager from "./file-manager";

/**
 * Manager for the container.xml file
 * http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
 */
class OpfManager {
  constructor(path) {
    this._path = path;
    this._content = undefined;
  }

  async loadFile(newPath) {
    let result;
    this._path = newPath ? newPath : this._path;

    const fileManager = new FileManager();
    const data = await fileManager.readFile(this._path);

    if (!data) {
      console.warn("Error reading file", this._path);
      return;
    }

    try {
      result = await util.promisify(xml2js.parseString)(data);
    } catch (err) {
      console.warn("Error parsing container.xml file:", err);
      return;
    }

    this._content = result;
    return result;
  }

  /**
   * Public API Getters ans Setters
   */
  get path() {
    return this._path;
  }

  get content() {
    return this._content;
  }

  get manifestItems() {
    const items = this._content.package.manifest[0].item.map(item => {
      return {
        id: item.$.id,
        href: item.$.href,
        mediaType: item.$["media-type"]
      };
    });
    return items;
  }

  /**
   * Get's the toc attribute of the spine tag
   * The toc attribute value is the id of the toc item in the manifest
   */
  get spineToc() {
    return this?._content?.package?.spine?.$?.toc;
  }

  set spineToc(toc) {
    if (!this._content.package.spine.$) {
      this._content.package.spine.$ = { toc: toc };
    } else {
      this._content.package.spine.$.toc = toc;
    }
  }

  /**
   * Try to find the href of the nav
   * and match that to an item in the manifest.
   * Order of search is: OPF Spine toc, manifest item with nav "properties", ncx path
   */
  findTocHref() {
    const tocId = this.spineToc;

    if (tocId) {
      const manifestItem = this.findManifestItemWithId(tocId);
      if (manifestItem) {
        const href = manifestItem.href;
        return href;
      }
    } else {
      // the spine's toc attribute is not defined.
      // look for a manifest item with the nav property
      const item = this.findManifestItemWithProperties("nav");
      if (item) {
        return item.href;
      } else {
        // no nav item found - look for an ncx file
        const ncxItems = this.findManifestItemsWithMediaType(
          "application/x-dtbncx+xml"
        );
        if (ncxItem.length > 0) {
          return ncxItems[0].href;
        }
      }
    }

    return;
  }

  /**
   * Get the spine's array of itemref elements. Each itemref has an idref attribute.
   * The idref references a manifest item id.
   * The order of this array determines the order of repesentation of the manifest items.
   * the linear attribute indicates if the itemref is in lineaorder representation order
   * or is auxiliary content.
   * see: http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4
   */
  get spineItemrefs() {
    const items = this._content.package.spine[0].item.map(item => {
      return {
        idref: item.$.idref,
        linear: item.$.linear || true
      };
    });
    return items;
  }

  addManifestItem(href, id, mediaType) {
    if (!this._content) {
      console.error("No content in OPF");
      return;
    }

    this._content.package.manifest[0].item.push({
      $: {
        href: href,
        id: id,
        "media-type": mediaType
      }
    });
    this.sortManifest();
    return this._content.package.manifest;
  }

  sortManifest() {
    // sort by type and then by ID.
    const sortedManifest = this._content?.package?.manifest[0].item.sort(
      (a, b) => {
        const mediaTypeA = a.$["media-type"].toUpperCase();
        const mediaTypeB = b.$["media-type"].toUpperCase();
        if (mediaTypeA < mediaTypeB) {
          return -1;
        }
        if (mediaTypeA > mediaTypeB) {
          return 1;
        }

        const idA = a.$.id.toUpperCase();
        const idB = b.$.id.toUpperCase();

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
    const item = this._content.package.manifest[0].item.find(item => {
      return item?.$?.properties === prop;
    });

    if (item) {
      return {
        id: item.$.id,
        href: item.$.href,
        mediaType: item.$["media-type"],
        properties: item.$?.properties
      };
    }
  }

  /**
   * Find the manifest items with the given media-type attribute
   * @param {string} mediaType
   */
  findManifestItemsWithMediaType(mediaType) {
    const items = this._content.package.manifest[0].item
      .filter(item => {
        return item?.$["media-type"] === mediaType;
      })
      .map(item => {
        return {
          id: item.$.id,
          href: item.$.href,
          mediaType: item.$["media-type"],
          properties: item.$?.properties
        };
      });

    return items;
  }

  /**
   * Find a manifest item with the given id value
   * @param {string} id
   */
  findManifestItemWithId(id) {
    const item = this._content.package.manifest[0].item.find(item => {
      return item.$.id === id;
    });

    if (item) {
      return {
        id: item.$.id,
        href: item.$.href,
        mediaType: item.$["media-type"],
        properties: item.$?.properties
      };
    }
  }

  findManifestItemIdSpinePosition(id) {
    const index = this._content.package.spine[0].itemref.findIndex(itemref => {
      return itemref.$.idref === id;
    });

    return index;
  }

  addSpineItemrefAtPosition(position, idref, linear = true) {
    if (!this._content) {
      console.error("No content in OPF");
      return;
    }

    this._content.package.spine[0].itemref.splice(position, 0, {
      $: {
        idref: idref,
        linear: linear ? "yes" : "no"
      }
    });
    return this._content.package.spine;
  }

  addSpineItemrefAfterIdref(positionIdref, idref, linear = true) {
    if (!this._content) {
      console.error("No content in OPF");
      return;
    }
    const position = this.findManifestItemIdSpinePosition(positionIdref);
    if (position !== -1) {
      this.addSpineItemrefAtPosition(position, idref, linear);
    } else {
      console.error("id not found in manifest", positionIdref);
    }
  }
}

export default OpfManager;

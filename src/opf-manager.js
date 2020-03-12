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
   * Get's the tocx attribute of hte spine tag
   * The toc attribute value is the id of the toc item in the manifest
   */
  get spineToc() {
    return this._content.package.spine.$.toc;
  }

  set spineToc(toc) {
    this._content.package.spine.$.toc = toc;
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

  findManifestItemWithId(id) {
    const item = this._content.package.manifest[0].item.find(item => {
      return item.$.id === id;
    });

    return {
      id: item.$.id,
      href: item.$.href,
      mediaType: item.$["media-type"]
    };
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

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

  addManifestItem(href, id, mediaType) {
    if (!this._content) {
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
}

export default OpfManager;

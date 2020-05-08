import {
  parseXml,
  generateXml,
  filterAttributes,
  prepareItemsForXml,
} from "./utils/xml";
import DataElement from "./data-element";
import ContainerRootfiles from "./container-rootfiles";

/**
 * Manager for the container.xml file
 * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-container.xml
 */
class ContainerManager extends DataElement {
  constructor() {
    super("container", {
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container",
      version: undefined,
    });

    this._content = undefined;
    this.rawData = undefined;

    this.rootfiles = undefined;
  }

  init(data) {
    this._content = data;
  }

  async loadXml(data) {
    const result = await parseXml(data);
    if (result) {
      this.rawData = result;

      if (this.rawData.container.attr) {
        this.addAttributes(this.rawData.container.attr);
      }

      // construct the rootfiles section
      const rawRootfiles = result.container.rootfiles[0].rootfile;

      const rootfileDataList = rawRootfiles.map((rootfile) => {
        return rootfile.attr;
      });

      this.rootfiles = new ContainerRootfiles(rootfileDataList);
    }

    return result;
  }

  async getXml() {
    const xml = await generateXml(this.getXml2JsObject());
    return xml;
  }

  getXml2JsObject() {
    const xmlJsRootfiles = prepareItemsForXml(this.rootfiles.items);
    const rootfilesAttr = filterAttributes(this.rootfiles.attributes);
    if (rootfilesAttr) {
      xmlJsRootfiles.attr = rootfilesAttr;
    }

    const containerXmlJsData = {
      container: {
        attr: filterAttributes(this.attributes),
        rootfiles: [xmlJsRootfiles],
      },
    };

    return containerXmlJsData;
  }

  /**
   * Find the first rootfile element's full-path value.
   * @returns {string} - package file's location relative to the epub's root.
   */
  get rootFilePath() {
    const rootPath = this.rawData?.container?.rootfiles[0].rootfile[0]?.attr[
      "full-path"
    ];
    return rootPath;
  }

  get content() {
    return this._content;
  }
}

export default ContainerManager;

import {
  parseXml,
  generateXml,
  filterAttributes,
  prepareItemsForXml,
} from "./utils/xml";
import DataElement from "./data-element";
import ContainerRootfiles from "./container-rootfiles";
import ContainerRootfilesRootfile from "./container-rootfiles-rootfile";

/**
 * Manager for the container.xml file
 * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-container.xml
 */
class ContainerManager extends DataElement {
  constructor() {
    super("container", {
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container",
      version: "1.0",
    });

    this._rawData = undefined;

    this.rootfiles = undefined;
  }

  /**
   * Inititialize a new empty container
   * @param {string} opfLocation - path the opf file
   */
  create(opfLocation = "package.opf") {
    const defaultRootfile = new ContainerRootfilesRootfile(
      opfLocation,
      "application/oebps-package+xml"
    );
    this.rootfiles = new ContainerRootfiles([defaultRootfile]);
  }

  /**
   * Load and parse the provided xml
   * @param {string | buffer} data
   * @returns {object} - the resulting parsed xml object
   */
  async loadXml(data) {
    const result = await parseXml(data);
    if (result) {
      this._rawData = result;

      if (this._rawData.container.attr) {
        this.addAttributes(this._rawData.container.attr);
      }

      // construct the rootfiles section
      const rawRootfiles = result.container.rootfiles[0].rootfile;

      const rootfileDataList = rawRootfiles.map((rootfile) => {
        return rootfile.attr;
      });

      this.rootfiles = new ContainerRootfiles(rootfileDataList);
    }

    return this._rawData;
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
    const rootPath = this.rootfiles?.items[0]["full-path"];
    return rootPath;
  }
}

export default ContainerManager;

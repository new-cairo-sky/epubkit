export default ContainerManager;
/**
 * Manager for the container.xml file
 * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-container.xml
 */
declare class ContainerManager extends DataElement {
    _rawData: object | undefined;
    rootfiles: ContainerRootfiles | undefined;
    /**
     * Inititialize a new empty container
     * @param {string} opfLocation - path the opf file
     */
    create(opfLocation?: string): void;
    /**
     * Build the xml2Js object for conversion to raw xml
     * @returns {object}
     */
    getXml2JsObject(): object;
    /**
     * Find the first rootfile element's full-path value.
     * @returns {string} - package file's location relative to the epub's root.
     */
    get rootFilePath(): string;
}
import DataElement from "./data-element";
import ContainerRootfiles from "./container-rootfiles";

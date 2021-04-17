/**
 * Package manager to create and edit opf files.
 * https://www.w3.org/publishing/epub32/epub-packages.html
 */
export default class PackageManager extends PackageElement {
    constructor(locationInEpub?: string);
    _location: string;
    metadata: PackageMetadata | undefined;
    manifest: PackageManifest | undefined;
    spine: PackageSpine | undefined;
    rawData: object | undefined;
    set location(arg: string);
    get location(): string;
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
    setUniqueIdentifier(value: string, id?: string): void;
    /**
     * Find the epub unique-identifer value
     */
    findUniqueIdentifier(): string | undefined;
    /**
     * Legacy Epub 2.0 specification states that a spine element with the 'toc' attribute
     * identifies the idref of the NCX file in the manifest
     * TODO - handle relative and absolute urls. resolve path
     */
    findNcxFilePath(): any;
    /**
     * Find the href of the manifest item with properties="nav" attribute
     * https://www.w3.org/publishing/epub32/epub-packages.html#sec-package-nav
     * TODO - handle relative and absolute urls. resolve path
     */
    findNavigationFilePath(): any;
    /**
     * Initialize a new empty package.
     */
    create(): void;
    /**
     * Build the xml2Js object for conversion to raw xml
     * @returns {object}
     */
    getXml2JsObject(): object;
}
import PackageElement from "./package-element";
import PackageMetadata from "./package-metadata";
import PackageManifest from "./package-manifest";
import PackageSpine from "./package-spine";

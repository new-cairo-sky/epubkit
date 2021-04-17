export default OpfManager;
/**
 * Manager for the opf file
 * https://www.w3.org/publishing/epub32/epub-packages.html
 */
declare class OpfManager {
    _content: object | undefined;
    _loaded: boolean;
    /**
     * Initialize the opf with provided data.
     * @param {object} data
     */
    init(data: object): object;
    /**
     * Public API Getters and Setters
     */
    /**
     * Get the full opf content as an object
     */
    get content(): object | undefined;
    /**
     * Set the package's optional language direction attribute
     * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
     */
    set dir(arg: any);
    /**
     * Public properties of the root Package element.
     */
    /**
     * Get the package's optional language direction attribute
     * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
     */
    get dir(): any;
    /**
     * Set the package's optional id attribute
     * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
     * @param {string} id
     */
    set id(arg: string);
    /**
     * Get the package's optional id attribute
     * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
     * @returns {string}
     */
    get id(): string;
    /**
     * Set the root Package unique-identifier attribute
     * Note: this is NOT the UID, but the id of the metadata dc:identifier that holds the value.
     * https://www.w3.org/publishing/epub32/epub-packages.html#attrdef-package-unique-identifier
     * @param {string} id
     */
    set uniqueIdentifier(arg: string);
    /**
     * Get the root Package unique-identifier attribute.
     * Note: this is NOT the UID, but the id of the metadata dc:identifier that holds the value.
     * https://www.w3.org/publishing/epub32/epub-packages.html#attrdef-package-unique-identifier
     * @returns {string}
     */
    get uniqueIdentifier(): string;
    /**
     * Set the unique identifier value using the id provided by "unique-identifier"
     * package element attribute
     * https://www.w3.org/publishing/epub32/epub-packages.html#sec-opf-dcidentifier
     */
    set uniqueDCIdentifier(arg: any);
    /**
     * Get the actual unique identifier value using the id provided by "unique-identifier"
     * package element attribute
     * https://www.w3.org/publishing/epub32/epub-packages.html#sec-opf-dcidentifier
     */
    get uniqueDCIdentifier(): any;
    /**
     * Get array of manifest objects
     * @returns {array} - an array of objects in the shape of
     * [{
     *  id: string,
     *  href: string,
     *  mediaType: string
     * }]
     */
    get manifestItems(): any;
    /**
     * Metadata
     * http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.2
     */
    /**
     * Get the opf metadata as an object with keys for each entry.
     * The metadata tags attributes are added to the key 'attributes'
     * @returns {object} - an object of keyed metadata
     */
    get metadata(): object;
    get rawMetadata(): any;
    /**
     *
     * @param {string} key - key of the metadata
     * @param {string} value - the value of the metadata
     * @param {array} attributes - list of attribute objects: [{key: value}]
     */
    addMetadata(key: string, value: string, attributes?: any): void;
    removeMetadata(key: any, id?: any): void;
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
    findMetadataValue(key: string): any;
    findMetadataValueWithAttribute(attrKey: any, attrValue?: any): any[];
    /**
     * Find the title metadate entries, if any
     * @returns {array}
     */
    findMetadataTitles(): any;
    findMetadataCreators(): any;
    /**
     * Set the spine's TOC attribute
     * @param {string} toc
     */
    set spineToc(arg: string);
    /**
     * Get's the toc attribute of the spine tag
     * The toc attribute value is the id of the toc item in the manifest
     */
    get spineToc(): string;
    /**
     * Try to find the href of the nav file.
     * Looks for nav attribute and matches that to item id in the manifest.
     * Order of search is: OPF Spine toc, manifest item with nav "properties", ncx path
     */
    findTocHref(): any;
    /**
     * Find the relative TOC file path.
     * @param {string} relativeTo - return path relative to this directory
     */
    findTocPath(relativeTo?: string): string | undefined;
    /**
     * Find the path to the ncx file, if any.
     */
    findNcxPath(relativeTo: any): string;
    /**
     * Manifest Methods
     */
    addManifestItem(href: any, id: any, mediaType: any): any;
    sortManifest(): any;
    /**
     * Find the first manifest item with the given "properties" attribute value
     * @param {string} prop
     */
    findManifestItemWithProperties(prop: string): {
        id: any;
        href: any;
        mediaType: any;
        properties: any;
    } | undefined;
    /**
     * Find the manifest items with the given media-type attribute
     * @param {string} mediaType
     */
    findManifestItemsWithMediaType(mediaType: string): any;
    /**
     * Find a manifest item with the given id value
     * @param {string} id
     */
    findManifestItemWithId(id: string): {
        id: any;
        href: any;
        mediaType: any;
        properties: any;
    } | undefined;
    /**
     * Get the position of a manifest item with id
     * @param {string} id
     */
    findManifestItemIdSpinePosition(id: string): any;
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
    get spineItemrefs(): any;
    /**
     * Add an itemref item to the spine
     * @param {int} position
     * @param {string} idref
     * @param {bool} linear
     */
    addSpineItemrefAtPosition(position: any, idref: string, linear?: any): any;
    addSpineItemrefAfterIdref(positionIdref: any, idref: any, linear?: boolean): void;
}

interface _children {
    [key: string]: DataElement[];
}
interface Attributes {
    [key: string]: string | undefined;
}
export default class DataElement {
    _attributes: Attributes;
    _children: _children;
    _orderedChildren: DataElement[];
    element: string;
    value: string | undefined;
    [key: string]: any;
    constructor(element: string, value?: string, attributes?: object);
    get attributes(): Attributes;
    /**
     * Load and parse xml
     * @param {string} xml - the xml to parse
     * @param {boolean} recursive - set true to recursively parse children elements
     */
    loadXml(xml: string, recursive?: boolean): Promise<void>;
    /**
     * Parse an xml2Js object - primarily intended for use by loadXml method only
     * @param {object} xmlObj - an xml2js object
     * @param {boolean} recursive - if it should recurse through the children
     */
    parseXmlObj(xmlObj: object, recursive?: boolean): Promise<void>;
    addChild(name: string, child: DataElement): void;
    get children(): DataElement[];
    /**
     * Get the attributes, filtering out any that are empty
     */
    getFilteredAttributes(): Attributes | void;
    removeAttribute(key: string, value?: undefined): void;
    addAttributes(attributes: object): void;
    /**
     * Generate the actual xml data
     */
    getXml(isFragment?: boolean): Promise<object>;
    /**
     * Convert self into a plain data object, recursing children as needed.
     * This data can be passed to xml2Js builder method to convert to xml
     */
    prepareForXml(): object;
}
export {};

export default class PackageSpine extends PackageElement {
    constructor(items?: any[], options?: {});
    items: any[];
    addItem(idref: any, options?: {}): void;
    findItemWithId(id: any): any;
    removeItemWithId(id: any): void;
    findItemWithIdref(idref: any): any;
    removeItemWithIdref(idref: any): void;
    findItemsWithLinear(value: any): any[];
    /**
     * Finds items that have all of the attributes listed in the provided object.
     * If the onject attribute's value is undefined, then only the attribute name
     * is matched.
     * @param {object} attributes
     */
    findItemsWithAttributes(attributes: object): any[];
}
import PackageElement from "./package-element";

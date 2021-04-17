export default class PackageManifest extends PackageElement {
    constructor(items: any[] | undefined, id: any, location: any);
    _location: any;
    items: any[];
    set location(arg: any);
    get location(): any;
    addItem(id: any, href: any, mediaType: any, options?: {}, index?: any): void;
    addItemAfterId(posId: any, id: any, href: any, mediaType: any, options?: {}): void;
    addItemBeforeId(posId: any, id: any, href: any, mediaType: any, options?: {}): void;
    findItemWithId(id: any): any;
    removeItemWithId(id: any): void;
    findNav(): any;
    setNav(id: any): void;
    findItemWithHref(href: any): any;
    removeItemWithHref(href: any): void;
    findItemsWithMediaType(mediaType: any): any[];
    removeItemsWithMediaType(mediaType: any): void;
    /**
     * Finds items that have all of the attributes listed in the provided object.
     * If the onject attribute's value is undefined, then only the attribute name
     * is matched.
     * @param {object} attributes
     */
    findItemsWithAttributes(attributes: object): any[];
}
import PackageElement from "./package-element";

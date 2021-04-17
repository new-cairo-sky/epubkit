export default class PackageMetadata extends PackageElement {
    constructor(items?: any[], attributes?: {});
    items: PackageMetadataItem[];
    addItem(element: any, value?: string, attributes?: {}): void;
    removeItemsWithName(element: any): void;
    findItemsWithName(element: any): PackageMetadataItem[];
    findItemWithId(element: any, id: any): PackageMetadataItem | undefined;
    removeItemWithId(element: any, id: any): void;
    /**
     * Finds items that have all of the attributes listed in the provided object.
     * If the object attribute's value is undefined, then only the attribute name
     * is matched.
     * @param {object} attributes
     */
    findItemsWithAttributes(attributes: object): PackageMetadataItem[];
}
import PackageElement from "./package-element";
import PackageMetadataItem from "./package-metadata-item";

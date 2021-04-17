export default class ContainerRootfiles extends DataElement {
    constructor(items?: any[]);
    items: any[];
    addItem(fullPath: any, mediaType: any): void;
    removeItem(fullPath: any): void;
}
import DataElement from "./data-element";

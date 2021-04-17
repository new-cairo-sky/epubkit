export default class SignatureManifest extends DataElement {
    constructor(id?: string);
    references: any[];
    addReference(uri: any, transforms: any, digestMethod: string | undefined, digestValue: any): void;
    getReference(uri: any): any;
    /**
     * Remove a reference from the signature manifest
     * @param {string} uri - the URI of the reference
     */
    removeReference(uri: string): void;
}
import DataElement from "./data-element";

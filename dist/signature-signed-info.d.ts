export default class SignatureSignedInfo extends DataElement {
    constructor(id: any);
    canonicalizationMethod: SignatureCanonicalizationMethod;
    signatureMethod: SignatureSignatureMethod;
    reference: any[];
    addReference(uri: any, transforms: any, digestMethod: any, digestValue: any): void;
}
import DataElement from "./data-element";
import SignatureCanonicalizationMethod from "./signature-canonicalization-method";
import SignatureSignatureMethod from "./signature-signature-method";

export default class SignatureReference extends DataElement {
    constructor(uri: any, transforms: any, digestMethod: string | undefined, digestValue: any);
    transforms: any;
    digestMethod: SignatureDigestMethod;
    digestValue: SignatureDigestValue;
}
import DataElement from "./data-element";
import SignatureDigestMethod from "./signature-digest-method";
import SignatureDigestValue from "./signature-digest-value";

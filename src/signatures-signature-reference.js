import DataElement from "./data-element";
import SignaturesSignatureReferenceDigestMethod from "./signatures-signature-reference-digest-method";
import SignaturesSignatureReferenceDigestValue from "./signatures-signature-reference-digest-value";
import SignaturesSignatureReferenceTransform from "./signatures-signature-reference-transform";

// https://www.w3.org/TR/xml-c14n/

export default class SignaturesSignatureReference extends DataElement {
  constructor(
    uri,
    transforms,
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue
  ) {
    super("reference", undefined, { uri: uri });

    if (Array.isArray(transforms)) {
      this.transforms = transforms.map((transform) => {
        return new SignaturesSignatureReferenceTransform(transform);
      });
    }

    this.digestMethod = new SignaturesSignatureReferenceDigestMethod(
      digestMethod
    );

    this.digestValue = new SignaturesSignatureReferenceDigestValue(digestValue);
  }
}

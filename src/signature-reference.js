import DataElement from "./data-element";
import SignatureDigestMethod from "./signature-digest-method";
import SignatureDigestMethod from "./signature-digest-value";
import SignatureReferenceTransform from "./signature-reference-transform";

// https://www.w3.org/TR/xmldsig-core1/#sec-Reference

export default class SignatureReference extends DataElement {
  constructor(
    uri,
    transforms,
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue
  ) {
    super("reference", undefined, { uri: uri });

    if (Array.isArray(transforms)) {
      this.transforms = new DataElement("transforms");
      this.transforms.transform = transforms.map((transform) => {
        return new SignatureReferenceTransform(transform);
      });
    }

    this.digestMethod = new SignatureDigestMethod(digestMethod);

    this.digestValue = new SignatureDigestMethod(digestValue);
  }
}

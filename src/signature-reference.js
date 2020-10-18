import DataElement from "./data-element";
import SignatureDigestMethod from "./signature-digest-method";
import SignatureDigestValue from "./signature-digest-value";
import SignatureReferenceTransform from "./signature-reference-transform";

// https://www.w3.org/TR/xmldsig-core1/#sec-Reference

export default class SignatureReference extends DataElement {
  constructor(
    uri,
    transforms,
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue
  ) {
    super("Reference", undefined, { uri: uri });

    Object.defineProperty(this, "transforms", {
      configurable: true,
      get() {
        return this._transforms;
      },
      set(val) {
        if (Array.isArray(val)) {
          this._transforms = new DataElement("Transforms");
          this._transforms.transform = val.map((transform) => {
            return new SignatureReferenceTransform(transform);
          });
        }
      },
    });
    // if (Array.isArray(transforms)) {
    //   this.transforms = new DataElement("transforms");
    //   this.transforms.transform = transforms.map((transform) => {
    //     return new SignatureReferenceTransform(transform);
    //   });
    // }

    this.transforms = transforms;

    this.digestMethod = new SignatureDigestMethod(digestMethod);

    this.digestValue = new SignatureDigestValue(digestValue);
  }
}

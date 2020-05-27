import DataElement from "./data-element";
import SignaturesSignatureReference from "./signatures-signature-reference";

export default class SignaturesSignatureObjectManifest extends DataElement {
  constructor(id = "manifest") {
    super("manifest", undefined, {
      id: id,
    });
    this.references = [];
  }

  addReference(
    uri,
    transforms,
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue
  ) {
    this.references.push(
      new SignaturesSignatureReference(
        uri,
        transforms,
        digestMethod,
        digestValue
      )
    );
  }
}

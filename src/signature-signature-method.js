import DataElement from "./data-element";

export default class SignatureSignatureMethod extends DataElement {
  constructor() {
    super("SignatureMethod", undefined, {
      algorithm: "http://www.w3.org/2000/09/xmldsig#dsa-sha1",
    });
  }
}

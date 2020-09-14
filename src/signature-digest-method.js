import DataElement from "./data-element";

// https://www.w3.org/TR/xml-c14n/

export default class SignatureDigestMethod extends DataElement {
  constructor(algorithm) {
    super("digestMethod", undefined, { algorithm: algorithm });
  }
}

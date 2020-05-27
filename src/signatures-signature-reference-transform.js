import DataElement from "./data-element";

// https://www.w3.org/TR/xml-c14n/

export default class SignaturesSignatureReferenceTransform extends DataElement {
  constructor(algorithm) {
    super("transforms", undefined, { algorithm: algorithm });
  }
}

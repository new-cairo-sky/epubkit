import DataElement from "./data-element";

// https://www.w3.org/TR/xml-c14n/

export default class SignatureReferenceTransform extends DataElement {
  constructor(algorithm) {
    super("Transform", undefined, { algorithm: algorithm });
  }
}

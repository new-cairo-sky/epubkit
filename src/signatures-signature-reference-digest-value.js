import DataElement from "./data-element";

// https://www.w3.org/TR/xml-c14n/

export default class SignaturesSignatureReferenceDigestValue extends DataElement {
  constructor(value) {
    super("digestValue", value);
  }
}

import DataElement from "./data-element";

export default class SignatureDigestMethod extends DataElement {
  constructor(value) {
    super("DigestValue", value);
  }
}

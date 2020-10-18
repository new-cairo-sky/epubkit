import DataElement from "./data-element";

export default class SignatureCanonicalizationMethod extends DataElement {
  constructor() {
    super("CanonicalizationMethod", undefined, {
      algorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    });
  }
}

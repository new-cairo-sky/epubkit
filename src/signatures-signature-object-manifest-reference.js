import DataElement from "./data-element";

// https://www.w3.org/TR/xml-c14n/

export default class SignaturesSignatureObjectManifestReference extends DataElement {
  constructor(uri) {
    super("reference", undefined, {});
  }

  getData() {
    return {
      transforms: [
        new DataElement("transform", undefined, {
          Algorithm: "https://www.w3.org/TR/xml-c14n/",
        }),
      ],
      DigestMethod: new DataElement("DigestMethod", undefined, {
        Algorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
      }),
    };
  }
}

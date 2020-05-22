import DataElement from "./data-element";

export default class SignaturesSignatureObjectManifest extends DataElement {
  constructor(id = "manifest") {
    super("manifest", undefined, {
      id: id,
    });
  }
}

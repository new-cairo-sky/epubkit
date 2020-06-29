import DataElement from "./data-element";
import SignaturesSignatureReference from "./signatures-signature-reference";
import { generateXml, prepareItemForXml } from "./utils/xml";

export default class SignaturesSignatureObjectManifest extends DataElement {
  constructor(id = "manifest") {
    super("manifest", undefined, {
      id: id,
    });
    this.references = [];
  }

  async getXml() {
    const xml = await generateXml();
  }

  getXml2JsObject() {
    let refData = this.references.map((ref) => {
      const transforms = {};
      const transformList = ref.transforms.map((transform) => {
        return prepareItemForXml(transform);
      });
      transforms.transform = transformList;
      const digestMethod = prepareItemForXml(ref.digestMethod);
      const digestValue = prepareItemForXml(red.digestValue);
      const reference = prepareItemForXml(ref);
      reference.transforms = transforms;
      reference.digestMethod = digestMethod;
      reference.digestValue = digestValue;
      return reference;
    });
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

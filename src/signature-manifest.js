import DataElement from "./data-element";
import SignatureReference from "./signature-reference";
import { generateXml, prepareItemForXml } from "./utils/xml";

export default class SignatureManifest extends DataElement {
  constructor(id = "manifest") {
    super("Manifest", undefined, {
      id: id,
    });
    this.references = [];
  }

  // async getXml() {
  //   const xml = await generateXml(this.getXml2JsObject(), true);
  //   return xml;
  // }

  // getXml2JsObjectOld() {
  //   let refData = this.references.map((ref) => {
  //     const transforms = {};
  //     const transformList = ref.transforms.map((transform) => {
  //       return prepareItemForXml(transform);
  //     });
  //     transforms.transform = transformList;
  //     const digestMethod = prepareItemForXml(ref.digestMethod);
  //     const digestValue = prepareItemForXml(ref.digestValue);
  //     const reference = prepareItemForXml(ref);
  //     reference.transforms = transforms;
  //     reference.digestMethod = digestMethod;
  //     reference.digestValue = digestValue;
  //     return reference;
  //   });
  //   return refData;
  // }

  // getXml2JsObject() {
  //   const xmlObj = prepareItemForXml(this);
  //   const xmlSelf = { manifest: xmlObj };
  //   return xmlSelf;

  //   let refData = this.references.map((ref) => {
  //     return prepareItemForXml(ref);
  //   });

  //   return {
  //     manifest: {
  //       reference: refData,
  //     },
  //   };
  // }
  addReference(
    uri,
    transforms,
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue
  ) {
    if (this.getReference(uri)) {
      // reference already exists
      throw `Reference with uri "${uri}" already exists.`;
    }
    this.references.push(
      new SignatureReference(uri, transforms, digestMethod, digestValue)
    );
  }

  getReference(uri) {
    const found = this.references.find((ref) => ref.uri === uri);
    return found;
  }

  /**
   * Remove a reference from the signature manifest
   * @param {string} uri - the URI of the reference
   */
  removeReference(uri) {
    const index = this.references.findIndex((ref) => ref.uri === uri);
    if (index !== -1) {
      this.references.splice(index, 1);
    }
  }
}

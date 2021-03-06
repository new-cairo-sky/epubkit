/*
https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
https://www.w3.org/TR/2008/REC-xmldsig-core-20080610/#sec-EnvelopedSignature
https://github.com/PeculiarVentures/xmldsigjs

The original epub is signed using the signature + manifest method.
The signature.xml file is included in the sig manifest so that changes to the file cam be detected. 
A watermarked epub should maintain that orginal signature in the signatures.xml file and add a new
signature. The sig should be transformed using the Enveloped Signature Transform. In
this way the watermarked epub signature can be traced back and matched to original epub. 

Note that the Signature xml node, as a w3d standard has different attr case requirements
than other epub specs. Signature attr use PascalCase
*/

// import { Crypto } from "@peculiar/webcrypto";
import path from "path";
import * as xmldsigjs from "xmldsigjs";

import { generateXml, parseXml } from "./utils/xml";

import getEnvironment from "./utils/environment";

import DataElement from "./data-element";
import Signature from "./signature";

export default class SignaturesManager extends DataElement {
  constructor(epubLocation = "") {
    super("signatures", undefined, {
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container",
    });

    this._rawData = undefined;
    this.signatures = [];
    this.epubLocation = epubLocation;
    this.location = path.resolve(epubLocation, "./META-INF/signatures.xml");
  }

  initCrypto() {
    // only load the webcrypto pollyfill in node
    // xmldsigjs will default to native webcrypto in the browser
    if (getEnvironment() === "node") {
      const { Crypto } = require("@peculiar/webcrypto");
      const crypto = new Crypto();
      xmldsigjs.Application.setEngine("WebCrypto", crypto);
    }
  }

  async loadXml(data) {
    const result = await parseXml(data, false);
    if (result) {
      this._rawData = result;
    }

    // hashing can be resource intensive so we will run the async functions sequentially.
    this.signatures = [];
    for (const xmlSig of this._rawData.signatures.Signature) {
      const signature = new Signature(this.epubLocation);

      for (let [key, value] of Object.entries(xmlSig)) {
        if (key === "attr") {
          signature.addAttributes(xmlSig.attr);
        } else if (key === "signedInfo") {
          // add signature > signedInfo > references
          for (const xmlSignedInfoReference of xmlSig.signedInfo[0]
            ?.reference) {
            // todo: parse this info
            const uri = xmlSignedInfoReference.attr?.uri;
            const transforms = undefined;
            const digestMethod = undefined;
            const digestValue = undefined;
            signature.signedInfo.addReference(
              uri,
              transforms,
              digestMethod,
              digestValue
            );
          }
        } else if (key === "signatureValue") {
          const signatureValueValue = xmlSig.signatureValue[0]?.value;
          if (signatureValueValue) {
            signature.signatureValue.value = signatureValueValue;
          }
        } else if (key === "Object") {
          // add object > manifest attributes
          if (xmlSig.Object[0]?.Manifest[0]?.attr) {
            signature.object.manifest.addAttributes(
              xmlSig.Object[0].Manifest[0].attr
            );
          }
          // get the object > manifest > references
          for (const xmlManifestReference of xmlSig.Object[0].Manifest[0]
            .Reference) {
            const uri = xmlManifestReference.attr.uri;

            let transforms = [];
            for (const xmlTransform of xmlManifestReference?.Transforms[0]
              ?.Transform) {
              transforms.push(xmlTransform.attr.algorithm);
            }
            const digestMethod =
              xmlManifestReference?.DigestMethod[0].attr.algorithm;
            const digestValue = xmlManifestReference?.DigestValue[0].value;

            await signature.addManifestReference(
              uri,
              transforms,
              digestMethod,
              digestValue
            );
          }
        } else {
          // parse all other data with generic data-elements
          if (Array.isArray(value)) {
            signature[key] = await Promise.all(
              value.map(async (val) => {
                const dataElement = new DataElement(`${key}`);
                await dataElement.parseXmlObj(val, true);
                return dataElement;
              })
            );
          } else {
            signature[key] = new DataElement(key);
            await signature[key].parseXmlObj(value, true);
          }
          // if (this[key] && Array.isArray(this[key])) {
          //   const length = this[key].push(new DataElement(key));
          //   await this[key][length - 1].parseXmlObj(value, true);
          // } else if (this[key]) {
          //   this[key] = [this[key]];
          //   const length = this[key].push(new DataElement(key));
          //   await this[key][length - 1].parseXmlObj(value, true);
          // } else {
          //   this[key] = new DataElement(key);
          //   await this[key].parseXmlObj(value, true);
          // }
        }
      }
      this.signatures.push(signature);
    }

    return this._rawData;
  }

  create() {
    this.signatures = [];
  }

  addSignature(id) {
    this.signatures.push(new Signature(this.epubLocation, id));
  }

  getSignature(id) {
    return this.signatures.find((signature) => signature.id === id);
  }


  /**
  * The signatures.xml file should be included in the signature manifest, but it requires
  * an envelopedTransform. Ie. this will add signatures.xml file to the given signature's manifest.
  * 
  * @param {object} signature - a target signature data-element instance to add file into manifest. 
  */
  async addSelfToSignatureManifest(signature) {
    // get the enveloped transfromed xml for this signatures xml
    // note: we don't use the xmldsigjs XmlDsigEnvelopedSignatureTransform
    // because of issue https://github.com/PeculiarVentures/xmldsigjs/issues/49
    // TODO: patch when issue is fixed.
    const xml = await this.getEnvelopedSignatureTransformedXml(signature);

    // get the C14N Normalized xml
    const C14NTransform = new xmldsigjs.XmlDsigC14NTransform();
    const node = xmldsigjs.Parse(xml).documentElement;
    C14NTransform.LoadInnerXml(node);
    // GetOuput returns xml as string
    let data = C14NTransform.GetOutput();

    //console.log("after enveloped", new XMLSerializer().serializeToString(data));
    const digest = xmldsigjs.CryptoConfig.CreateHashAlgorithm(
      "http://www.w3.org/2001/04/xmlenc#sha256"
    );
    const digestValue = await digest.Digest(data);

    // the fileHash should be represented as a base64 string
    const base64Digest = Buffer.from(digestValue).toString("base64");
    await signature.addManifestReference(
      "META-INF/signatures.xml",
      [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "http://www.w3.org/TR/2001/REC-xml-c14n-2001031",
      ],
      "http://www.w3.org/2001/04/xmlenc#sha256",
      base64Digest
    );
  }

  /**
   * Returns a string represention of signatures xml, with 'enveloped transform' applied.
   * This will remove the provided Signature instance from signatures so that the xml can
   * be signed without recursion.
   * The xmldsigjs.XmlDsigEnvelopedSignatureTransform() is not used due to this issue:
   * https://github.com/PeculiarVentures/xmldsigjs/issues/49
   * The EnvelopedSignature transform is intended to remove only the direct ancestor
   * Signature of the transform.
   *
   * @param {object} envelopedSignature - the signature object instance to be enveloped
   * @returns {string} - enveloped xml
   */
  async getEnvelopedSignatureTransformedXml(envelopedSignature) {
    const xmlJsObject = this.prepareForXml();

    const sigIndex = this.signatures.findIndex(
      (sig) => sig == envelopedSignature
    );

    if (sigIndex !== -1) {
      xmlJsObject.signatures.Signature.splice(sigIndex, 1);
    }

    const xml = await generateXml(xmlJsObject);
    return xml;
  }
}

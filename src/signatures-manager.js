/*
https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
https://www.w3.org/TR/2008/REC-xmldsig-core-20080610/#sec-EnvelopedSignature
https://github.com/PeculiarVentures/xmldsigjs

The original epub is signed using the signature + manifest method.
The signature.xml file is included in the sig manifest so that changes to the file cam be detected. 
A watermarked epub should maintain that orginal signature in the signatures.xml file and add a new
signature. The sig should be transformed using the Enveloped Signature Transform. In
this way the watermarked epub signature can be traced back and matched to original epub. 

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
    const result = await parseXml(data);
    if (result) {
      this._rawData = result;
    }

    // hashing can be resource intensive so we will run the async functions sequentially.
    this.signatures = [];
    for (const xmlSig of this._rawData.signatures.signature) {
      const signature = new Signature(this.epubLocation);
      for (const xmlReference of xmlSig?.object[0].manifest[0].reference) {
        const uri = xmlReference.attr.URI;

        let transforms = [];
        for (const xmlTransform of xmlReference?.transforms[0]?.transform) {
          transforms.push(xmlTransform.attr.Algorithm);
        }
        const digestMethod = xmlReference?.digestMethod[0].attr.Algorithm;
        const digestValue = xmlReference?.digestValue[0].value;

        await signature.addManifestReference(
          uri,
          transforms,
          digestMethod,
          digestValue
        );
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
   * an envelopedTransform.
   */
  async addSelfToSignatureManifest(signature) {
    // get the enveloped transfromed xml for this signatures xml
    // note: we don't use the xmldsigjs XmlDsigEnvelopedSignatureTransform
    // because of issue https://github.com/PeculiarVentures/xmldsigjs/issues/49
    // TODO: patch when issue is fixed.
    const xml = this.getEnvelopedSignatureTransformedXml(signature);

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
    await this.addManifestReference(
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
   * The xmldsigjs.XmlDsigEnvelopedSignatureTransform() is not used becuase of issue:
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

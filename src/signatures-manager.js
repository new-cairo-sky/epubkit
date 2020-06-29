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
import { parseXml } from "./utils/xml";

import * as xmldsigjs from "xmldsigjs";

import getEnvironment from "./utils/environment";

import DataElement from "./data-element";
import SignaturesSignature from "./signatures-signature";

export default class SignaturesManager extends DataElement {
  constructor(epubLocation = "") {
    super("signatures", undefined, {
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container",
    });

    this._rawData = undefined;
    this.signatures = undefined;
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
      const signature = new SignaturesSignature(this.epubLocation);
      for (const xmlReference of xmlSig?.object[0].manifest[0].reference) {
        const uri = xmlReference.attr.URI;
        await signature.addManifestReference(uri);
      }
      this.signatures.push(signature);
    }
    return this._rawData;
  }
}

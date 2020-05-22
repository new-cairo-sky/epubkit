// import XmlDSigJs from "xmldsigjs";

import * as xmldsigjs from "xmldsigjs";

import DataElement from "./data-element";
import FileManager from "./file-manager";

export default class SignaturesSignature extends DataElement {
  constructor(id = "sig") {
    super("signature", undefined, {
      id: id,
      xmlns: "http://www.w3.org/2000/09/xmldsig#",
    });
  }

  async addManifestReference(location) {
    const digest = xmldsigjs.CryptoConfig.CreateHashAlgorithm(
      "http://www.w3.org/2001/04/xmlenc#sha256"
    );
    // digest.Digest() accepts a buffer - see the xmldsigjs/algorithm.ts file line 28
    // and https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    // https://github.com/w3c/webcrypto/issues/73
    const fileData = await FileManager.readFile(location);
    try {
      const fileHash = await digest.Digest(fileData);
      console.log("fileHash", fileHash);
    } catch (err) {
      console.error("error hashing file", err);
    }
  }
}

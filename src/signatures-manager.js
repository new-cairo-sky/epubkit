/*
https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
https://www.w3.org/TR/2008/REC-xmldsig-core-20080610/#sec-EnvelopedSignature
https://github.com/PeculiarVentures/xmldsigjs
*/

import { Crypto } from "@peculiar/webcrypto";
import * as xmldsigjs from "xmldsigjs";

import DataElement from "./data-element";

export default class SignaturesManager extends DataElement {
  constructor() {
    super("signatures", undefined, {
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container",
    });
  }

  async initCrypto() {
    const crypto = new Crypto();
    xmldsigjs.Application.setEngine("WebCrypto", crypto);
  }
}

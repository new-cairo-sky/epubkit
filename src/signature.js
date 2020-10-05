// import XmlDSigJs from "xmldsigjs";
import path from "path";

import * as xmldsigjs from "xmldsigjs";

import DataElement from "./data-element";
import FileManager from "./file-manager";
import SignatureManifest from "./signature-manifest";
import SignatureSignedInfo from "./signature-signed-info";

export default class Signature extends DataElement {
  constructor(epubLocation = "", id = "sig") {
    super("signature", undefined, {
      id: id,
      xmlns: "http://www.w3.org/2000/09/xmldsig#",
    });

    this.signedInfo = new SignatureSignedInfo();

    this.signatureValue = new DataElement("signatureValue");
    this.keyInfo = new DataElement("keyInfo");
    this.object = new DataElement("object");
    this.object.manifest = new SignatureManifest();
    this.epubLocation = epubLocation;
  }

  sign() {}

  getManifestXml() {}

  /**
   * Add a manifest reference to the signature. Using a manifest is the recommended signature form
   * in the epub spec. see: https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
   * and: https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
   * A comment in the example notes that xml/html files should be canonicalized before the digest is produced -
   * that is the approach taken below.
   *
   * Note that WebCrypto does not accept streams, so the entire file must be loaded into memory. Node has a 1gb
   * file size limit (?) - so large files cannot be digested.
   * see:
   * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
   * https://github.com/w3c/webcrypto/issues/
   *
   * @param {string} location path to the resource, relative to the epub root
   * @param {string} digestMethod - the digest standard to use. see https://github.com/PeculiarVentures/xmldsigjs
   */
  async addManifestReference(
    location,
    transforms = ["http://www.w3.org/TR/2001/REC-xml-c14n-2001031"],
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue = undefined
  ) {
    const digest = xmldsigjs.CryptoConfig.CreateHashAlgorithm(digestMethod);

    const fileExt = path.extname(location);

    const resolvedLocation = path.resolve(this.epubLocation, location);

    let data;

    if (digestValue) {
      // if digestValue is provided, use that
      this.object.manifest.addReference(
        location,
        transforms,
        digestMethod,
        digestValue
      );
    } else {
      // if no digestValue is provided, generate a new one

      const xmlExts = [".xml", ".xhtml", "html", ".opf", ".ncx"];

      /* Xml files should be canonicalized */
      if (xmlExts.includes(fileExt)) {
        // NOTE: the signatures.xml must be in the META-INF folder at the epub root

        const fileData = await FileManager.readFile(resolvedLocation, "utf8");

        if (!fileData) {
          console.error("Error: file could not be loaded", resolvedLocation);
        }

        const transform = new xmldsigjs.XmlDsigC14NTransform();
        const node = xmldsigjs.Parse(fileData).documentElement;
        transform.LoadInnerXml(node);
        data = transform.GetOutput();
      } else {
        // All other file types are left alone.
        // note: readFile will by default return a Uint8Array binary node buffer
        data = await FileManager.readFile(resolvedLocation);
      }

      try {
        const digestValue = await digest.Digest(data);

        // the fileHash should be represented as a base64 string
        const base64Digest = Buffer.from(digestValue).toString("base64");
        //console.log("digestValue", Buffer.from(digestValue).toString("hex"));
        this.object.manifest.addReference(
          location,
          transforms,
          digestMethod,
          base64Digest
        );
      } catch (err) {
        console.error("error hashing file", err);
      }
    }
  }
}
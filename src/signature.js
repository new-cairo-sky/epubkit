import path from "path";
import * as xmldsigjs from "xmldsigjs";

import DataElement from "./data-element";
import FileManager from "./file-manager";
import SignatureManifest from "./signature-manifest";
import SignatureSignedInfo from "./signature-signed-info";
import SignatureValue from "./signature-value";

export default class Signature extends DataElement {
  constructor(epubLocation = "", id = "sig") {
    // Note that the Signature and children tags need to be capitalized

    super("Signature", undefined, {
      id: id,
      xmlns: "http://www.w3.org/2000/09/xmldsig#",
    });

    this.signedInfo = new SignatureSignedInfo();
    this.signatureValue = new SignatureValue();
    this.keyInfo = new DataElement("KeyInfo");
    this.object = new DataElement("Object");
    this.object.manifest = new SignatureManifest();
    this.epubLocation = epubLocation;
  }

  /**
   * This will create a complete signature to add to the signatures.xml.
   * Often, the signatures.xml file itself would not be included in the manifest,
   * however to allow validation of the signature.xml file itelf, the envelope
   * transform can be used. In this case, adding or removing a signature
   * invalidates the signatures.xml file.
   *
   * The envelope transform removes the whole signature element containing the
   * transform from the signing process. In a Signatures.xml file, any previous
   * Signature nodes will be included in the signing.
   *
   * see:
   * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
   * https://www.w3.org/TR/xmldsig-core/#sec-EnvelopedSignature
   *
   * In the situation where epub watermarking chain of custody is desired,
   * each previous signatures.xml signature should be retained for self-validation against
   * the digest hash of the signature's manifest, but have the signature iteslf become
   * invalidated. Each subsequent signature will be signed with the full
   * signature history, recording a secure chain of signatures.
   */

  async sign() {
    const signer = new xmldsigjs.SignedXml();
    const key = await xmldsigjs.Application.crypto.subtle.generateKey(
      {
        name: "HMAC",
        hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      false,
      ["sign", "verify"]
    );

    const algorithm = {
      name: "HMAC",
    };

    const rawXml = await this.object.manifest.getXml();
    const xmlData = xmldsigjs.Parse(rawXml);

    const options = {
      id: this.id, // id of signature
      references: [
        {
          id: "ref_id", // ref id,
          uri: `#${this.object.manifest.id}`, // ref uri
          hash: "SHA-256", // hash algo to use
          transforms: ["c14n"], // array of transforms to use
        },
      ],
    };
    await signer.Sign(algorithm, key, xmlData, options);
    console.log("Sign result", signer.toString());
  }

  /**
   * Look for file in manifest and update the reference if it exists, otherwise create a new reference
   * @param {string} location location of file, relative to epub root
   * @param {array} transforms array of xmldsigjs transforms
   * @param {string} digestMethod xmldsigjs diest method
   * @param {string} digestValue option base64 encoded digest value. A new digest will be generated if omited
   */
  async addOrUpdateManifestReference(
    location,
    transforms = ["http://www.w3.org/TR/2001/REC-xml-c14n-2001031"],
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue = undefined
  ) {
    const existing = this.manifest.getReference(location);

    if (existing) {
      existing.uri = location;
      existing.transforms = transforms;
      existing.digestMethod = digestMethod;
      if (!digestValue) {
        digestValue = await this.generateFileDigest(location, digestMethod);
      }
      existing.digestValue = digestValue;
    } else {
      await this.addManifestReference(
        location,
        transforms,
        digestMethod,
        digestValue
      );
    }
  }

  /**
   * Create a base64 encoded digest hash of a file.
   * https://www.w3.org/TR/2008/REC-xmldsig-core-20080610/#sec-EnvelopedSignature
   * @param {string} location the location of the file relative to the epub root
   */
  async generateFileDigest(location, digestMethod) {
    const xmlExts = [".xml", ".xhtml", "html", ".opf", ".ncx"];

    const digest = xmldsigjs.CryptoConfig.CreateHashAlgorithm(digestMethod);

    const fileExt = path.extname(location);

    const resolvedLocation = path.resolve(this.epubLocation, location);

    let data;

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
      return base64Digest;
    } catch (err) {
      console.error("error hashing file", err);
      return;
    }
  }
  /**
   * Add a manifest reference to the signature. Using an Object > Manifest is the recommended signature form
   * in the epub spec. see: https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
   * A comment in the example notes that xml/html files should be canonicalized before the digest is produced -
   * that is the approach taken below.
   *
   * TODO! this does not apply the transforms. Currently all xml files are normalized downstream.
   * (see generateFileDigest above). or that transforms happened upstream and included in provided digestValue
   *
   * Note that WebCrypto does not accept streams, so the entire file must be loaded into memory. Node has a 1gb
   * file size limit (?) - so large files cannot be digested.
   * see:
   * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
   * https://github.com/w3c/webcrypto/issues/
   * https://www.w3.org/TR/2008/REC-xmldsig-core-20080610/#sec-EnvelopedSignature
   *
   * @param {string} location - path to the resource, relative to the epub root
   * @param {string} digestMethod - the digest standard to use. see https://github.com/PeculiarVentures/xmldsigjs
   */
  async addManifestReference(
    location,
    transforms = ["http://www.w3.org/TR/2001/REC-xml-c14n-2001031"],
    digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
    digestValue = undefined
  ) {
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
      const base64Digest = await this.generateFileDigest(
        location,
        digestMethod
      );

      if (base64Digest) {
        this.object.manifest.addReference(
          location,
          transforms,
          digestMethod,
          base64Digest
        );
      }
    }
  }
}

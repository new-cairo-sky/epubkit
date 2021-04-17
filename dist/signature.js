"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var xmldsigjs = _interopRequireWildcard(require("xmldsigjs"));

var _dataElement = _interopRequireDefault(require("./data-element"));
var _fileManager = _interopRequireDefault(require("./file-manager"));
var _signatureManifest = _interopRequireDefault(require("./signature-manifest"));
var _signatureSignedInfo = _interopRequireDefault(require("./signature-signed-info"));
var _signatureValue = _interopRequireDefault(require("./signature-value"));
var _xml = require("./utils/xml");function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
 * This class manages the Signature node within the parent signatures.xml > signature node.
 * Note: the signature w3 spec uses snake case on names and attributes
 */
class Signature extends _dataElement.default {
  constructor(epubLocation = "", id = "sig") {
    // Note that the Signature and children tags need to be capitalized

    super("Signature", undefined, {
      id: id,
      xmlns: "http://www.w3.org/2000/09/xmldsig#" });


    this.signedInfo = new _signatureSignedInfo.default();
    this.signatureValue = new _signatureValue.default();
    this.keyInfo = new _dataElement.default("KeyInfo");
    this.object = new _dataElement.default("Object");
    this.object.manifest = new _signatureManifest.default();
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

  /**
   * Sign the signature
   * Signing with a privateKey should only be allowed in a node environment
   * https://github.com/PeculiarVentures/xmldsigjs#creating-a-xmldsig-signature
   * https://www.w3.org/TR/WebCryptoAPI/#algorithms
   * https://www.w3.org/TR/xmldsig-core/#sec-KeyValue
   */
  async sign(privateKey, publicKey) {
    const signer = new xmldsigjs.SignedXml();

    // https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypair_type_options_callback
    // see https://www.w3.org/TR/xmldsig-core/#sec-KeyValue
    // const privateKey = undefined;
    // const publicKey = undefined;

    const rawXml = await this.object.manifest.getXml();
    const xmlData = xmldsigjs.Parse(rawXml);
    const algorithm = { name: "RSASSA-PKCS1-v1_5" };
    const options = {
      id: this.id, // id of signature
      keyValue: publicKey,
      references: [
      {
        id: "ref_id", // ref id,
        uri: `#${this.object.manifest.id}`, // ref uri
        hash: "SHA-256", // hash algo to use
        transforms: ["c14n"] // array of transforms to use
      }] };


    await signer.Sign(algorithm, privateKey, xmlData, options);

    // TODO find better allternative to this is hacky way to interoperate between xml2js and xmlsigjs's own xml lib.
    const xmlsigjsXml = signer.toString();
    const reparsedXmlData = await (0, _xml.parseXml)(xmlsigjsXml);

    const signatureValueData = reparsedXmlData['ds:signature']['ds:signaturevalue'];
    const keyInfoData = reparsedXmlData['ds:signature']['ds:keyinfo'];

    this.signatureValue = await this.parseXmlObj({ SignatureValue: signatureValueData });
    this.keyInfo = await this.parseXmlObj({ KeyInfo: keyInfoData });

    console.log("Sign result", this.getXml(true));
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
  digestValue = undefined)
  {
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
      digestValue);

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

    const fileExt = _path.default.extname(location);

    const resolvedLocation = _path.default.resolve(this.epubLocation, location);

    let data;

    /* Xml files should be canonicalized */
    if (xmlExts.includes(fileExt)) {
      // NOTE: the signatures.xml must be in the META-INF folder at the epub root

      const fileData = await _fileManager.default.readFile(resolvedLocation, "utf8");

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
      data = await _fileManager.default.readFile(resolvedLocation);
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
  digestValue = undefined)
  {
    if (digestValue) {
      // if digestValue is provided, use that
      this.object.manifest.addReference(
      location,
      transforms,
      digestMethod,
      digestValue);

    } else {
      // if no digestValue is provided, generate a new one
      const base64Digest = await this.generateFileDigest(
      location,
      digestMethod);


      if (base64Digest) {
        this.object.manifest.addReference(
        location,
        transforms,
        digestMethod,
        base64Digest);

      }
    }
  }}exports.default = Signature;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUuanMiXSwibmFtZXMiOlsiU2lnbmF0dXJlIiwiRGF0YUVsZW1lbnQiLCJjb25zdHJ1Y3RvciIsImVwdWJMb2NhdGlvbiIsImlkIiwidW5kZWZpbmVkIiwieG1sbnMiLCJzaWduZWRJbmZvIiwiU2lnbmF0dXJlU2lnbmVkSW5mbyIsInNpZ25hdHVyZVZhbHVlIiwiU2lnbmF0dXJlVmFsdWUiLCJrZXlJbmZvIiwib2JqZWN0IiwibWFuaWZlc3QiLCJTaWduYXR1cmVNYW5pZmVzdCIsInNpZ24iLCJwcml2YXRlS2V5IiwicHVibGljS2V5Iiwic2lnbmVyIiwieG1sZHNpZ2pzIiwiU2lnbmVkWG1sIiwicmF3WG1sIiwiZ2V0WG1sIiwieG1sRGF0YSIsIlBhcnNlIiwiYWxnb3JpdGhtIiwibmFtZSIsIm9wdGlvbnMiLCJrZXlWYWx1ZSIsInJlZmVyZW5jZXMiLCJ1cmkiLCJoYXNoIiwidHJhbnNmb3JtcyIsIlNpZ24iLCJ4bWxzaWdqc1htbCIsInRvU3RyaW5nIiwicmVwYXJzZWRYbWxEYXRhIiwic2lnbmF0dXJlVmFsdWVEYXRhIiwia2V5SW5mb0RhdGEiLCJwYXJzZVhtbE9iaiIsIktleUluZm8iLCJjb25zb2xlIiwibG9nIiwiYWRkT3JVcGRhdGVNYW5pZmVzdFJlZmVyZW5jZSIsImxvY2F0aW9uIiwiZGlnZXN0TWV0aG9kIiwiZGlnZXN0VmFsdWUiLCJleGlzdGluZyIsImdldFJlZmVyZW5jZSIsImdlbmVyYXRlRmlsZURpZ2VzdCIsImFkZE1hbmlmZXN0UmVmZXJlbmNlIiwieG1sRXh0cyIsImRpZ2VzdCIsIkNyeXB0b0NvbmZpZyIsIkNyZWF0ZUhhc2hBbGdvcml0aG0iLCJmaWxlRXh0IiwicGF0aCIsImV4dG5hbWUiLCJyZXNvbHZlZExvY2F0aW9uIiwicmVzb2x2ZSIsImRhdGEiLCJpbmNsdWRlcyIsImZpbGVEYXRhIiwiRmlsZU1hbmFnZXIiLCJyZWFkRmlsZSIsImVycm9yIiwidHJhbnNmb3JtIiwiWG1sRHNpZ0MxNE5UcmFuc2Zvcm0iLCJub2RlIiwiZG9jdW1lbnRFbGVtZW50IiwiTG9hZElubmVyWG1sIiwiR2V0T3V0cHV0IiwiRGlnZXN0IiwiYmFzZTY0RGlnZXN0IiwiQnVmZmVyIiwiZnJvbSIsImVyciIsImFkZFJlZmVyZW5jZSJdLCJtYXBwaW5ncyI6Im9HQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsU0FBTixTQUF3QkMsb0JBQXhCLENBQW9DO0FBQ2pEQyxFQUFBQSxXQUFXLENBQUNDLFlBQVksR0FBRyxFQUFoQixFQUFvQkMsRUFBRSxHQUFHLEtBQXpCLEVBQWdDO0FBQ3pDOztBQUVBLFVBQU0sV0FBTixFQUFtQkMsU0FBbkIsRUFBOEI7QUFDNUJELE1BQUFBLEVBQUUsRUFBRUEsRUFEd0I7QUFFNUJFLE1BQUFBLEtBQUssRUFBRSxvQ0FGcUIsRUFBOUI7OztBQUtBLFNBQUtDLFVBQUwsR0FBa0IsSUFBSUMsNEJBQUosRUFBbEI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLElBQUlDLHVCQUFKLEVBQXRCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQUlWLG9CQUFKLENBQWdCLFNBQWhCLENBQWY7QUFDQSxTQUFLVyxNQUFMLEdBQWMsSUFBSVgsb0JBQUosQ0FBZ0IsUUFBaEIsQ0FBZDtBQUNBLFNBQUtXLE1BQUwsQ0FBWUMsUUFBWixHQUF1QixJQUFJQywwQkFBSixFQUF2QjtBQUNBLFNBQUtYLFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0Q7O0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1ksUUFBSlksSUFBSSxDQUFDQyxVQUFELEVBQWFDLFNBQWIsRUFBd0I7QUFDaEMsVUFBTUMsTUFBTSxHQUFHLElBQUlDLFNBQVMs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aW1wb3J0ICogYXMgeG1sZHNpZ2pzIGZyb20gXCJ4bWxkc2lnanNcIjtcblxuaW1wb3J0IERhdGFFbGVtZW50IGZyb20gXCIuL2RhdGEtZWxlbWVudFwiO1xuaW1wb3J0IEZpbGVNYW5hZ2VyIGZyb20gXCIuL2ZpbGUtbWFuYWdlclwiO1xuaW1wb3J0IFNpZ25hdHVyZU1hbmlmZXN0IGZyb20gXCIuL3NpZ25hdHVyZS1tYW5pZmVzdFwiO1xuaW1wb3J0IFNpZ25hdHVyZVNpZ25lZEluZm8gZnJvbSBcIi4vc2lnbmF0dXJlLXNpZ25lZC1pbmZvXCI7XG5pbXBvcnQgU2lnbmF0dXJlVmFsdWUgZnJvbSBcIi4vc2lnbmF0dXJlLXZhbHVlXCI7XG5pbXBvcnQgeyBwYXJzZVhtbCB9IGZyb20gXCIuL3V0aWxzL3htbFwiO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgbWFuYWdlcyB0aGUgU2lnbmF0dXJlIG5vZGUgd2l0aGluIHRoZSBwYXJlbnQgc2lnbmF0dXJlcy54bWwgPiBzaWduYXR1cmUgbm9kZS5cbiAqIE5vdGU6IHRoZSBzaWduYXR1cmUgdzMgc3BlYyB1c2VzIHNuYWtlIGNhc2Ugb24gbmFtZXMgYW5kIGF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lnbmF0dXJlIGV4dGVuZHMgRGF0YUVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihlcHViTG9jYXRpb24gPSBcIlwiLCBpZCA9IFwic2lnXCIpIHtcbiAgICAvLyBOb3RlIHRoYXQgdGhlIFNpZ25hdHVyZSBhbmQgY2hpbGRyZW4gdGFncyBuZWVkIHRvIGJlIGNhcGl0YWxpemVkXG5cbiAgICBzdXBlcihcIlNpZ25hdHVyZVwiLCB1bmRlZmluZWQsIHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNcIixcbiAgICB9KTtcblxuICAgIHRoaXMuc2lnbmVkSW5mbyA9IG5ldyBTaWduYXR1cmVTaWduZWRJbmZvKCk7XG4gICAgdGhpcy5zaWduYXR1cmVWYWx1ZSA9IG5ldyBTaWduYXR1cmVWYWx1ZSgpO1xuICAgIHRoaXMua2V5SW5mbyA9IG5ldyBEYXRhRWxlbWVudChcIktleUluZm9cIik7XG4gICAgdGhpcy5vYmplY3QgPSBuZXcgRGF0YUVsZW1lbnQoXCJPYmplY3RcIik7XG4gICAgdGhpcy5vYmplY3QubWFuaWZlc3QgPSBuZXcgU2lnbmF0dXJlTWFuaWZlc3QoKTtcbiAgICB0aGlzLmVwdWJMb2NhdGlvbiA9IGVwdWJMb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIHdpbGwgY3JlYXRlIGEgY29tcGxldGUgc2lnbmF0dXJlIHRvIGFkZCB0byB0aGUgc2lnbmF0dXJlcy54bWwuXG4gICAqIE9mdGVuLCB0aGUgc2lnbmF0dXJlcy54bWwgZmlsZSBpdHNlbGYgd291bGQgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBtYW5pZmVzdCxcbiAgICogaG93ZXZlciB0byBhbGxvdyB2YWxpZGF0aW9uIG9mIHRoZSBzaWduYXR1cmUueG1sIGZpbGUgaXRlbGYsIHRoZSBlbnZlbG9wZVxuICAgKiB0cmFuc2Zvcm0gY2FuIGJlIHVzZWQuIEluIHRoaXMgY2FzZSwgYWRkaW5nIG9yIHJlbW92aW5nIGEgc2lnbmF0dXJlXG4gICAqIGludmFsaWRhdGVzIHRoZSBzaWduYXR1cmVzLnhtbCBmaWxlLlxuICAgKlxuICAgKiBUaGUgZW52ZWxvcGUgdHJhbnNmb3JtIHJlbW92ZXMgdGhlIHdob2xlIHNpZ25hdHVyZSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlXG4gICAqIHRyYW5zZm9ybSBmcm9tIHRoZSBzaWduaW5nIHByb2Nlc3MuIEluIGEgU2lnbmF0dXJlcy54bWwgZmlsZSwgYW55IHByZXZpb3VzXG4gICAqIFNpZ25hdHVyZSBub2RlcyB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSBzaWduaW5nLlxuICAgKlxuICAgKiBzZWU6XG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLW9jZi5odG1sI3NlYy1jb250YWluZXItbWV0YWluZi1zaWduYXR1cmVzLnhtbFxuICAgKiBodHRwczovL3d3dy53My5vcmcvVFIveG1sZHNpZy1jb3JlLyNzZWMtRW52ZWxvcGVkU2lnbmF0dXJlXG4gICAqXG4gICAqIEluIHRoZSBzaXR1YXRpb24gd2hlcmUgZXB1YiB3YXRlcm1hcmtpbmcgY2hhaW4gb2YgY3VzdG9keSBpcyBkZXNpcmVkLFxuICAgKiBlYWNoIHByZXZpb3VzIHNpZ25hdHVyZXMueG1sIHNpZ25hdHVyZSBzaG91bGQgYmUgcmV0YWluZWQgZm9yIHNlbGYtdmFsaWRhdGlvbiBhZ2FpbnN0XG4gICAqIHRoZSBkaWdlc3QgaGFzaCBvZiB0aGUgc2lnbmF0dXJlJ3MgbWFuaWZlc3QsIGJ1dCBoYXZlIHRoZSBzaWduYXR1cmUgaXRlc2xmIGJlY29tZVxuICAgKiBpbnZhbGlkYXRlZC4gRWFjaCBzdWJzZXF1ZW50IHNpZ25hdHVyZSB3aWxsIGJlIHNpZ25lZCB3aXRoIHRoZSBmdWxsXG4gICAqIHNpZ25hdHVyZSBoaXN0b3J5LCByZWNvcmRpbmcgYSBzZWN1cmUgY2hhaW4gb2Ygc2lnbmF0dXJlcy5cbiAgICovXG5cbiAgLyoqXG4gICAqIFNpZ24gdGhlIHNpZ25hdHVyZVxuICAgKiBTaWduaW5nIHdpdGggYSBwcml2YXRlS2V5IHNob3VsZCBvbmx5IGJlIGFsbG93ZWQgaW4gYSBub2RlIGVudmlyb25tZW50XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9QZWN1bGlhclZlbnR1cmVzL3htbGRzaWdqcyNjcmVhdGluZy1hLXhtbGRzaWctc2lnbmF0dXJlXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9XZWJDcnlwdG9BUEkvI2FsZ29yaXRobXNcbiAgICogaHR0cHM6Ly93d3cudzMub3JnL1RSL3htbGRzaWctY29yZS8jc2VjLUtleVZhbHVlXG4gICAqL1xuICBhc3luYyBzaWduKHByaXZhdGVLZXksIHB1YmxpY0tleSkge1xuICAgIGNvbnN0IHNpZ25lciA9IG5ldyB4bWxkc2lnanMuU2lnbmVkWG1sKCk7XG5cbiAgICAvLyBodHRwczovL25vZGVqcy5vcmcvYXBpL2NyeXB0by5odG1sI2NyeXB0b19jcnlwdG9fZ2VuZXJhdGVrZXlwYWlyX3R5cGVfb3B0aW9uc19jYWxsYmFja1xuICAgIC8vIHNlZSBodHRwczovL3d3dy53My5vcmcvVFIveG1sZHNpZy1jb3JlLyNzZWMtS2V5VmFsdWVcbiAgICAvLyBjb25zdCBwcml2YXRlS2V5ID0gdW5kZWZpbmVkO1xuICAgIC8vIGNvbnN0IHB1YmxpY0tleSA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHJhd1htbCA9IGF3YWl0IHRoaXMub2JqZWN0Lm1hbmlmZXN0LmdldFhtbCgpO1xuICAgIGNvbnN0IHhtbERhdGEgPSB4bWxkc2lnanMuUGFyc2UocmF3WG1sKTtcbiAgICBjb25zdCBhbGdvcml0aG0gPSB7IG5hbWU6IFwiUlNBU1NBLVBLQ1MxLXYxXzVcIiB9O1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBpZDogdGhpcy5pZCwgLy8gaWQgb2Ygc2lnbmF0dXJlXG4gICAgICBrZXlWYWx1ZTogcHVibGljS2V5LFxuICAgICAgcmVmZXJlbmNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IFwicmVmX2lkXCIsIC8vIHJlZiBpZCxcbiAgICAgICAgICB1cmk6IGAjJHt0aGlzLm9iamVjdC5tYW5pZmVzdC5pZH1gLCAvLyByZWYgdXJpXG4gICAgICAgICAgaGFzaDogXCJTSEEtMjU2XCIsIC8vIGhhc2ggYWxnbyB0byB1c2VcbiAgICAgICAgICB0cmFuc2Zvcm1zOiBbXCJjMTRuXCJdLCAvLyBhcnJheSBvZiB0cmFuc2Zvcm1zIHRvIHVzZVxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICAgIGF3YWl0IHNpZ25lci5TaWduKGFsZ29yaXRobSwgcHJpdmF0ZUtleSwgeG1sRGF0YSwgb3B0aW9ucyk7XG5cbiAgICAvLyBUT0RPIGZpbmQgYmV0dGVyIGFsbHRlcm5hdGl2ZSB0byB0aGlzIGlzIGhhY2t5IHdheSB0byBpbnRlcm9wZXJhdGUgYmV0d2VlbiB4bWwyanMgYW5kIHhtbHNpZ2pzJ3Mgb3duIHhtbCBsaWIuXG4gICAgY29uc3QgeG1sc2lnanNYbWwgPSBzaWduZXIudG9TdHJpbmcoKTtcbiAgICBjb25zdCByZXBhcnNlZFhtbERhdGEgPSBhd2FpdCBwYXJzZVhtbCh4bWxzaWdqc1htbCk7XG5cbiAgICBjb25zdCBzaWduYXR1cmVWYWx1ZURhdGEgPSByZXBhcnNlZFhtbERhdGFbJ2RzOnNpZ25hdHVyZSddWydkczpzaWduYXR1cmV2YWx1ZSddO1xuICAgIGNvbnN0IGtleUluZm9EYXRhID0gcmVwYXJzZWRYbWxEYXRhWydkczpzaWduYXR1cmUnXVsnZHM6a2V5aW5mbyddO1xuXG4gICAgdGhpcy5zaWduYXR1cmVWYWx1ZSA9IGF3YWl0IHRoaXMucGFyc2VYbWxPYmooe1NpZ25hdHVyZVZhbHVlOiBzaWduYXR1cmVWYWx1ZURhdGF9KTtcbiAgICB0aGlzLmtleUluZm8gPSBhd2FpdCB0aGlzLnBhcnNlWG1sT2JqKHtLZXlJbmZvOiBrZXlJbmZvRGF0YX0pO1xuXG4gICAgY29uc29sZS5sb2coXCJTaWduIHJlc3VsdFwiLCB0aGlzLmdldFhtbCh0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICogTG9vayBmb3IgZmlsZSBpbiBtYW5pZmVzdCBhbmQgdXBkYXRlIHRoZSByZWZlcmVuY2UgaWYgaXQgZXhpc3RzLCBvdGhlcndpc2UgY3JlYXRlIGEgbmV3IHJlZmVyZW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gbG9jYXRpb24gb2YgZmlsZSwgcmVsYXRpdmUgdG8gZXB1YiByb290XG4gICAqIEBwYXJhbSB7YXJyYXl9IHRyYW5zZm9ybXMgYXJyYXkgb2YgeG1sZHNpZ2pzIHRyYW5zZm9ybXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpZ2VzdE1ldGhvZCB4bWxkc2lnanMgZGllc3QgbWV0aG9kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaWdlc3RWYWx1ZSBvcHRpb24gYmFzZTY0IGVuY29kZWQgZGlnZXN0IHZhbHVlLiBBIG5ldyBkaWdlc3Qgd2lsbCBiZSBnZW5lcmF0ZWQgaWYgb21pdGVkXG4gICAqL1xuICBhc3luYyBhZGRPclVwZGF0ZU1hbmlmZXN0UmVmZXJlbmNlKFxuICAgIGxvY2F0aW9uLFxuICAgIHRyYW5zZm9ybXMgPSBbXCJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy14bWwtYzE0bi0yMDAxMDMxXCJdLFxuICAgIGRpZ2VzdE1ldGhvZCA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2XCIsXG4gICAgZGlnZXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLm1hbmlmZXN0LmdldFJlZmVyZW5jZShsb2NhdGlvbik7XG5cbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGV4aXN0aW5nLnVyaSA9IGxvY2F0aW9uO1xuICAgICAgZXhpc3RpbmcudHJhbnNmb3JtcyA9IHRyYW5zZm9ybXM7XG4gICAgICBleGlzdGluZy5kaWdlc3RNZXRob2QgPSBkaWdlc3RNZXRob2Q7XG4gICAgICBpZiAoIWRpZ2VzdFZhbHVlKSB7XG4gICAgICAgIGRpZ2VzdFZhbHVlID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUZpbGVEaWdlc3QobG9jYXRpb24sIGRpZ2VzdE1ldGhvZCk7XG4gICAgICB9XG4gICAgICBleGlzdGluZy5kaWdlc3RWYWx1ZSA9IGRpZ2VzdFZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLmFkZE1hbmlmZXN0UmVmZXJlbmNlKFxuICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgdHJhbnNmb3JtcyxcbiAgICAgICAgZGlnZXN0TWV0aG9kLFxuICAgICAgICBkaWdlc3RWYWx1ZVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgYmFzZTY0IGVuY29kZWQgZGlnZXN0IGhhc2ggb2YgYSBmaWxlLlxuICAgKiBodHRwczovL3d3dy53My5vcmcvVFIvMjAwOC9SRUMteG1sZHNpZy1jb3JlLTIwMDgwNjEwLyNzZWMtRW52ZWxvcGVkU2lnbmF0dXJlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiB0aGUgbG9jYXRpb24gb2YgdGhlIGZpbGUgcmVsYXRpdmUgdG8gdGhlIGVwdWIgcm9vdFxuICAgKi9cbiAgYXN5bmMgZ2VuZXJhdGVGaWxlRGlnZXN0KGxvY2F0aW9uLCBkaWdlc3RNZXRob2QpIHtcbiAgICBjb25zdCB4bWxFeHRzID0gW1wiLnhtbFwiLCBcIi54aHRtbFwiLCBcImh0bWxcIiwgXCIub3BmXCIsIFwiLm5jeFwiXTtcblxuICAgIGNvbnN0IGRpZ2VzdCA9IHhtbGRzaWdqcy5DcnlwdG9Db25maWcuQ3JlYXRlSGFzaEFsZ29yaXRobShkaWdlc3RNZXRob2QpO1xuXG4gICAgY29uc3QgZmlsZUV4dCA9IHBhdGguZXh0bmFtZShsb2NhdGlvbik7XG5cbiAgICBjb25zdCByZXNvbHZlZExvY2F0aW9uID0gcGF0aC5yZXNvbHZlKHRoaXMuZXB1YkxvY2F0aW9uLCBsb2NhdGlvbik7XG5cbiAgICBsZXQgZGF0YTtcblxuICAgIC8qIFhtbCBmaWxlcyBzaG91bGQgYmUgY2Fub25pY2FsaXplZCAqL1xuICAgIGlmICh4bWxFeHRzLmluY2x1ZGVzKGZpbGVFeHQpKSB7XG4gICAgICAvLyBOT1RFOiB0aGUgc2lnbmF0dXJlcy54bWwgbXVzdCBiZSBpbiB0aGUgTUVUQS1JTkYgZm9sZGVyIGF0IHRoZSBlcHViIHJvb3RcblxuICAgICAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBGaWxlTWFuYWdlci5yZWFkRmlsZShyZXNvbHZlZExvY2F0aW9uLCBcInV0ZjhcIik7XG5cbiAgICAgIGlmICghZmlsZURhdGEpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yOiBmaWxlIGNvdWxkIG5vdCBiZSBsb2FkZWRcIiwgcmVzb2x2ZWRMb2NhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyB4bWxkc2lnanMuWG1sRHNpZ0MxNE5UcmFuc2Zvcm0oKTtcbiAgICAgIGNvbnN0IG5vZGUgPSB4bWxkc2lnanMuUGFyc2UoZmlsZURhdGEpLmRvY3VtZW50RWxlbWVudDtcbiAgICAgIHRyYW5zZm9ybS5Mb2FkSW5uZXJYbWwobm9kZSk7XG4gICAgICBkYXRhID0gdHJhbnNmb3JtLkdldE91dHB1dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBbGwgb3RoZXIgZmlsZSB0eXBlcyBhcmUgbGVmdCBhbG9uZS5cbiAgICAgIC8vIG5vdGU6IHJlYWRGaWxlIHdpbGwgYnkgZGVmYXVsdCByZXR1cm4gYSBVaW50OEFycmF5IGJpbmFyeSBub2RlIGJ1ZmZlclxuICAgICAgZGF0YSA9IGF3YWl0IEZpbGVNYW5hZ2VyLnJlYWRGaWxlKHJlc29sdmVkTG9jYXRpb24pO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBkaWdlc3RWYWx1ZSA9IGF3YWl0IGRpZ2VzdC5EaWdlc3QoZGF0YSk7XG5cbiAgICAgIC8vIHRoZSBmaWxlSGFzaCBzaG91bGQgYmUgcmVwcmVzZW50ZWQgYXMgYSBiYXNlNjQgc3RyaW5nXG4gICAgICBjb25zdCBiYXNlNjREaWdlc3QgPSBCdWZmZXIuZnJvbShkaWdlc3RWYWx1ZSkudG9TdHJpbmcoXCJiYXNlNjRcIik7XG4gICAgICByZXR1cm4gYmFzZTY0RGlnZXN0O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIGhhc2hpbmcgZmlsZVwiLCBlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQWRkIGEgbWFuaWZlc3QgcmVmZXJlbmNlIHRvIHRoZSBzaWduYXR1cmUuIFVzaW5nIGFuIE9iamVjdCA+IE1hbmlmZXN0IGlzIHRoZSByZWNvbW1lbmRlZCBzaWduYXR1cmUgZm9ybVxuICAgKiBpbiB0aGUgZXB1YiBzcGVjLiBzZWU6IGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLW9jZi5odG1sI3NlYy1jb250YWluZXItbWV0YWluZi1zaWduYXR1cmVzLnhtbFxuICAgKiBBIGNvbW1lbnQgaW4gdGhlIGV4YW1wbGUgbm90ZXMgdGhhdCB4bWwvaHRtbCBmaWxlcyBzaG91bGQgYmUgY2Fub25pY2FsaXplZCBiZWZvcmUgdGhlIGRpZ2VzdCBpcyBwcm9kdWNlZCAtXG4gICAqIHRoYXQgaXMgdGhlIGFwcHJvYWNoIHRha2VuIGJlbG93LlxuICAgKlxuICAgKiBUT0RPISB0aGlzIGRvZXMgbm90IGFwcGx5IHRoZSB0cmFuc2Zvcm1zLiBDdXJyZW50bHkgYWxsIHhtbCBmaWxlcyBhcmUgbm9ybWFsaXplZCBkb3duc3RyZWFtLlxuICAgKiAoc2VlIGdlbmVyYXRlRmlsZURpZ2VzdCBhYm92ZSkuIG9yIHRoYXQgdHJhbnNmb3JtcyBoYXBwZW5lZCB1cHN0cmVhbSBhbmQgaW5jbHVkZWQgaW4gcHJvdmlkZWQgZGlnZXN0VmFsdWVcbiAgICpcbiAgICogTm90ZSB0aGF0IFdlYkNyeXB0byBkb2VzIG5vdCBhY2NlcHQgc3RyZWFtcywgc28gdGhlIGVudGlyZSBmaWxlIG11c3QgYmUgbG9hZGVkIGludG8gbWVtb3J5LiBOb2RlIGhhcyBhIDFnYlxuICAgKiBmaWxlIHNpemUgbGltaXQgKD8pIC0gc28gbGFyZ2UgZmlsZXMgY2Fubm90IGJlIGRpZ2VzdGVkLlxuICAgKiBzZWU6XG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TdWJ0bGVDcnlwdG8vZGlnZXN0XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS93M2Mvd2ViY3J5cHRvL2lzc3Vlcy9cbiAgICogaHR0cHM6Ly93d3cudzMub3JnL1RSLzIwMDgvUkVDLXhtbGRzaWctY29yZS0yMDA4MDYxMC8jc2VjLUVudmVsb3BlZFNpZ25hdHVyZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gLSBwYXRoIHRvIHRoZSByZXNvdXJjZSwgcmVsYXRpdmUgdG8gdGhlIGVwdWIgcm9vdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlnZXN0TWV0aG9kIC0gdGhlIGRpZ2VzdCBzdGFuZGFyZCB0byB1c2UuIHNlZSBodHRwczovL2dpdGh1Yi5jb20vUGVjdWxpYXJWZW50dXJlcy94bWxkc2lnanNcbiAgICovXG4gIGFzeW5jIGFkZE1hbmlmZXN0UmVmZXJlbmNlKFxuICAgIGxvY2F0aW9uLFxuICAgIHRyYW5zZm9ybXMgPSBbXCJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy14bWwtYzE0bi0yMDAxMDMxXCJdLFxuICAgIGRpZ2VzdE1ldGhvZCA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2XCIsXG4gICAgZGlnZXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgKSB7XG4gICAgaWYgKGRpZ2VzdFZhbHVlKSB7XG4gICAgICAvLyBpZiBkaWdlc3RWYWx1ZSBpcyBwcm92aWRlZCwgdXNlIHRoYXRcbiAgICAgIHRoaXMub2JqZWN0Lm1hbmlmZXN0LmFkZFJlZmVyZW5jZShcbiAgICAgICAgbG9jYXRpb24sXG4gICAgICAgIHRyYW5zZm9ybXMsXG4gICAgICAgIGRpZ2VzdE1ldGhvZCxcbiAgICAgICAgZGlnZXN0VmFsdWVcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIG5vIGRpZ2VzdFZhbHVlIGlzIHByb3ZpZGVkLCBnZW5lcmF0ZSBhIG5ldyBvbmVcbiAgICAgIGNvbnN0IGJhc2U2NERpZ2VzdCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVGaWxlRGlnZXN0KFxuICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgZGlnZXN0TWV0aG9kXG4gICAgICApO1xuXG4gICAgICBpZiAoYmFzZTY0RGlnZXN0KSB7XG4gICAgICAgIHRoaXMub2JqZWN0Lm1hbmlmZXN0LmFkZFJlZmVyZW5jZShcbiAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICB0cmFuc2Zvcm1zLFxuICAgICAgICAgIGRpZ2VzdE1ldGhvZCxcbiAgICAgICAgICBiYXNlNjREaWdlc3RcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;















var _path = _interopRequireDefault(require("path"));
var xmldsigjs = _interopRequireWildcard(require("xmldsigjs"));

var _xml = require("./utils/xml");

var _environment = _interopRequireDefault(require("./utils/environment"));

var _dataElement = _interopRequireDefault(require("./data-element"));
var _signature = _interopRequireDefault(require("./signature"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /*
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
*/ // import { Crypto } from "@peculiar/webcrypto";
class SignaturesManager extends _dataElement.default {constructor(epubLocation = "") {super("signatures", undefined, { xmlns: "urn:oasis:names:tc:opendocument:xmlns:container" });this._rawData = undefined;this.signatures = [];this.epubLocation = epubLocation;this.location = _path.default.resolve(epubLocation, "./META-INF/signatures.xml");}initCrypto() {
    // only load the webcrypto pollyfill in node
    // xmldsigjs will default to native webcrypto in the browser
    if ((0, _environment.default)() === "node") {
      const { Crypto } = require("@peculiar/webcrypto");
      const crypto = new Crypto();
      xmldsigjs.Application.setEngine("WebCrypto", crypto);
    }
  }

  async loadXml(data) {
    const result = await (0, _xml.parseXml)(data, false);
    if (result) {
      this._rawData = result;
    }

    // hashing can be resource intensive so we will run the async functions sequentially.
    this.signatures = [];
    for (const xmlSig of this._rawData.signatures.Signature) {
      const signature = new _signature.default(this.epubLocation);

      for (let [key, value] of Object.entries(xmlSig)) {
        if (key === "attr") {
          signature.addAttributes(xmlSig.attr);
        } else if (key === "signedInfo") {
          // add signature > signedInfo > references
          for (const xmlSignedInfoReference of (_xmlSig$signedInfo$ = xmlSig.signedInfo[0]) === null || _xmlSig$signedInfo$ === void 0 ? void 0 : _xmlSig$signedInfo$.
          reference) {var _xmlSig$signedInfo$, _xmlSignedInfoReferen;
            // todo: parse this info
            const uri = (_xmlSignedInfoReferen = xmlSignedInfoReference.attr) === null || _xmlSignedInfoReferen === void 0 ? void 0 : _xmlSignedInfoReferen.uri;
            const transforms = undefined;
            const digestMethod = undefined;
            const digestValue = undefined;
            signature.signedInfo.addReference(
            uri,
            transforms,
            digestMethod,
            digestValue);

          }
        } else if (key === "signatureValue") {var _xmlSig$signatureValu;
          const signatureValueValue = (_xmlSig$signatureValu = xmlSig.signatureValue[0]) === null || _xmlSig$signatureValu === void 0 ? void 0 : _xmlSig$signatureValu.value;
          if (signatureValueValue) {
            signature.signatureValue.value = signatureValueValue;
          }
        } else if (key === "Object") {var _xmlSig$Object$, _xmlSig$Object$$Manif;
          // add object > manifest attributes
          if ((_xmlSig$Object$ = xmlSig.Object[0]) !== null && _xmlSig$Object$ !== void 0 && (_xmlSig$Object$$Manif = _xmlSig$Object$.Manifest[0]) !== null && _xmlSig$Object$$Manif !== void 0 && _xmlSig$Object$$Manif.attr) {
            signature.object.manifest.addAttributes(
            xmlSig.Object[0].Manifest[0].attr);

          }
          // get the object > manifest > references
          for (const xmlManifestReference of xmlSig.Object[0].Manifest[0].
          Reference) {
            const uri = xmlManifestReference.attr.uri;

            let transforms = [];
            for (const xmlTransform of xmlManifestReference === null || xmlManifestReference === void 0 ? void 0 : (_xmlManifestReference = xmlManifestReference.Transforms[0]) === null || _xmlManifestReference === void 0 ? void 0 : _xmlManifestReference.
            Transform) {var _xmlManifestReference;
              transforms.push(xmlTransform.attr.algorithm);
            }
            const digestMethod =
            xmlManifestReference === null || xmlManifestReference === void 0 ? void 0 : xmlManifestReference.DigestMethod[0].attr.algorithm;
            const digestValue = xmlManifestReference === null || xmlManifestReference === void 0 ? void 0 : xmlManifestReference.DigestValue[0].value;

            await signature.addManifestReference(
            uri,
            transforms,
            digestMethod,
            digestValue);

          }
        } else {
          // parse all other data with generic data-elements
          if (Array.isArray(value)) {
            signature[key] = await Promise.all(
            value.map(async val => {
              const dataElement = new _dataElement.default(`${key}`);
              await dataElement.parseXmlObj(val, true);
              return dataElement;
            }));

          } else {
            signature[key] = new _dataElement.default(key);
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
    this.signatures.push(new _signature.default(this.epubLocation, id));
  }

  getSignature(id) {
    return this.signatures.find(signature => signature.id === id);
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
    "http://www.w3.org/2001/04/xmlenc#sha256");

    const digestValue = await digest.Digest(data);

    // the fileHash should be represented as a base64 string
    const base64Digest = Buffer.from(digestValue).toString("base64");
    await signature.addManifestReference(
    "META-INF/signatures.xml",
    [
    "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
    "http://www.w3.org/TR/2001/REC-xml-c14n-2001031"],

    "http://www.w3.org/2001/04/xmlenc#sha256",
    base64Digest);

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
    sig => sig == envelopedSignature);


    if (sigIndex !== -1) {
      xmlJsObject.signatures.Signature.splice(sigIndex, 1);
    }

    const xml = await (0, _xml.generateXml)(xmlJsObject);
    return xml;
  }}exports.default = SignaturesManager;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmVzLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiU2lnbmF0dXJlc01hbmFnZXIiLCJEYXRhRWxlbWVudCIsImNvbnN0cnVjdG9yIiwiZXB1YkxvY2F0aW9uIiwidW5kZWZpbmVkIiwieG1sbnMiLCJfcmF3RGF0YSIsInNpZ25hdHVyZXMiLCJsb2NhdGlvbiIsInBhdGgiLCJyZXNvbHZlIiwiaW5pdENyeXB0byIsIkNyeXB0byIsInJlcXVpcmUiLCJjcnlwdG8iLCJ4bWxkc2lnanMiLCJBcHBsaWNhdGlvbiIsInNldEVuZ2luZSIsImxvYWRYbWwiLCJkYXRhIiwicmVzdWx0IiwieG1sU2lnIiwiU2lnbmF0dXJlIiwic2lnbmF0dXJlIiwia2V5IiwidmFsdWUiLCJPYmplY3QiLCJlbnRyaWVzIiwiYWRkQXR0cmlidXRlcyIsImF0dHIiLCJ4bWxTaWduZWRJbmZvUmVmZXJlbmNlIiwic2lnbmVkSW5mbyIsInJlZmVyZW5jZSIsInVyaSIsInRyYW5zZm9ybXMiLCJkaWdlc3RNZXRob2QiLCJkaWdlc3RWYWx1ZSIsImFkZFJlZmVyZW5jZSIsInNpZ25hdHVyZVZhbHVlVmFsdWUiLCJzaWduYXR1cmVWYWx1ZSIsIk1hbmlmZXN0Iiwib2JqZWN0IiwibWFuaWZlc3QiLCJ4bWxNYW5pZmVzdFJlZmVyZW5jZSIsIlJlZmVyZW5jZSIsInhtbFRyYW5zZm9ybSIsIlRyYW5zZm9ybXMiLCJUcmFuc2Zvcm0iLCJwdXNoIiwiYWxnb3JpdGhtIiwiRGlnZXN0TWV0aG9kIiwiRGlnZXN0VmFsdWUiLCJhZGRNYW5pZmVzdFJlZmVyZW5jZSIsIkFycmF5IiwiaXNBcnJheSIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJ2YWwiLCJkYXRhRWxlbWVudCIsInBhcnNlWG1sT2JqIiwiY3JlYXRlIiwiYWRkU2lnbmF0dXJlIiwiaWQiLCJnZXRTaWduYXR1cmUiLCJmaW5kIiwiYWRkU2VsZlRvU2lnbmF0dXJlTWFuaWZlc3QiLCJ4bWwiLCJnZXRFbnZlbG9wZWRTaWduYXR1cmVUcmFuc2Zvcm1lZFhtbCIsIkMxNE5UcmFuc2Zvcm0iLCJYbWxEc2lnQzE0TlRyYW5zZm9ybSIsIm5vZGUiLCJQYXJzZSIsImRvY3VtZW50RWxlbWVudCIsIkxvYWRJbm5lclhtbCIsIkdldE91dHB1dCIsImRpZ2VzdCIsIkNyeXB0b0NvbmZpZyIsIkNyZWF0ZUhhc2hBbGdvcml0aG0iLCJEaWdlc3QiLCJiYXNlNjREaWdlc3QiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJlbnZlbG9wZWRTaWduYXR1cmUiLCJ4bWxKc09iamVjdCIsInByZXBhcmVGb3JYbWwiLCJzaWdJbmRleCIsImZpbmRJbmRleCIsInNpZyIsInNwbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsZ0UsNDlCQXhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEUsQ0FFQTtBQVdlLE1BQU1BLGlCQUFOLFNBQWdDQyxvQkFBaEMsQ0FBNEMsQ0FDekRDLFdBQVcsQ0FBQ0MsWUFBWSxHQUFHLEVBQWhCLEVBQW9CLENBQzdCLE1BQU0sWUFBTixFQUFvQkMsU0FBcEIsRUFBK0IsRUFDN0JDLEtBQUssRUFBRSxpREFEc0IsRUFBL0IsRUFJQSxLQUFLQyxRQUFMLEdBQWdCRixTQUFoQixDQUNBLEtBQUtHLFVBQUwsR0FBa0IsRUFBbEIsQ0FDQSxLQUFLSixZQUFMLEdBQW9CQSxZQUFwQixDQUNBLEtBQUtLLFFBQUwsR0FBZ0JDLGNBQUtDLE9BQUwsQ0FBYVAsWUFBYixFQUEyQiwyQkFBM0IsQ0FBaEIsQ0FDRCxDQUVEUSxVQUFVLEdBQUc7QUFDWDtBQUNBO0FBQ0EsUUFBSSxnQ0FBcUIsTUFBekIsRUFBaUM7QUFDL0IsWUFBTSxFQUFFQyxNQUFGLEtBQWFDLE9BQU8sQ0FBQyxxQkFBRCxDQUExQjtBQUNBLFlBQU1DLE1BQU0sR0FBRyxJQUFJRixNQUFKLEVBQWY7QUFDQUcsTUFB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O0FBR0EsVUFBTTFDLFdBQVcsR0FBRyxNQUFNd0MsTUFBTSxDQUFDRyxNQUFQLENBQWM1RCxJQUFkLENBQTFCOztBQUVBO0FBQ0EsVUFBTTZELFlBQVksR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVk5QyxXQUFaLEVBQXlCK0MsUUFBekIsQ0FBa0MsUUFBbEMsQ0FBckI7QUFDQSxVQUFNNUQsU0FBUyxDQUFDNkIsb0JBQVY7QUFDSiw2QkFESTtBQUVKO0FBQ0UsMkRBREY7QUFFRSxvREFGRixDQUZJOztBQU1KLDZDQU5JO0FBT0o0QixJQUFBQSxZQVBJLENBQU47O0FBU0Q7O0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQzJDLFFBQW5DWixtQ0FBbUMsQ0FBQ2dCLGtCQUFELEVBQXFCO0FBQzVELFVBQU1DLFdBQVcsR0FBRyxLQUFLQyxhQUFMLEVBQXBCOztBQUVBLFVBQU1DLFFBQVEsR0FBRyxLQUFLaEYsVUFBTCxDQUFnQmlGLFNBQWhCO0FBQ2RDLElBQUFBLEdBQUQsSUFBU0EsR0FBRyxJQUFJTCxrQkFERCxDQUFqQjs7O0FBSUEsUUFBSUcsUUFBUSxLQUFLLENBQUMsQ0FBbEIsRUFBcUI7QUFDbkJGLE1BQUFBLFdBQVcsQ0FBQzlFLFVBQVosQ0FBdUJlLFNBQXZCLENBQWlDb0UsTUFBakMsQ0FBd0NILFFBQXhDLEVBQWtELENBQWxEO0FBQ0Q7O0FBRUQsVUFBTXBCLEdBQUcsR0FBRyxNQUFNLHNCQUFZa0IsV0FBWixDQUFsQjtBQUNBLFdBQU9sQixHQUFQO0FBQ0QsR0FuTXdELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuaHR0cHM6Ly93d3cudzMub3JnL3B1Ymxpc2hpbmcvZXB1YjMyL2VwdWItb2NmLmh0bWwjc2VjLWNvbnRhaW5lci1tZXRhaW5mLXNpZ25hdHVyZXMueG1sXG5odHRwczovL3d3dy53My5vcmcvVFIvMjAwOC9SRUMteG1sZHNpZy1jb3JlLTIwMDgwNjEwLyNzZWMtRW52ZWxvcGVkU2lnbmF0dXJlXG5odHRwczovL2dpdGh1Yi5jb20vUGVjdWxpYXJWZW50dXJlcy94bWxkc2lnanNcblxuVGhlIG9yaWdpbmFsIGVwdWIgaXMgc2lnbmVkIHVzaW5nIHRoZSBzaWduYXR1cmUgKyBtYW5pZmVzdCBtZXRob2QuXG5UaGUgc2lnbmF0dXJlLnhtbCBmaWxlIGlzIGluY2x1ZGVkIGluIHRoZSBzaWcgbWFuaWZlc3Qgc28gdGhhdCBjaGFuZ2VzIHRvIHRoZSBmaWxlIGNhbSBiZSBkZXRlY3RlZC4gXG5BIHdhdGVybWFya2VkIGVwdWIgc2hvdWxkIG1haW50YWluIHRoYXQgb3JnaW5hbCBzaWduYXR1cmUgaW4gdGhlIHNpZ25hdHVyZXMueG1sIGZpbGUgYW5kIGFkZCBhIG5ld1xuc2lnbmF0dXJlLiBUaGUgc2lnIHNob3VsZCBiZSB0cmFuc2Zvcm1lZCB1c2luZyB0aGUgRW52ZWxvcGVkIFNpZ25hdHVyZSBUcmFuc2Zvcm0uIEluXG50aGlzIHdheSB0aGUgd2F0ZXJtYXJrZWQgZXB1YiBzaWduYXR1cmUgY2FuIGJlIHRyYWNlZCBiYWNrIGFuZCBtYXRjaGVkIHRvIG9yaWdpbmFsIGVwdWIuIFxuXG5Ob3RlIHRoYXQgdGhlIFNpZ25hdHVyZSB4bWwgbm9kZSwgYXMgYSB3M2Qgc3RhbmRhcmQgaGFzIGRpZmZlcmVudCBhdHRyIGNhc2UgcmVxdWlyZW1lbnRzXG50aGFuIG90aGVyIGVwdWIgc3BlY3MuIFNpZ25hdHVyZSBhdHRyIHVzZSBQYXNjYWxDYXNlXG4qL1xuXG4vLyBpbXBvcnQgeyBDcnlwdG8gfSBmcm9tIFwiQHBlY3VsaWFyL3dlYmNyeXB0b1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIHhtbGRzaWdqcyBmcm9tIFwieG1sZHNpZ2pzXCI7XG5cbmltcG9ydCB7IGdlbmVyYXRlWG1sLCBwYXJzZVhtbCB9IGZyb20gXCIuL3V0aWxzL3htbFwiO1xuXG5pbXBvcnQgZ2V0RW52aXJvbm1lbnQgZnJvbSBcIi4vdXRpbHMvZW52aXJvbm1lbnRcIjtcblxuaW1wb3J0IERhdGFFbGVtZW50IGZyb20gXCIuL2RhdGEtZWxlbWVudFwiO1xuaW1wb3J0IFNpZ25hdHVyZSBmcm9tIFwiLi9zaWduYXR1cmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lnbmF0dXJlc01hbmFnZXIgZXh0ZW5kcyBEYXRhRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKGVwdWJMb2NhdGlvbiA9IFwiXCIpIHtcbiAgICBzdXBlcihcInNpZ25hdHVyZXNcIiwgdW5kZWZpbmVkLCB7XG4gICAgICB4bWxuczogXCJ1cm46b2FzaXM6bmFtZXM6dGM6b3BlbmRvY3VtZW50OnhtbG5zOmNvbnRhaW5lclwiLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fcmF3RGF0YSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNpZ25hdHVyZXMgPSBbXTtcbiAgICB0aGlzLmVwdWJMb2NhdGlvbiA9IGVwdWJMb2NhdGlvbjtcbiAgICB0aGlzLmxvY2F0aW9uID0gcGF0aC5yZXNvbHZlKGVwdWJMb2NhdGlvbiwgXCIuL01FVEEtSU5GL3NpZ25hdHVyZXMueG1sXCIpO1xuICB9XG5cbiAgaW5pdENyeXB0bygpIHtcbiAgICAvLyBvbmx5IGxvYWQgdGhlIHdlYmNyeXB0byBwb2xseWZpbGwgaW4gbm9kZVxuICAgIC8vIHhtbGRzaWdqcyB3aWxsIGRlZmF1bHQgdG8gbmF0aXZlIHdlYmNyeXB0byBpbiB0aGUgYnJvd3NlclxuICAgIGlmIChnZXRFbnZpcm9ubWVudCgpID09PSBcIm5vZGVcIikge1xuICAgICAgY29uc3QgeyBDcnlwdG8gfSA9IHJlcXVpcmUoXCJAcGVjdWxpYXIvd2ViY3J5cHRvXCIpO1xuICAgICAgY29uc3QgY3J5cHRvID0gbmV3IENyeXB0bygpO1xuICAgICAgeG1sZHNpZ2pzLkFwcGxpY2F0aW9uLnNldEVuZ2luZShcIldlYkNyeXB0b1wiLCBjcnlwdG8pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWRYbWwoZGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBhcnNlWG1sKGRhdGEsIGZhbHNlKTtcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICB0aGlzLl9yYXdEYXRhID0gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIGhhc2hpbmcgY2FuIGJlIHJlc291cmNlIGludGVuc2l2ZSBzbyB3ZSB3aWxsIHJ1biB0aGUgYXN5bmMgZnVuY3Rpb25zIHNlcXVlbnRpYWxseS5cbiAgICB0aGlzLnNpZ25hdHVyZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHhtbFNpZyBvZiB0aGlzLl9yYXdEYXRhLnNpZ25hdHVyZXMuU2lnbmF0dXJlKSB7XG4gICAgICBjb25zdCBzaWduYXR1cmUgPSBuZXcgU2lnbmF0dXJlKHRoaXMuZXB1YkxvY2F0aW9uKTtcblxuICAgICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHhtbFNpZykpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJhdHRyXCIpIHtcbiAgICAgICAgICBzaWduYXR1cmUuYWRkQXR0cmlidXRlcyh4bWxTaWcuYXR0cik7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInNpZ25lZEluZm9cIikge1xuICAgICAgICAgIC8vIGFkZCBzaWduYXR1cmUgPiBzaWduZWRJbmZvID4gcmVmZXJlbmNlc1xuICAgICAgICAgIGZvciAoY29uc3QgeG1sU2lnbmVkSW5mb1JlZmVyZW5jZSBvZiB4bWxTaWcuc2lnbmVkSW5mb1swXVxuICAgICAgICAgICAgPy5yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgIC8vIHRvZG86IHBhcnNlIHRoaXMgaW5mb1xuICAgICAgICAgICAgY29uc3QgdXJpID0geG1sU2lnbmVkSW5mb1JlZmVyZW5jZS5hdHRyPy51cmk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1zID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3QgZGlnZXN0TWV0aG9kID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3QgZGlnZXN0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzaWduYXR1cmUuc2lnbmVkSW5mby5hZGRSZWZlcmVuY2UoXG4gICAgICAgICAgICAgIHVyaSxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtcyxcbiAgICAgICAgICAgICAgZGlnZXN0TWV0aG9kLFxuICAgICAgICAgICAgICBkaWdlc3RWYWx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInNpZ25hdHVyZVZhbHVlXCIpIHtcbiAgICAgICAgICBjb25zdCBzaWduYXR1cmVWYWx1ZVZhbHVlID0geG1sU2lnLnNpZ25hdHVyZVZhbHVlWzBdPy52YWx1ZTtcbiAgICAgICAgICBpZiAoc2lnbmF0dXJlVmFsdWVWYWx1ZSkge1xuICAgICAgICAgICAgc2lnbmF0dXJlLnNpZ25hdHVyZVZhbHVlLnZhbHVlID0gc2lnbmF0dXJlVmFsdWVWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIk9iamVjdFwiKSB7XG4gICAgICAgICAgLy8gYWRkIG9iamVjdCA+IG1hbmlmZXN0IGF0dHJpYnV0ZXNcbiAgICAgICAgICBpZiAoeG1sU2lnLk9iamVjdFswXT8uTWFuaWZlc3RbMF0/LmF0dHIpIHtcbiAgICAgICAgICAgIHNpZ25hdHVyZS5vYmplY3QubWFuaWZlc3QuYWRkQXR0cmlidXRlcyhcbiAgICAgICAgICAgICAgeG1sU2lnLk9iamVjdFswXS5NYW5pZmVzdFswXS5hdHRyXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBnZXQgdGhlIG9iamVjdCA+IG1hbmlmZXN0ID4gcmVmZXJlbmNlc1xuICAgICAgICAgIGZvciAoY29uc3QgeG1sTWFuaWZlc3RSZWZlcmVuY2Ugb2YgeG1sU2lnLk9iamVjdFswXS5NYW5pZmVzdFswXVxuICAgICAgICAgICAgLlJlZmVyZW5jZSkge1xuICAgICAgICAgICAgY29uc3QgdXJpID0geG1sTWFuaWZlc3RSZWZlcmVuY2UuYXR0ci51cmk7XG5cbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1zID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHhtbFRyYW5zZm9ybSBvZiB4bWxNYW5pZmVzdFJlZmVyZW5jZT8uVHJhbnNmb3Jtc1swXVxuICAgICAgICAgICAgICA/LlRyYW5zZm9ybSkge1xuICAgICAgICAgICAgICB0cmFuc2Zvcm1zLnB1c2goeG1sVHJhbnNmb3JtLmF0dHIuYWxnb3JpdGhtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRpZ2VzdE1ldGhvZCA9XG4gICAgICAgICAgICAgIHhtbE1hbmlmZXN0UmVmZXJlbmNlPy5EaWdlc3RNZXRob2RbMF0uYXR0ci5hbGdvcml0aG07XG4gICAgICAgICAgICBjb25zdCBkaWdlc3RWYWx1ZSA9IHhtbE1hbmlmZXN0UmVmZXJlbmNlPy5EaWdlc3RWYWx1ZVswXS52YWx1ZTtcblxuICAgICAgICAgICAgYXdhaXQgc2lnbmF0dXJlLmFkZE1hbmlmZXN0UmVmZXJlbmNlKFxuICAgICAgICAgICAgICB1cmksXG4gICAgICAgICAgICAgIHRyYW5zZm9ybXMsXG4gICAgICAgICAgICAgIGRpZ2VzdE1ldGhvZCxcbiAgICAgICAgICAgICAgZGlnZXN0VmFsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHBhcnNlIGFsbCBvdGhlciBkYXRhIHdpdGggZ2VuZXJpYyBkYXRhLWVsZW1lbnRzXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBzaWduYXR1cmVba2V5XSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICB2YWx1ZS5tYXAoYXN5bmMgKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFFbGVtZW50ID0gbmV3IERhdGFFbGVtZW50KGAke2tleX1gKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYXRhRWxlbWVudC5wYXJzZVhtbE9iaih2YWwsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhRWxlbWVudDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNpZ25hdHVyZVtrZXldID0gbmV3IERhdGFFbGVtZW50KGtleSk7XG4gICAgICAgICAgICBhd2FpdCBzaWduYXR1cmVba2V5XS5wYXJzZVhtbE9iaih2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmICh0aGlzW2tleV0gJiYgQXJyYXkuaXNBcnJheSh0aGlzW2tleV0pKSB7XG4gICAgICAgICAgLy8gICBjb25zdCBsZW5ndGggPSB0aGlzW2tleV0ucHVzaChuZXcgRGF0YUVsZW1lbnQoa2V5KSk7XG4gICAgICAgICAgLy8gICBhd2FpdCB0aGlzW2tleV1bbGVuZ3RoIC0gMV0ucGFyc2VYbWxPYmoodmFsdWUsIHRydWUpO1xuICAgICAgICAgIC8vIH0gZWxzZSBpZiAodGhpc1trZXldKSB7XG4gICAgICAgICAgLy8gICB0aGlzW2tleV0gPSBbdGhpc1trZXldXTtcbiAgICAgICAgICAvLyAgIGNvbnN0IGxlbmd0aCA9IHRoaXNba2V5XS5wdXNoKG5ldyBEYXRhRWxlbWVudChrZXkpKTtcbiAgICAgICAgICAvLyAgIGF3YWl0IHRoaXNba2V5XVtsZW5ndGggLSAxXS5wYXJzZVhtbE9iaih2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAvLyAgIHRoaXNba2V5XSA9IG5ldyBEYXRhRWxlbWVudChrZXkpO1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpc1trZXldLnBhcnNlWG1sT2JqKHZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc2lnbmF0dXJlcy5wdXNoKHNpZ25hdHVyZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Jhd0RhdGE7XG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5zaWduYXR1cmVzID0gW107XG4gIH1cblxuICBhZGRTaWduYXR1cmUoaWQpIHtcbiAgICB0aGlzLnNpZ25hdHVyZXMucHVzaChuZXcgU2lnbmF0dXJlKHRoaXMuZXB1YkxvY2F0aW9uLCBpZCkpO1xuICB9XG5cbiAgZ2V0U2lnbmF0dXJlKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuc2lnbmF0dXJlcy5maW5kKChzaWduYXR1cmUpID0+IHNpZ25hdHVyZS5pZCA9PT0gaWQpO1xuICB9XG5cblxuICAvKipcbiAgKiBUaGUgc2lnbmF0dXJlcy54bWwgZmlsZSBzaG91bGQgYmUgaW5jbHVkZWQgaW4gdGhlIHNpZ25hdHVyZSBtYW5pZmVzdCwgYnV0IGl0IHJlcXVpcmVzXG4gICogYW4gZW52ZWxvcGVkVHJhbnNmb3JtLiBJZS4gdGhpcyB3aWxsIGFkZCBzaWduYXR1cmVzLnhtbCBmaWxlIHRvIHRoZSBnaXZlbiBzaWduYXR1cmUncyBtYW5pZmVzdC5cbiAgKiBcbiAgKiBAcGFyYW0ge29iamVjdH0gc2lnbmF0dXJlIC0gYSB0YXJnZXQgc2lnbmF0dXJlIGRhdGEtZWxlbWVudCBpbnN0YW5jZSB0byBhZGQgZmlsZSBpbnRvIG1hbmlmZXN0LiBcbiAgKi9cbiAgYXN5bmMgYWRkU2VsZlRvU2lnbmF0dXJlTWFuaWZlc3Qoc2lnbmF0dXJlKSB7XG4gICAgLy8gZ2V0IHRoZSBlbnZlbG9wZWQgdHJhbnNmcm9tZWQgeG1sIGZvciB0aGlzIHNpZ25hdHVyZXMgeG1sXG4gICAgLy8gbm90ZTogd2UgZG9uJ3QgdXNlIHRoZSB4bWxkc2lnanMgWG1sRHNpZ0VudmVsb3BlZFNpZ25hdHVyZVRyYW5zZm9ybVxuICAgIC8vIGJlY2F1c2Ugb2YgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL1BlY3VsaWFyVmVudHVyZXMveG1sZHNpZ2pzL2lzc3Vlcy80OVxuICAgIC8vIFRPRE86IHBhdGNoIHdoZW4gaXNzdWUgaXMgZml4ZWQuXG4gICAgY29uc3QgeG1sID0gYXdhaXQgdGhpcy5nZXRFbnZlbG9wZWRTaWduYXR1cmVUcmFuc2Zvcm1lZFhtbChzaWduYXR1cmUpO1xuXG4gICAgLy8gZ2V0IHRoZSBDMTROIE5vcm1hbGl6ZWQgeG1sXG4gICAgY29uc3QgQzE0TlRyYW5zZm9ybSA9IG5ldyB4bWxkc2lnanMuWG1sRHNpZ0MxNE5UcmFuc2Zvcm0oKTtcbiAgICBjb25zdCBub2RlID0geG1sZHNpZ2pzLlBhcnNlKHhtbCkuZG9jdW1lbnRFbGVtZW50O1xuICAgIEMxNE5UcmFuc2Zvcm0uTG9hZElubmVyWG1sKG5vZGUpO1xuICAgIC8vIEdldE91cHV0IHJldHVybnMgeG1sIGFzIHN0cmluZ1xuICAgIGxldCBkYXRhID0gQzE0TlRyYW5zZm9ybS5HZXRPdXRwdXQoKTtcblxuICAgIC8vY29uc29sZS5sb2coXCJhZnRlciBlbnZlbG9wZWRcIiwgbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhkYXRhKSk7XG4gICAgY29uc3QgZGlnZXN0ID0geG1sZHNpZ2pzLkNyeXB0b0NvbmZpZy5DcmVhdGVIYXNoQWxnb3JpdGhtKFxuICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGEyNTZcIlxuICAgICk7XG4gICAgY29uc3QgZGlnZXN0VmFsdWUgPSBhd2FpdCBkaWdlc3QuRGlnZXN0KGRhdGEpO1xuXG4gICAgLy8gdGhlIGZpbGVIYXNoIHNob3VsZCBiZSByZXByZXNlbnRlZCBhcyBhIGJhc2U2NCBzdHJpbmdcbiAgICBjb25zdCBiYXNlNjREaWdlc3QgPSBCdWZmZXIuZnJvbShkaWdlc3RWYWx1ZSkudG9TdHJpbmcoXCJiYXNlNjRcIik7XG4gICAgYXdhaXQgc2lnbmF0dXJlLmFkZE1hbmlmZXN0UmVmZXJlbmNlKFxuICAgICAgXCJNRVRBLUlORi9zaWduYXR1cmVzLnhtbFwiLFxuICAgICAgW1xuICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlXCIsXG4gICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMteG1sLWMxNG4tMjAwMTAzMVwiLFxuICAgICAgXSxcbiAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2XCIsXG4gICAgICBiYXNlNjREaWdlc3RcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50aW9uIG9mIHNpZ25hdHVyZXMgeG1sLCB3aXRoICdlbnZlbG9wZWQgdHJhbnNmb3JtJyBhcHBsaWVkLlxuICAgKiBUaGlzIHdpbGwgcmVtb3ZlIHRoZSBwcm92aWRlZCBTaWduYXR1cmUgaW5zdGFuY2UgZnJvbSBzaWduYXR1cmVzIHNvIHRoYXQgdGhlIHhtbCBjYW5cbiAgICogYmUgc2lnbmVkIHdpdGhvdXQgcmVjdXJzaW9uLlxuICAgKiBUaGUgeG1sZHNpZ2pzLlhtbERzaWdFbnZlbG9wZWRTaWduYXR1cmVUcmFuc2Zvcm0oKSBpcyBub3QgdXNlZCBkdWUgdG8gdGhpcyBpc3N1ZTpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL1BlY3VsaWFyVmVudHVyZXMveG1sZHNpZ2pzL2lzc3Vlcy80OVxuICAgKiBUaGUgRW52ZWxvcGVkU2lnbmF0dXJlIHRyYW5zZm9ybSBpcyBpbnRlbmRlZCB0byByZW1vdmUgb25seSB0aGUgZGlyZWN0IGFuY2VzdG9yXG4gICAqIFNpZ25hdHVyZSBvZiB0aGUgdHJhbnNmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZW52ZWxvcGVkU2lnbmF0dXJlIC0gdGhlIHNpZ25hdHVyZSBvYmplY3QgaW5zdGFuY2UgdG8gYmUgZW52ZWxvcGVkXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gZW52ZWxvcGVkIHhtbFxuICAgKi9cbiAgYXN5bmMgZ2V0RW52ZWxvcGVkU2lnbmF0dXJlVHJhbnNmb3JtZWRYbWwoZW52ZWxvcGVkU2lnbmF0dXJlKSB7XG4gICAgY29uc3QgeG1sSnNPYmplY3QgPSB0aGlzLnByZXBhcmVGb3JYbWwoKTtcblxuICAgIGNvbnN0IHNpZ0luZGV4ID0gdGhpcy5zaWduYXR1cmVzLmZpbmRJbmRleChcbiAgICAgIChzaWcpID0+IHNpZyA9PSBlbnZlbG9wZWRTaWduYXR1cmVcbiAgICApO1xuXG4gICAgaWYgKHNpZ0luZGV4ICE9PSAtMSkge1xuICAgICAgeG1sSnNPYmplY3Quc2lnbmF0dXJlcy5TaWduYXR1cmUuc3BsaWNlKHNpZ0luZGV4LCAxKTtcbiAgICB9XG5cbiAgICBjb25zdCB4bWwgPSBhd2FpdCBnZW5lcmF0ZVhtbCh4bWxKc09iamVjdCk7XG4gICAgcmV0dXJuIHhtbDtcbiAgfVxufVxuIl19
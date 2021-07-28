"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.fontObfuscation = fontObfuscation;exports.idpfFontObfuscation = idpfFontObfuscation;exports.adobeFontObfuscation = adobeFontObfuscation;exports.getAdobeKeyFromIdentifier = getAdobeKeyFromIdentifier;exports.getIdpfKeyFromIdentifier = getIdpfKeyFromIdentifier;var _jssha = _interopRequireDefault(require("jssha"));
var _utf = _interopRequireDefault(require("utf8"));
var _xml = require("./utils/xml.js");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
 * The Epub font obfuscation spec is a self-inverting XOR process.
 * To unobfuscate just run the obfuscated font through the obfuscator again.
 * Based on the java implementations found at
 * https://github.com/dita4publishers/epub-font-obfuscator
 * and the C++ implementation at:
 * https://github.com/Sigil-Ebook/Sigil/blob/master/src/Misc/FontObfuscation.cpp
 *
 * The spec is found at:
 * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-resource-obfuscation
 */

/**
 * Uses the data from the package Opf and encryption.xml to find obfuscation method and key
 * TODO: this assumes that all fonts are obfuscated with the same method
 * The fontLocation option should be used to id the font obfuscation method within encrpytion.xml
 * @param {Buffer | Uint8Array} fontData - source font data
 * @param {string} opfXml - xml of opf file
 * @param {string} encryptionXml - xml of encryption.xml file
 * @param {string} fontLocation - (optional) the location of the font relative to the epub root
 */
async function fontObfuscation(
fontData,
opfXml,
encryptionXml,
fontLocation = undefined)
{var _fontEncryptedData, _fontEncryptedData$en, _fontEncryptedData$en2;
  const parsedOpfXml = await (0, _xml.parseXml)(opfXml);
  const parsedEncryptionXml = await (0, _xml.parseXml)(encryptionXml);
  const packageUniqueIdName = parsedOpfXml.package.attr["unique-identifier"];
  const uniqueIdEl = parsedOpfXml.package.metadata[0]["dc:identifier"].find(
  idEl => {var _idEl$attr;
    return (idEl === null || idEl === void 0 ? void 0 : (_idEl$attr = idEl.attr) === null || _idEl$attr === void 0 ? void 0 : _idEl$attr.id) === packageUniqueIdName;
  });

  const uniqueId = uniqueIdEl.val;

  let fontEncryptedData;
  if (fontLocation) {var _parsedEncryptionXml$;
    // if fontLocation is provided, look for it in the encryption references
    fontEncryptedData = parsedEncryptionXml === null || parsedEncryptionXml === void 0 ? void 0 : (_parsedEncryptionXml$ = parsedEncryptionXml.encryption) === null || _parsedEncryptionXml$ === void 0 ? void 0 : _parsedEncryptionXml$[
    "enc:encrypteddata"].
    find(encryptedData => {var _encryptedData$encCi, _encryptedData$encCi$;
      const cipherReference = encryptedData === null || encryptedData === void 0 ? void 0 : (_encryptedData$encCi = encryptedData["enc:cipherdata"]) === null || _encryptedData$encCi === void 0 ? void 0 : (_encryptedData$encCi$ = _encryptedData$encCi[0]) === null || _encryptedData$encCi$ === void 0 ? void 0 : _encryptedData$encCi$[
      "enc:cipherreference"].
      find(ref => ref.attr.uri === fontLocation);
      if (cipherReference) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    // otherwise look to see if either adobe or idpf is listed at all and take the first one found
    fontEncryptedData = parsedEncryptionXml.encryption[
    "enc:encrypteddata"].
    find(encryptedData => {var _encryptedData$encEn, _encryptedData$encEn$;
      const method =
      encryptedData === null || encryptedData === void 0 ? void 0 : (_encryptedData$encEn = encryptedData["enc:encryptionmethod"]) === null || _encryptedData$encEn === void 0 ? void 0 : (_encryptedData$encEn$ = _encryptedData$encEn[0].attr) === null || _encryptedData$encEn$ === void 0 ? void 0 : _encryptedData$encEn$.algorithm;
      return (
        method.indexOf("ns.adobe.com/pdf/enc") ||
        method.indexOf("www.idpf.org/2008/embedding"));

    });
  }
  const obfMethod = (_fontEncryptedData =
  fontEncryptedData) === null || _fontEncryptedData === void 0 ? void 0 : (_fontEncryptedData$en = _fontEncryptedData["enc:encryptionmethod"]) === null || _fontEncryptedData$en === void 0 ? void 0 : (_fontEncryptedData$en2 = _fontEncryptedData$en[0].attr) === null || _fontEncryptedData$en2 === void 0 ? void 0 : _fontEncryptedData$en2.algorithm;

  if (obfMethod && obfMethod.indexOf("ns.adobe.com/pdf/enc") !== -1) {
    return adobeFontObfuscation(fontData, uniqueId);
  } else if (
  obfMethod &&
  obfMethod.indexOf("www.idpf.org/2008/embedding") !== -1)
  {
    return idpfFontObfuscation(fontData, uniqueId);
  }
}

/**
 * Obfuscates/Unobfuscates the provided font data using the IDPF method.
 * The Obfuscation process is a self-inverting XOR process. Running this
 * method on an onfuscated font will unobfuscate it and vice-versa
 * @param {Buffer | Uint8Array} fontData - source data
 * @param {string} identifier - the opf id used to produce the sha-1 key
 * @returns {Uint8array} - the output data
 */
function idpfFontObfuscation(fontData, identifier) {
  let outputData = Uint8Array.from(fontData);
  const byteMask = getIdpfKeyFromIdentifier(identifier);

  if (byteMask.length !== 20) {
    console.error("idpfFontObfuscation Error: key is not 20 bytes");
    return;
  }

  for (let i = 0; i < 1040 && i < outputData.length; ++i) {
    outputData[i] = outputData[i] ^ byteMask[i % 20];
  }
  return outputData;
}

/**
 * Obfuscates the provided font data using the Adobe method.
 * The Obfuscation process is a self-inverting XOR process. Running this
 * method on an onfuscated font will unobfuscate it and vice-versa
 * @param {Buffer | Uint8Array} fontData - source data
 * @param {string} identifier - the opf id used to produce the sha-1 key
 * @returns {Uint8array} - the output data
 */
function adobeFontObfuscation(fontData, identifier) {
  let outputData = Uint8Array.from(fontData);
  const byteMask = getAdobeKeyFromIdentifier(identifier);

  if (byteMask.length === 0) {
    console.error("idpfFontObfuscation Error: key is empty");
    return;
  }

  for (let i = 0; i < 1024 && i < outputData.length; ++i) {
    outputData[i] = outputData[i] ^ byteMask[i % byteMask.length];
  }
  return outputData;
}

/**
 * Converts the OPF UID into binary buffer array used by the adobe font obfuscation spec.
 * Unfortunetly this requires the node Buffer module. For browser support epubkit relies
 * on the Buffer polyfill proided by BrowserFS (see the webpack config).
 *
 * @param {string} id - the UUID identified in the epub's opf
 * @returns {Buffer}
 */
function getAdobeKeyFromIdentifier(id) {
  const cleanId = id.
  replace("urn:uuid:", "").
  replace(/-/g, "").
  replace(/:/g, "");

  // the key is treated as raw hex data.
  return Buffer.from(cleanId, "hex");
}

/**
 * Converts the OPF UID into a key used by the IDPF font obfuscation spec.
 * @param {string} id - the UUID identified in the epub's opf
 */
function getIdpfKeyFromIdentifier(id) {
  const cleanId = id.replace(/[\u0020\u0009\u000D\u000A]/g, "");
  const utf8Key = _utf.default.encode(cleanId);
  // "A SHA-1 digest of the UTF-8 representation of the resulting string"
  const sha = new _jssha.default("SHA-1", "TEXT", { encoding: "UTF8" });
  sha.update(utf8Key);
  const shaKey = sha.getHash("UINT8ARRAY");
  return shaKey;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lcHViLWZvbnQtb2JmdXNjYXRvci5qcyJdLCJuYW1lcyI6WyJmb250T2JmdXNjYXRpb24iLCJmb250RGF0YSIsIm9wZlhtbCIsImVuY3J5cHRpb25YbWwiLCJmb250TG9jYXRpb24iLCJ1bmRlZmluZWQiLCJwYXJzZWRPcGZYbWwiLCJwYXJzZWRFbmNyeXB0aW9uWG1sIiwicGFja2FnZVVuaXF1ZUlkTmFtZSIsInBhY2thZ2UiLCJhdHRyIiwidW5pcXVlSWRFbCIsIm1ldGFkYXRhIiwiZmluZCIsImlkRWwiLCJpZCIsInVuaXF1ZUlkIiwidmFsIiwiZm9udEVuY3J5cHRlZERhdGEiLCJlbmNyeXB0aW9uIiwiZW5jcnlwdGVkRGF0YSIsImNpcGhlclJlZmVyZW5jZSIsInJlZiIsInVyaSIsIm1ldGhvZCIsImFsZ29yaXRobSIsImluZGV4T2YiLCJvYmZNZXRob2QiLCJhZG9iZUZvbnRPYmZ1c2NhdGlvbiIsImlkcGZGb250T2JmdXNjYXRpb24iLCJpZGVudGlmaWVyIiwib3V0cHV0RGF0YSIsIlVpbnQ4QXJyYXkiLCJmcm9tIiwiYnl0ZU1hc2siLCJnZXRJZHBmS2V5RnJvbUlkZW50aWZpZXIiLCJsZW5ndGgiLCJjb25zb2xlIiwiZXJyb3IiLCJpIiwiZ2V0QWRvYmVLZXlGcm9tSWRlbnRpZmllciIsImNsZWFuSWQiLCJyZXBsYWNlIiwiQnVmZmVyIiwidXRmOEtleSIsInV0ZjgiLCJlbmNvZGUiLCJzaGEiLCJqc1NIQSIsImVuY29kaW5nIiwidXBkYXRlIiwic2hhS2V5IiwiZ2V0SGFzaCJdLCJtYXBwaW5ncyI6InFWQUFBO0FBQ0E7QUFDQSxxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLGVBQWVBLGVBQWY7QUFDTEMsUUFESztBQUVMQyxNQUZLO0FBR0xDLGFBSEs7QUFJTEMsWUFBWSxHQUFHQyxTQUpWO0FBS0w7QUFDQSxRQUFNQyxZQUFZLEdBQUcsTUFBTSxtQkFBU0osTUFBVCxDQUEzQjtBQUNBLFFBQU1LLG1CQUFtQixHQUFHLE1BQU0sbUJBQVNKLGFBQVQsQ0FBbEM7QUFDQSxRQUFNSyxtQkFBbUIsR0FBR0YsWUFBWSxDQUFDRyxPQUFiLENBQXFCQyxJQUFyQixDQUEwQixtQkFBMUIsQ0FBNUI7QUFDQSxRQUFNQyxVQUFVLEdBQUdMLFlBQVksQ0FBQ0csT0FBYixDQUFxQkcsUUFBckIsQ0FBOEIsQ0FBOUIsRUFBaUMsZUFBakMsRUFBa0RDLElBQWxEO0FBQ2hCQyxFQUFBQSxJQUFELElBQVU7QUFDUixXQUFPLENBQUFBLElBQUksU0FBSixJQUFBQSxJQUFJLFdBQUosMEJBQUFBLElBQUksQ0FBRUosSUFBTiwwREFBWUssRUFBWixNQUFtQlAsbUJBQTFCO0FBQ0QsR0FIZ0IsQ0FBbkI7O0FBS0EsUUFBTVEsUUFBUSxHQUFHTCxVQUFVLENBQUNNLEdBQTVCOztBQUVBLE1BQUlDLGlCQUFKO0FBQ0EsTUFBSWQsWUFBSixFQUFrQjtBQUNoQjtBQUNBYyxJQUFBQSxpQkFBaUIsR0FBR1gsbUJBQUgsYUFBR0EsbUJBQUgsZ0RBQUdBLG1CQUFtQixDQUFFWSxVQUF4QiwwREFBRztBQUNsQix1QkFEa0I7QUFFbEJOLElBQUFBLElBRmtCLENBRVpPLGFBQUQsSUFBbUI7QUFDeEIsWUFBTUMsZUFBZSxHQUFHRCxhQUFILGFBQUdBLGFBQUgsK0NBQUdBLGFBQWEsQ0FBRyxnQkFBSCxDQUFoQixrRkFBRyxxQkFBb0MsQ0FBcEMsQ0FBSCwwREFBRztBQUN0QiwyQkFEc0I7QUFFdEJQLE1BQUFBLElBRnNCLENBRWhCUyxHQUFELElBQVNBLEdBQUcsQ0FBQ1osSUFBSixDQUFTYSxHQUFULEtBQWlCbkIsWUFGVCxDQUF4QjtBQUdBLFVBQUlpQixlQUFKLEVBQXFCO0FBQ25CLGVBQU8sSUFBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sS0FBUDtBQUNEO0FBQ0YsS0FYbUIsQ0FBcEI7QUFZRCxHQWRELE1BY087QUFDTDtBQUNBSCxJQUFBQSxpQkFBaUIsR0FBR1gsbUJBQW1CLENBQUNZLFVBQXBCO0FBQ2xCLHVCQURrQjtBQUVsQk4sSUFBQUEsSUFGa0IsQ0FFWk8sYUFBRCxJQUFtQjtBQUN4QixZQUFNSSxNQUFNO0FBQ1ZKLE1BQUFBLGFBRFUsYUFDVkEsYUFEVSwrQ0FDVkEsYUFBYSxDQUFHLHNCQUFILENBREgsa0ZBQ1YscUJBQTBDLENBQTFDLEVBQTZDVixJQURuQywwREFDVixzQkFBbURlLFNBRHJEO0FBRUE7QUFDRUQsUUFBQUEsTUFBTSxDQUFDRSxPQUFQLENBQWUsc0JBQWY7QUFDQUYsUUFBQUEsTUFBTSxDQUFDRSxPQUFQLENBQWUsNkJBQWYsQ0FGRjs7QUFJRCxLQVRtQixDQUFwQjtBQVVEO0FBQ0QsUUFBTUMsU0FBUztBQUNiVCxFQUFBQSxpQkFEYSxnRkFDYixtQkFBb0Isc0JBQXBCLENBRGEsb0ZBQ2Isc0JBQThDLENBQTlDLEVBQWlEUixJQURwQywyREFDYix1QkFBdURlLFNBRHpEOztBQUdBLE1BQUlFLFNBQVMsSUFBSUEsU0FBUyxDQUFDRCxPQUFWLENBQWtCLHNCQUFsQixNQUE4QyxDQUFDLENBQWhFLEVBQW1FO0FBQ2pFLFdBQU9FLG9CQUFvQixDQUFDM0IsUUFBRCxFQUFXZSxRQUFYLENBQTNCO0FBQ0QsR0FGRCxNQUVPO0FBQ0xXLEVBQUFBLFNBQVM7QUFDVEEsRUFBQUEsU0FBUyxDQUFDRCxPQUFWLENBQWtCLDZCQUFsQixNQUFxRCxDQUFDLENBRmpEO0FBR0w7QUFDQSxXQUFPRyxtQkFBbUIsQ0FBQzVCLFFBQUQsRUFBV2UsUUFBWCxDQUExQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNhLG1CQUFULENBQTZCNUIsUUFBN0IsRUFBdUM2QixVQUF2QyxFQUFtRDtBQUN4RCxNQUFJQyxVQUFVLEdBQUdDLFVBQVUsQ0FBQ0MsSUFBWCxDQUFnQmhDLFFBQWhCLENBQWpCO0FBQ0EsUUFBTWlDLFFBQVEsR0FBR0Msd0JBQXdCLENBQUNMLFVBQUQsQ0FBekM7O0FBRUEsTUFBSUksUUFBUSxDQUFDRSxNQUFULEtBQW9CLEVBQXhCLEVBQTRCO0FBQzFCQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxnREFBZDtBQUNBO0FBQ0Q7O0FBRUQsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLElBQUosSUFBWUEsQ0FBQyxHQUFHUixVQUFVLENBQUNLLE1BQTNDLEVBQW1ELEVBQUVHLENBQXJELEVBQXdEO0FBQ3REUixJQUFBQSxVQUFVLENBQUNRLENBQUQsQ0FBVixHQUFnQlIsVUFBVSxDQUFDUSxDQUFELENBQVYsR0FBZ0JMLFFBQVEsQ0FBQ0ssQ0FBQyxHQUFHLEVBQUwsQ0FBeEM7QUFDRDtBQUNELFNBQU9SLFVBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU0gsb0JBQVQsQ0FBOEIzQixRQUE5QixFQUF3QzZCLFVBQXhDLEVBQW9EO0FBQ3pELE1BQUlDLFVBQVUsR0FBR0MsVUFBVSxDQUFDQyxJQUFYLENBQWdCaEMsUUFBaEIsQ0FBakI7QUFDQSxRQUFNaUMsUUFBUSxHQUFHTSx5QkFBeUIsQ0FBQ1YsVUFBRCxDQUExQzs7QUFFQSxNQUFJSSxRQUFRLENBQUNFLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDekJDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLHlDQUFkO0FBQ0E7QUFDRDs7QUFFRCxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsSUFBSixJQUFZQSxDQUFDLEdBQUdSLFVBQVUsQ0FBQ0ssTUFBM0MsRUFBbUQsRUFBRUcsQ0FBckQsRUFBd0Q7QUFDdERSLElBQUFBLFVBQVUsQ0FBQ1EsQ0FBRCxDQUFWLEdBQWdCUixVQUFVLENBQUNRLENBQUQsQ0FBVixHQUFnQkwsUUFBUSxDQUFDSyxDQUFDLEdBQUdMLFFBQVEsQ0FBQ0UsTUFBZCxDQUF4QztBQUNEO0FBQ0QsU0FBT0wsVUFBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTUyx5QkFBVCxDQUFtQ3pCLEVBQW5DLEVBQXVDO0FBQzVDLFFBQU0wQixPQUFPLEdBQUcxQixFQUFFO0FBQ2YyQixFQUFBQSxPQURhLENBQ0wsV0FESyxFQUNRLEVBRFI7QUFFYkEsRUFBQUEsT0FGYSxDQUVMLElBRkssRUFFQyxFQUZEO0FBR2JBLEVBQUFBLE9BSGEsQ0FHTCxJQUhLLEVBR0MsRUFIRCxDQUFoQjs7QUFLQTtBQUNBLFNBQU9DLE1BQU0sQ0FBQ1YsSUFBUCxDQUFZUSxPQUFaLEVBQXFCLEtBQXJCLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNOLHdCQUFULENBQWtDcEIsRUFBbEMsRUFBc0M7QUFDM0MsUUFBTTBCLE9BQU8sR0FBRzFCLEVBQUUsQ0FBQzJCLE9BQUgsQ0FBVyw2QkFBWCxFQUEwQyxFQUExQyxDQUFoQjtBQUNBLFFBQU1FLE9BQU8sR0FBR0MsYUFBS0MsTUFBTCxDQUFZTCxPQUFaLENBQWhCO0FBQ0E7QUFDQSxRQUFNTSxHQUFHLEdBQUcsSUFBSUMsY0FBSixDQUFVLE9BQVYsRUFBbUIsTUFBbkIsRUFBMkIsRUFBRUMsUUFBUSxFQUFFLE1BQVosRUFBM0IsQ0FBWjtBQUNBRixFQUFBQSxHQUFHLENBQUNHLE1BQUosQ0FBV04sT0FBWDtBQUNBLFFBQU1PLE1BQU0sR0FBR0osR0FBRyxDQUFDSyxPQUFKLENBQVksWUFBWixDQUFmO0FBQ0EsU0FBT0QsTUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGpzU0hBIGZyb20gXCJqc3NoYVwiO1xuaW1wb3J0IHV0ZjggZnJvbSBcInV0ZjhcIjtcbmltcG9ydCB7IHBhcnNlWG1sIH0gZnJvbSBcIi4vdXRpbHMveG1sLmpzXCI7XG5cbi8qKlxuICogVGhlIEVwdWIgZm9udCBvYmZ1c2NhdGlvbiBzcGVjIGlzIGEgc2VsZi1pbnZlcnRpbmcgWE9SIHByb2Nlc3MuXG4gKiBUbyB1bm9iZnVzY2F0ZSBqdXN0IHJ1biB0aGUgb2JmdXNjYXRlZCBmb250IHRocm91Z2ggdGhlIG9iZnVzY2F0b3IgYWdhaW4uXG4gKiBCYXNlZCBvbiB0aGUgamF2YSBpbXBsZW1lbnRhdGlvbnMgZm91bmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kaXRhNHB1Ymxpc2hlcnMvZXB1Yi1mb250LW9iZnVzY2F0b3JcbiAqIGFuZCB0aGUgQysrIGltcGxlbWVudGF0aW9uIGF0OlxuICogaHR0cHM6Ly9naXRodWIuY29tL1NpZ2lsLUVib29rL1NpZ2lsL2Jsb2IvbWFzdGVyL3NyYy9NaXNjL0ZvbnRPYmZ1c2NhdGlvbi5jcHBcbiAqXG4gKiBUaGUgc3BlYyBpcyBmb3VuZCBhdDpcbiAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLW9jZi5odG1sI3NlYy1yZXNvdXJjZS1vYmZ1c2NhdGlvblxuICovXG5cbi8qKlxuICogVXNlcyB0aGUgZGF0YSBmcm9tIHRoZSBwYWNrYWdlIE9wZiBhbmQgZW5jcnlwdGlvbi54bWwgdG8gZmluZCBvYmZ1c2NhdGlvbiBtZXRob2QgYW5kIGtleVxuICogVE9ETzogdGhpcyBhc3N1bWVzIHRoYXQgYWxsIGZvbnRzIGFyZSBvYmZ1c2NhdGVkIHdpdGggdGhlIHNhbWUgbWV0aG9kXG4gKiBUaGUgZm9udExvY2F0aW9uIG9wdGlvbiBzaG91bGQgYmUgdXNlZCB0byBpZCB0aGUgZm9udCBvYmZ1c2NhdGlvbiBtZXRob2Qgd2l0aGluIGVuY3JweXRpb24ueG1sXG4gKiBAcGFyYW0ge0J1ZmZlciB8IFVpbnQ4QXJyYXl9IGZvbnREYXRhIC0gc291cmNlIGZvbnQgZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IG9wZlhtbCAtIHhtbCBvZiBvcGYgZmlsZVxuICogQHBhcmFtIHtzdHJpbmd9IGVuY3J5cHRpb25YbWwgLSB4bWwgb2YgZW5jcnlwdGlvbi54bWwgZmlsZVxuICogQHBhcmFtIHtzdHJpbmd9IGZvbnRMb2NhdGlvbiAtIChvcHRpb25hbCkgdGhlIGxvY2F0aW9uIG9mIHRoZSBmb250IHJlbGF0aXZlIHRvIHRoZSBlcHViIHJvb3RcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvbnRPYmZ1c2NhdGlvbihcbiAgZm9udERhdGEsXG4gIG9wZlhtbCxcbiAgZW5jcnlwdGlvblhtbCxcbiAgZm9udExvY2F0aW9uID0gdW5kZWZpbmVkXG4pIHtcbiAgY29uc3QgcGFyc2VkT3BmWG1sID0gYXdhaXQgcGFyc2VYbWwob3BmWG1sKTtcbiAgY29uc3QgcGFyc2VkRW5jcnlwdGlvblhtbCA9IGF3YWl0IHBhcnNlWG1sKGVuY3J5cHRpb25YbWwpO1xuICBjb25zdCBwYWNrYWdlVW5pcXVlSWROYW1lID0gcGFyc2VkT3BmWG1sLnBhY2thZ2UuYXR0cltcInVuaXF1ZS1pZGVudGlmaWVyXCJdO1xuICBjb25zdCB1bmlxdWVJZEVsID0gcGFyc2VkT3BmWG1sLnBhY2thZ2UubWV0YWRhdGFbMF1bXCJkYzppZGVudGlmaWVyXCJdLmZpbmQoXG4gICAgKGlkRWwpID0+IHtcbiAgICAgIHJldHVybiBpZEVsPy5hdHRyPy5pZCA9PT0gcGFja2FnZVVuaXF1ZUlkTmFtZTtcbiAgICB9XG4gICk7XG4gIGNvbnN0IHVuaXF1ZUlkID0gdW5pcXVlSWRFbC52YWw7XG5cbiAgbGV0IGZvbnRFbmNyeXB0ZWREYXRhO1xuICBpZiAoZm9udExvY2F0aW9uKSB7XG4gICAgLy8gaWYgZm9udExvY2F0aW9uIGlzIHByb3ZpZGVkLCBsb29rIGZvciBpdCBpbiB0aGUgZW5jcnlwdGlvbiByZWZlcmVuY2VzXG4gICAgZm9udEVuY3J5cHRlZERhdGEgPSBwYXJzZWRFbmNyeXB0aW9uWG1sPy5lbmNyeXB0aW9uPy5bXG4gICAgICBcImVuYzplbmNyeXB0ZWRkYXRhXCJcbiAgICBdLmZpbmQoKGVuY3J5cHRlZERhdGEpID0+IHtcbiAgICAgIGNvbnN0IGNpcGhlclJlZmVyZW5jZSA9IGVuY3J5cHRlZERhdGE/LltcImVuYzpjaXBoZXJkYXRhXCJdPy5bMF0/LltcbiAgICAgICAgXCJlbmM6Y2lwaGVycmVmZXJlbmNlXCJcbiAgICAgIF0uZmluZCgocmVmKSA9PiByZWYuYXR0ci51cmkgPT09IGZvbnRMb2NhdGlvbik7XG4gICAgICBpZiAoY2lwaGVyUmVmZXJlbmNlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIG90aGVyd2lzZSBsb29rIHRvIHNlZSBpZiBlaXRoZXIgYWRvYmUgb3IgaWRwZiBpcyBsaXN0ZWQgYXQgYWxsIGFuZCB0YWtlIHRoZSBmaXJzdCBvbmUgZm91bmRcbiAgICBmb250RW5jcnlwdGVkRGF0YSA9IHBhcnNlZEVuY3J5cHRpb25YbWwuZW5jcnlwdGlvbltcbiAgICAgIFwiZW5jOmVuY3J5cHRlZGRhdGFcIlxuICAgIF0uZmluZCgoZW5jcnlwdGVkRGF0YSkgPT4ge1xuICAgICAgY29uc3QgbWV0aG9kID1cbiAgICAgICAgZW5jcnlwdGVkRGF0YT8uW1wiZW5jOmVuY3J5cHRpb25tZXRob2RcIl0/LlswXS5hdHRyPy5hbGdvcml0aG07XG4gICAgICByZXR1cm4gKFxuICAgICAgICBtZXRob2QuaW5kZXhPZihcIm5zLmFkb2JlLmNvbS9wZGYvZW5jXCIpIHx8XG4gICAgICAgIG1ldGhvZC5pbmRleE9mKFwid3d3LmlkcGYub3JnLzIwMDgvZW1iZWRkaW5nXCIpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIGNvbnN0IG9iZk1ldGhvZCA9XG4gICAgZm9udEVuY3J5cHRlZERhdGE/LltcImVuYzplbmNyeXB0aW9ubWV0aG9kXCJdPy5bMF0uYXR0cj8uYWxnb3JpdGhtO1xuXG4gIGlmIChvYmZNZXRob2QgJiYgb2JmTWV0aG9kLmluZGV4T2YoXCJucy5hZG9iZS5jb20vcGRmL2VuY1wiKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYWRvYmVGb250T2JmdXNjYXRpb24oZm9udERhdGEsIHVuaXF1ZUlkKTtcbiAgfSBlbHNlIGlmIChcbiAgICBvYmZNZXRob2QgJiZcbiAgICBvYmZNZXRob2QuaW5kZXhPZihcInd3dy5pZHBmLm9yZy8yMDA4L2VtYmVkZGluZ1wiKSAhPT0gLTFcbiAgKSB7XG4gICAgcmV0dXJuIGlkcGZGb250T2JmdXNjYXRpb24oZm9udERhdGEsIHVuaXF1ZUlkKTtcbiAgfVxufVxuXG4vKipcbiAqIE9iZnVzY2F0ZXMvVW5vYmZ1c2NhdGVzIHRoZSBwcm92aWRlZCBmb250IGRhdGEgdXNpbmcgdGhlIElEUEYgbWV0aG9kLlxuICogVGhlIE9iZnVzY2F0aW9uIHByb2Nlc3MgaXMgYSBzZWxmLWludmVydGluZyBYT1IgcHJvY2Vzcy4gUnVubmluZyB0aGlzXG4gKiBtZXRob2Qgb24gYW4gb25mdXNjYXRlZCBmb250IHdpbGwgdW5vYmZ1c2NhdGUgaXQgYW5kIHZpY2UtdmVyc2FcbiAqIEBwYXJhbSB7QnVmZmVyIHwgVWludDhBcnJheX0gZm9udERhdGEgLSBzb3VyY2UgZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IGlkZW50aWZpZXIgLSB0aGUgb3BmIGlkIHVzZWQgdG8gcHJvZHVjZSB0aGUgc2hhLTEga2V5XG4gKiBAcmV0dXJucyB7VWludDhhcnJheX0gLSB0aGUgb3V0cHV0IGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlkcGZGb250T2JmdXNjYXRpb24oZm9udERhdGEsIGlkZW50aWZpZXIpIHtcbiAgbGV0IG91dHB1dERhdGEgPSBVaW50OEFycmF5LmZyb20oZm9udERhdGEpO1xuICBjb25zdCBieXRlTWFzayA9IGdldElkcGZLZXlGcm9tSWRlbnRpZmllcihpZGVudGlmaWVyKTtcblxuICBpZiAoYnl0ZU1hc2subGVuZ3RoICE9PSAyMCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJpZHBmRm9udE9iZnVzY2F0aW9uIEVycm9yOiBrZXkgaXMgbm90IDIwIGJ5dGVzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA0MCAmJiBpIDwgb3V0cHV0RGF0YS5sZW5ndGg7ICsraSkge1xuICAgIG91dHB1dERhdGFbaV0gPSBvdXRwdXREYXRhW2ldIF4gYnl0ZU1hc2tbaSAlIDIwXTtcbiAgfVxuICByZXR1cm4gb3V0cHV0RGF0YTtcbn1cblxuLyoqXG4gKiBPYmZ1c2NhdGVzIHRoZSBwcm92aWRlZCBmb250IGRhdGEgdXNpbmcgdGhlIEFkb2JlIG1ldGhvZC5cbiAqIFRoZSBPYmZ1c2NhdGlvbiBwcm9jZXNzIGlzIGEgc2VsZi1pbnZlcnRpbmcgWE9SIHByb2Nlc3MuIFJ1bm5pbmcgdGhpc1xuICogbWV0aG9kIG9uIGFuIG9uZnVzY2F0ZWQgZm9udCB3aWxsIHVub2JmdXNjYXRlIGl0IGFuZCB2aWNlLXZlcnNhXG4gKiBAcGFyYW0ge0J1ZmZlciB8IFVpbnQ4QXJyYXl9IGZvbnREYXRhIC0gc291cmNlIGRhdGFcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZGVudGlmaWVyIC0gdGhlIG9wZiBpZCB1c2VkIHRvIHByb2R1Y2UgdGhlIHNoYS0xIGtleVxuICogQHJldHVybnMge1VpbnQ4YXJyYXl9IC0gdGhlIG91dHB1dCBkYXRhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZG9iZUZvbnRPYmZ1c2NhdGlvbihmb250RGF0YSwgaWRlbnRpZmllcikge1xuICBsZXQgb3V0cHV0RGF0YSA9IFVpbnQ4QXJyYXkuZnJvbShmb250RGF0YSk7XG4gIGNvbnN0IGJ5dGVNYXNrID0gZ2V0QWRvYmVLZXlGcm9tSWRlbnRpZmllcihpZGVudGlmaWVyKTtcblxuICBpZiAoYnl0ZU1hc2subGVuZ3RoID09PSAwKSB7XG4gICAgY29uc29sZS5lcnJvcihcImlkcGZGb250T2JmdXNjYXRpb24gRXJyb3I6IGtleSBpcyBlbXB0eVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMjQgJiYgaSA8IG91dHB1dERhdGEubGVuZ3RoOyArK2kpIHtcbiAgICBvdXRwdXREYXRhW2ldID0gb3V0cHV0RGF0YVtpXSBeIGJ5dGVNYXNrW2kgJSBieXRlTWFzay5sZW5ndGhdO1xuICB9XG4gIHJldHVybiBvdXRwdXREYXRhO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBPUEYgVUlEIGludG8gYmluYXJ5IGJ1ZmZlciBhcnJheSB1c2VkIGJ5IHRoZSBhZG9iZSBmb250IG9iZnVzY2F0aW9uIHNwZWMuXG4gKiBVbmZvcnR1bmV0bHkgdGhpcyByZXF1aXJlcyB0aGUgbm9kZSBCdWZmZXIgbW9kdWxlLiBGb3IgYnJvd3NlciBzdXBwb3J0IGVwdWJraXQgcmVsaWVzXG4gKiBvbiB0aGUgQnVmZmVyIHBvbHlmaWxsIHByb2lkZWQgYnkgQnJvd3NlckZTIChzZWUgdGhlIHdlYnBhY2sgY29uZmlnKS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgVVVJRCBpZGVudGlmaWVkIGluIHRoZSBlcHViJ3Mgb3BmXG4gKiBAcmV0dXJucyB7QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRvYmVLZXlGcm9tSWRlbnRpZmllcihpZCkge1xuICBjb25zdCBjbGVhbklkID0gaWRcbiAgICAucmVwbGFjZShcInVybjp1dWlkOlwiLCBcIlwiKVxuICAgIC5yZXBsYWNlKC8tL2csIFwiXCIpXG4gICAgLnJlcGxhY2UoLzovZywgXCJcIik7XG5cbiAgLy8gdGhlIGtleSBpcyB0cmVhdGVkIGFzIHJhdyBoZXggZGF0YS5cbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKGNsZWFuSWQsIFwiaGV4XCIpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBPUEYgVUlEIGludG8gYSBrZXkgdXNlZCBieSB0aGUgSURQRiBmb250IG9iZnVzY2F0aW9uIHNwZWMuXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgVVVJRCBpZGVudGlmaWVkIGluIHRoZSBlcHViJ3Mgb3BmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJZHBmS2V5RnJvbUlkZW50aWZpZXIoaWQpIHtcbiAgY29uc3QgY2xlYW5JZCA9IGlkLnJlcGxhY2UoL1tcXHUwMDIwXFx1MDAwOVxcdTAwMERcXHUwMDBBXS9nLCBcIlwiKTtcbiAgY29uc3QgdXRmOEtleSA9IHV0ZjguZW5jb2RlKGNsZWFuSWQpO1xuICAvLyBcIkEgU0hBLTEgZGlnZXN0IG9mIHRoZSBVVEYtOCByZXByZXNlbnRhdGlvbiBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZ1wiXG4gIGNvbnN0IHNoYSA9IG5ldyBqc1NIQShcIlNIQS0xXCIsIFwiVEVYVFwiLCB7IGVuY29kaW5nOiBcIlVURjhcIiB9KTtcbiAgc2hhLnVwZGF0ZSh1dGY4S2V5KTtcbiAgY29uc3Qgc2hhS2V5ID0gc2hhLmdldEhhc2goXCJVSU5UOEFSUkFZXCIpO1xuICByZXR1cm4gc2hhS2V5O1xufVxuIl19
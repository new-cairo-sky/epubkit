import jsSHA from "jssha";
import utf8 from "utf8";
import { parseXml } from "./utils/xml";

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
 * @param {Buffer | Uint8Array} fontData - source font data
 * @param {string} opfXml - xml of opf file
 * @param {string} encryptionXml - xml of encryption.xml file
 */
export async function fontObfuscation(fontData, opfXml, encryptionXml) {
  const parsedOpfXml = await parseXml(opfXml);
  const parsedEncryptionXml = await parseXml(encryptionXml);
  const packageUniqueIdName = parsedOpfXml.package.attr["unique-identifier"];
  const uniqueIdEl = parsedOpfXml.package.metadata[0]["dc:identifier"].find(
    (idEl) => {
      return idEl.attr.id === packageUniqueIdName;
    }
  );
  const uniqueId = uniqueIdEl.val;
  const obfMethod =
    parsedEncryptionXml.encryption["enc:encrypteddata"][0][
      "enc:encryptionmethod"
    ][0].attr.algorithm;
  if (obfMethod.indexOf("adobe")) {
    return adobeFontObfuscation(fontData, uniqueId);
  } else if (obfMethod.indexOf("idpf")) {
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
export function idpfFontObfuscation(fontData, identifier) {
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
export function adobeFontObfuscation(fontData, identifier) {
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
export function getAdobeKeyFromIdentifier(id) {
  const cleanId = id
    .replace("urn:uuid:", "")
    .replace(/-/g, "")
    .replace(/:/g, "");

  // the key is treated as raw hex data.
  return Buffer.from(cleanId, "hex");
}

/**
 * Converts the OPF UID into a key used by the IDPF font obfuscation spec.
 * @param {string} id - the UUID identified in the epub's opf
 */
export function getIdpfKeyFromIdentifier(id) {
  const cleanId = id.replace(/[\u0020\u0009\u000D\u000A]/g, "");
  const utf8Key = utf8.encode(cleanId);
  // "A SHA-1 digest of the UTF-8 representation of the resulting string"
  const sha = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
  sha.update(utf8Key);
  const shaKey = sha.getHash("UINT8ARRAY");
  return shaKey;
}

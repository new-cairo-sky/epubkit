import jsSHA from "jssha";
import utf8 from "utf8";

// https://www.w3.org/publishing/epub32/epub-ocf.html#sec-resource-obfuscation
// https://github.com/dita4publishers/epub-font-obfuscator
// http://www.openebook.org/doc_library/informationaldocs/FontManglingSpec.html

// https://kevin.burke.dev/kevin/node-js-string-encoding/

function epubFontObfuscator(fontData, opfId) {
  let outputData = Uint8Array.from(fontData);
  const byteMask = makeXORMask(opfId);

  let fontByteIndex = 0;
  while (fontByteIndex < 1040) {
    let maskByteIndex = 0;
    while (maskByteIndex < 20 && fontByteIndex < fontData.length) {
      const maskByte = byteMask[maskByteIndex];
      const XORByte = fontData[fontByteIndex] ^ maskByte;
      outputData[fontByteIndex] = XORByte;
      maskByteIndex++;
      fontByteIndex++;
    }
  }

  return outputData;
}

function makeXORMask(opfId) {
  const key = opfId.replace(/\s/g, "");
  const utf8Key = utf8.encode(key);

  // "A SHA-1 digest of the UTF-8 representation of the resulting string"
  const sha = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });

  sha.update(utf8Key);

  // todo: need to spec encoding?
  const mask = sha.getHash("UINT8ARRAY");

  console.log("mask length should be 20 bytes", mask, mask.length);

  return mask;
}

export default epubFontObfuscator;

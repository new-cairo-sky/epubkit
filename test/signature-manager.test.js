/**
 * @jest-environment node
 */
/* ^^^^^^^^^
 * XmlDSigJs checks the environment with
 * typeof self === "undefined" && typeof window === "undefined")
 * This results in an error with webcrypto which is not supported by JSDOM
 * We must force Node environment so that self and window are both undefined
 */
import path from "path";
import FileManager from "../src/file-manager";

import SignaturesManager from "../src/signatures-manager";
import Signature from "../src/signature";

const signaturesEpubFixture = path.resolve("./test/fixtures/signatures-test");
const signaturesFilePath = path.resolve(
  "./test/fixtures/signatures-test/META-INF/signatures.xml"
);

// test("can parse a signature.xml file", async () => {
//   const signatureManager = new SignaturesManager(signaturesEpubFixture);
//   await signatureManager.initCrypto();

//   const xmlData = await FileManager.readFile(signaturesFilePath);
//   const result = await signatureManager.loadXml(xmlData);
//   console.log("xml2js signatures", signatureManager.signatures);
// });

test("can generate properly formed xml", async () => {
  const signatureManager = new SignaturesManager(signaturesEpubFixture);
  await signatureManager.initCrypto();
  signatureManager.addSignature("newsig");
  const xml = await signatureManager.getXml();
  console.log("xml", xml);
});

test("can get enveloped transform xml of signatures", async () => {
  const signatureManager = new SignaturesManager(signaturesEpubFixture);
  await signatureManager.initCrypto();

  // const xmlData = await FileManager.readFile(signaturesFilePath);
  // const result = await signatureManager.loadXml(xmlData);

  signatureManager.addSignature("prevsig");
  signatureManager.addSignature("newsig");
  const newsig = signatureManager.getSignature("newsig");
  const envelopedXml = await signatureManager.getEnvelopedSignatureTransformedXml(
    newsig
  );
  console.log("evelopedXml", envelopedXml);
});

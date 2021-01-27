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
import "./expect/toBeEqualXml";
import SignaturesManager from "../src/signatures-manager";
import Signature from "../src/signature";

const signaturesEpubFixture = path.resolve("./test/fixtures/signatures-test");
const signaturesFilePath = path.resolve(
  "./test/fixtures/signatures-test/META-INF/signatures.xml"
);

test("can parse a signature.xml file", async () => {
  const signatureManager = new SignaturesManager(signaturesEpubFixture);
  await signatureManager.initCrypto();

  const xmlData = await FileManager.readFile(signaturesFilePath, "utf8");

  const result = await signatureManager.loadXml(xmlData);
  console.log("xml2js signatures", signatureManager.signatures);
  const signatureManagerXml = await signatureManager.getXml();
  console.log("signatureManagerXmls", signatureManagerXml);
  await expect(signatureManagerXml).toBeEqualXml(xmlData);
});

test("can generate properly formed xml", async () => {
  const signatureManager = new SignaturesManager(signaturesEpubFixture);
  await signatureManager.initCrypto();
  signatureManager.addSignature("newsig");
  const xml = await signatureManager.getXml();

  const expectedXml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <signatures xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <Signature id="newsig" xmlns="http://www.w3.org/2000/09/xmldsig#">
      <SignedInfo>
        <CanonicalizationMethod algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
        <SignatureMethod algorithm="http://www.w3.org/2000/09/xmldsig#dsa-sha1"/>
      </SignedInfo>
      <SignatureValue/>
      <KeyInfo/>
      <Object>
        <Manifest id="manifest"/>
      </Object>
    </Signature>
  </signatures>
  `;
  await expect(expectedXml).toBeEqualXml(xml);
});

test("can get enveloped transform xml of signatures", async () => {
  const signatureManager = new SignaturesManager(signaturesEpubFixture);
  await signatureManager.initCrypto();

  signatureManager.addSignature("prevsig");
  const expectedXml = await signatureManager.getXml();
  signatureManager.addSignature("newsig");
  const newsig = signatureManager.getSignature("newsig");
  const envelopedXml = await signatureManager.getEnvelopedSignatureTransformedXml(
    newsig
  );

  console.log("envelopedXml", envelopedXml);
  await expect(expectedXml).toBeEqualXml(envelopedXml);
});

test("can add self to signature manifest", async () => {
  const signatureManager = new SignaturesManager(signaturesEpubFixture);
  signatureManager.initCrypto();
  const data = await FileManager.readFile(signaturesFilePath);
  await signatureManager.loadXml(data);
  signatureManager.addSignature("newsig");
  const newsig = signatureManager.getSignature("newsig");
  
  await signatureManager.addSelfToSignatureManifest(newsig);
  const xml = await signatureManager.getXml();
  console.log("xml", xml);
  console.log("signedEnvelopedXml", xml);
});

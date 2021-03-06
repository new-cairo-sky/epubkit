/**
 * @jest-environment node
 */
/* ^^^^^^^^^
 * XmlDSigJs checks the environment with
 * typeof self === "undefined" && typeof window === "undefined")
 * This results in an error with webcrypto which is not supported by JSDOM
 * We must force Node environment so that self and window are both undefined
 */
import SignaturesManager from "../src/signatures-manager";
import Signature from "../src/signature";
import * as xmldsigjs from "xmldsigjs";

test("can hash an xml file using xmldsig.js", async () => {
  const signatureManager = new SignaturesManager();
  await signatureManager.initCrypto();

  const signaturesSignature = new Signature();
  await signaturesSignature.addManifestReference(
    "./test/fixtures/alice/OPS/package.opf"
  );

  const digestValue =
    signaturesSignature.object.manifest.references[0].digestValue.value;

  expect(digestValue).toBe("v+utESdJOT3cKjJd7rgE4Iw8GTwjdb3zRf37BllF2Mk=");
});

test("can hash a binary file using xmldsig.js", async () => {
  const signatureManager = new SignaturesManager();
  await signatureManager.initCrypto();

  const signaturesSignature = new Signature();
  await signaturesSignature.addManifestReference(
    "./test/fixtures/alice/OPS/css/stylesheet.css"
  );

  const digestValue =
    signaturesSignature.object.manifest.references[0].digestValue.value;

  // verified using https://emn178.github.io/online-tools/sha256_checksum.html
  expect(digestValue).toBe("jsl7lao3CReMRW2eUocxMQans6bucWlexHNl1V+g008=");
});


test("can generate a signature", async () => {
  const signatureManager = new SignaturesManager();
  signatureManager.initCrypto();

  // generate keys
  const Crypto = xmldsigjs.Application.crypto; // get's the web-crypto instance
  const alg = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256",
    modulusLength: 1024,
    publicExponent: new Uint8Array([1, 0, 1]),
  };
  const keys = await Crypto.subtle.generateKey(alg, false, ["sign", "verify"]);

  const signaturesSignature = new Signature();
  await signaturesSignature.addManifestReference(
    "./test/fixtures/alice/OPS/css/stylesheet.css"
  );
  console.log("before signed", await signaturesSignature.getXml());
  try {
    await signaturesSignature.sign(keys.privateKey, keys.publicKey);
    console.log("signed?", await signaturesSignature.getXml());
  } catch (e) {
    console.log("error", e);
  }
});

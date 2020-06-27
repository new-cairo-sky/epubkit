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
import SignaturesSignature from "../src/signatures-signature";

test("can hash an xml file using xmldsig.js", async () => {
  const signatureManager = new SignaturesManager();
  await signatureManager.initCrypto();

  const signaturesSignature = new SignaturesSignature();
  await signaturesSignature.addManifestReference(
    "./test/fixtures/alice/OPS/package.opf"
  );

  const digestValue =
    signaturesSignature.manifest.references[0].digestValue.value;

  expect(digestValue).toBe("v+utESdJOT3cKjJd7rgE4Iw8GTwjdb3zRf37BllF2Mk=");
});

test("can hash a binary file using xmldsig.js", async () => {
  const signatureManager = new SignaturesManager();
  await signatureManager.initCrypto();

  const signaturesSignature = new SignaturesSignature();
  await signaturesSignature.addManifestReference(
    "./test/fixtures/alice/OPS/css/stylesheet.css"
  );

  const digestValue =
    signaturesSignature.manifest.references[0].digestValue.value;

  // verified using https://emn178.github.io/online-tools/sha256_checksum.html
  expect(digestValue).toBe("jsl7lao3CReMRW2eUocxMQans6bucWlexHNl1V+g008=");
});

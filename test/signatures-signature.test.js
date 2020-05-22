/**
 * @jest-environment node
 */
/* ^^^^^^^^^
 * XmlDSigJs checks the environment with
 * typeof self === "undefined" && typeof window === "undefined")
 * this results an error with webcrypto which is not supported by JSDOM
 * We must force Node environment so that self and window are both undefined
 */
import SignaturesManager from "../src/signatures-manager";
import SignaturesSignature from "../src/signatures-signature";

test("can hash a file using xmldsig.js", async () => {
  const signatureManager = new SignaturesManager();
  await signatureManager.initCrypto();

  const signaturesSignature = new SignaturesSignature();
  await signaturesSignature.addManifestReference(
    "./test/fixtures/alice/OPS/package.opf"
  );
});

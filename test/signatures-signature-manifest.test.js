/**
 * @jest-environment node
 */
/* ^^^^^^^^^
 * XmlDSigJs checks the environment with
 * typeof self === "undefined" && typeof window === "undefined")
 * This results in an error with webcrypto which is not supported by JSDOM
 * We must force Node environment so that self and window are both undefined
 */

import { parseXml, generateXml } from "../src/utils/xml";

import normalizeXml from "./utils/normalize-xml";

import SignatureManifest from "../src/signature-manifest.js";

const manifestXml = `
<?xml version="1.0" encoding="UTF-8"?>
<manifest id="manifest">
  <reference uri="META-INF/container.xml">
    <transforms>
      <transform algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
    </transforms>
    <digestMethod algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
    <digestValue>digestValue</digestValue>
  </reference>
</manifest>
`;

test("can get valid xmlJsObj from manifest", async () => {
  const manifest = new SignatureManifest();
  manifest.addReference(
    "META-INF/container.xml",
    ["http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
    "http://www.w3.org/2001/04/xmlenc#sha256",
    "digestValue"
  );

  const expected = await parseXml(manifestXml);

  const xml2JsObj = manifest.prepareForXml();

  const expectedXml = normalizeXml(manifestXml);

  const resultXml = await manifest.getXml(xml2JsObj, true);
  const normalizedResultXml = normalizeXml(resultXml);

  console.log(expectedXml);
  console.log(normalizedResultXml);
  expect(normalizedResultXml).toStrictEqual(expectedXml);
});

test("can generate valid xml", async () => {
  const manifest = new SignatureManifest();
  manifest.addReference(
    "META-INF/container.xml",
    ["http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
    "http://www.w3.org/2001/04/xmlenc#sha256",
    "digestValue"
  );

  const xml = await manifest.getXml();

  console.log("xml", xml);
});

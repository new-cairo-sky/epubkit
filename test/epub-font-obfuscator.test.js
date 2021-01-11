import { promises as fs } from "fs";
import path from "path";
import epubFontObfuscator, {
  fontObfuscation,
  idpfFontObfuscation,
  adobeFontObfuscation,
} from "../src/index.js";

const referenceFontPath = path.resolve("./test/fixtures/Roboto-Regular.ttf");

const adobeObfFontId = "urn:uuid:1b629981-2821-4db3-8634-9574a9bf8296";
const adobeObfFontPath = path.resolve(
  "./test/fixtures/Roboto-Regular--adobe-obf.ttf"
);
const idpfObfFontId = "urn:uuid:9a3f56cd-bf94-4baa-bf82-e9cd1fe4d30a";
const idpfObfFontPath = path.resolve(
  "./test/fixtures/Roboto-Regular--idpf-obf.ttf"
);

const adobeObfOpfXmlPath = path.resolve(
  "./test/fixtures/adobe-font-obf-test/OEBPS/content.opf"
);
const adobeObEncryptionXmlPath = path.resolve(
  "./test/fixtures/adobe-font-obf-test/META-INF/encryption.xml"
);

test("can find obfuscation method and id from xml", async () => {
  let expectedFontData, sourceFontData;
  let adobeObfOpfXml, adobeObfEncryptionXml;
  try {
    adobeObfOpfXml = await fs.readFile(adobeObfOpfXmlPath);
    adobeObfEncryptionXml = await fs.readFile(adobeObEncryptionXmlPath);
    expectedFontData = await fs.readFile(adobeObfFontPath);
    sourceFontData = await fs.readFile(referenceFontPath);
  } catch (err) {
    console.error(err);
    return;
  }

  const unobfuscatedFontData = await fontObfuscation(
    sourceFontData,
    adobeObfOpfXml,
    adobeObfEncryptionXml,
    "OEBPS/Fonts/Roboto-Regular.ttf"
  );
  expect(Buffer.compare(expectedFontData, unobfuscatedFontData)).toBe(0);
});

test("can idpf obfuscate font", async () => {
  let expectedFontData, sourceFontData;
  try {
    expectedFontData = await fs.readFile(idpfObfFontPath);
    sourceFontData = await fs.readFile(referenceFontPath);
  } catch (err) {
    console.error(err);
    return;
  }
  //const unobfuscatedFontData = epubFontObfuscator(sourceFontData, key);
  const obfuscatedFontData = idpfFontObfuscation(sourceFontData, idpfObfFontId);

  try {
    await fs.writeFile(
      path.resolve("./test/output/roboto-idpf-obfuscation-test.ttf"),
      obfuscatedFontData
    );
  } catch (err) {
    console.error(err);
  }

  // uncomment for manual debugging:
  //   console.log("src: ", sourceFontData.slice(0, 40));
  //   console.log("sig: ", expectedFontData.slice(0, 40));
  //   console.log("kit: ", Buffer.from(obfuscatedFontData).slice(0, 40));

  expect(Buffer.compare(expectedFontData, obfuscatedFontData)).toBe(0);
});

test("can idpf unobfuscate font", async () => {
  let expectedFontData, sourceFontData;
  try {
    expectedFontData = await fs.readFile(referenceFontPath);
    sourceFontData = await fs.readFile(idpfObfFontPath);
  } catch (err) {
    console.error(err);
    return;
  }

  const unobfuscatedFontData = idpfFontObfuscation(
    sourceFontData,
    idpfObfFontId
  );

  try {
    await fs.writeFile(
      path.resolve("./test/output/roboto-idpf-unobfuscation-test.ttf"),
      unobfuscatedFontData
    );
  } catch (err) {
    console.error(err);
  }

  // uncomment for manual debugging:
  //   console.log("src: ", sourceFontData.slice(0, 40));
  //   console.log("sig: ", expectedFontData.slice(0, 40));
  //   console.log("kit: ", Buffer.from(obfuscatedFontData).slice(0, 40));

  expect(Buffer.compare(expectedFontData, unobfuscatedFontData)).toBe(0);
});

test("can adobe obfuscate font", async () => {
  let expectedFontData, sourceFontData;
  try {
    expectedFontData = await fs.readFile(adobeObfFontPath);
    sourceFontData = await fs.readFile(referenceFontPath);
  } catch (err) {
    console.error(err);
    return;
  }
  //const unobfuscatedFontData = epubFontObfuscator(sourceFontData, key);
  const obfuscatedFontData = adobeFontObfuscation(
    sourceFontData,
    adobeObfFontId
  );

  try {
    await fs.writeFile(
      path.resolve("./test/output/roboto-adobe-obfuscation-test.ttf"),
      obfuscatedFontData
    );
  } catch (err) {
    console.error(err);
  }

  // uncomment for manual debugging:
  //   console.log("src: ", sourceFontData.slice(0, 40));
  //   console.log("sig: ", expectedFontData.slice(0, 40));
  //   console.log("kit: ", Buffer.from(obfuscatedFontData).slice(0, 40));

  expect(Buffer.compare(expectedFontData, obfuscatedFontData)).toBe(0);
});

test("can adobe unobfuscate font", async () => {
  let expectedFontData, sourceFontData;
  try {
    expectedFontData = await fs.readFile(referenceFontPath);
    sourceFontData = await fs.readFile(adobeObfFontPath);
  } catch (err) {
    console.error(err);
    return;
  }
  //const unobfuscatedFontData = epubFontObfuscator(sourceFontData, key);
  const unobfuscatedFontData = adobeFontObfuscation(
    sourceFontData,
    adobeObfFontId
  );

  try {
    await fs.writeFile(
      path.resolve("./test/output/roboto-adobe-obfuscation-test.ttf"),
      unobfuscatedFontData
    );
  } catch (err) {
    console.error(err);
  }

  // uncomment for manual debugging:
  //   console.log("src: ", sourceFontData.slice(0, 40));
  //   console.log("sig: ", expectedFontData.slice(0, 40));
  //   console.log("kit: ", Buffer.from(obfuscatedFontData).slice(0, 40));

  expect(Buffer.compare(expectedFontData, unobfuscatedFontData)).toBe(0);
});

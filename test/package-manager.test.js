import path from "path";
import xml2js from "xml2js";
const { JSDOM } = require("jsdom");
import { parseXml } from "../src/utils/xml";
import PackageManager from "../src/package-manager";
import PackageManifest from "../src/package-manifest";
import PackageMetadata from "../src/package-metadata";
import PackageSpine from "../src/package-spine";
import { promisify } from "es6-promisify";
import FileManager from "../src/file-manager";

const epub2OpfEpubLocation = "3174/content.opf";
const epub2OpfPath = path.resolve(
  "./test/fixtures/a_dogs_tale/3174/content.opf"
);
const epub3OpfEpubLocation = "OPS/package.opf";
const epub3OpfPath = path.resolve("./test/fixtures/alice/OPS/package.opf");

test("can set file location in epub", () => {
  const packageManager = new PackageManager();
  packageManager.create();
  packageManager.location = "ops/package.opf";
  expect(packageManager.location).toBe("ops/package.opf");
  expect(packageManager.manifest.location).toBe("ops/package.opf");
});

test("can parse package.opf xml", async () => {
  const packageManager = new PackageManager(epub3OpfEpubLocation);
  const data = await FileManager.readFile(epub3OpfPath);
  await packageManager.loadXml(data);

  expect(packageManager.metadata).toBeInstanceOf(PackageMetadata);
  expect(packageManager.manifest).toBeInstanceOf(PackageManifest);
  expect(packageManager.spine).toBeInstanceOf(PackageSpine);
});

test("can get xml2js object", async () => {
  const packageHandler = new PackageManager(epub3OpfEpubLocation);
  const data = await FileManager.readFile(epub3OpfPath);

  await packageHandler.loadXml(data);

  const testXml = packageHandler.getXml2JsObject();

  const referenceXml = await parseXml(data);

  expect(testXml).toEqual(referenceXml);
});

test("can generate valid xml ", async () => {
  const packageHandler = new PackageManager(epub3OpfEpubLocation);
  const data = await FileManager.readFile(epub3OpfPath, "utf8");

  const referenceXmlJs = await promisify(xml2js.parseString)(data);
  const builder = new xml2js.Builder({
    xmldec: { version: "1.0", encoding: "UTF-8" },
  });
  const referenceXml = builder.buildObject(referenceXmlJs);

  await packageHandler.loadXml(data);
  const testXml = await packageHandler.getXml();

  const referenceJsdom = JSDOM.fragment(referenceXml);
  const testJsdom = JSDOM.fragment(testXml);

  expect(testJsdom.isEqualNode(referenceJsdom)).toBe(true);
});

test("can find Unique Identifier", async () => {
  const packageHandler = new PackageManager(epub3OpfEpubLocation);
  const data = await FileManager.readFile(epub3OpfPath);

  await packageHandler.loadXml(data);

  expect(packageHandler.findUniqueIdentifier()).toBe(
    "edu.nyu.itp.future-of-publishing.alice-in-wonderland"
  );
});

test("can find ncx file path", async () => {
  const packageHandler = new PackageManager(epub2OpfEpubLocation);

  const data = await FileManager.readFile(epub2OpfPath);

  await packageHandler.loadXml(data);

  expect(packageHandler.findNcxFilePath()).toBe("3174/toc.ncx");
});

test("can find navigation file path", async () => {
  const packageHandler = new PackageManager(epub3OpfEpubLocation);

  const data = await FileManager.readFile(epub3OpfPath);

  await packageHandler.loadXml(data);

  expect(packageHandler.findNavigationFilePath()).toBe("OPS/toc.xhtml");
});

test("can generate valid xml without source xml file", async () => {
  const uid = "test-uid";
  const expectedXml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:title>Untitled</dc:title>
      <dc:language>en-US</dc:language>
      <dc:identifier id="pub-id">${uid}</dc:identifier>
    </metadata>
    <manifest/>
    <spine/>
  </package>
  `.replace(/\s/g, "");
  const packageManager = new PackageManager();
  packageManager.create();
  packageManager.setUniqueIdentifier(uid);
  const emptyXml = await packageManager.getXml();
  expect(emptyXml.replace(/\s/g, "")).toBe(expectedXml);
});

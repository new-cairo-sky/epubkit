import path from "path";
const { JSDOM } = require("jsdom");
import { parseXml } from "../src/utils/xml";
import FileManager from "../src/file-manager";
import ContainerManager from "../src/container-manager";
import ContainerRootfiles from "../src/container-rootfiles";
import ContainerRootfilesRootfile from "../src/container-rootfiles-rootfile";

const epub3ContainerPath = path.resolve(
  "./test/fixtures/alice/META-INF/container.xml"
);

test("can parse container.xml", async () => {
  const containerManager = new ContainerManager();
  const data = await FileManager.readFile(epub3ContainerPath);
  await containerManager.loadXml(data);

  expect(containerManager.rootfiles).toBeInstanceOf(ContainerRootfiles);
  expect(containerManager.rootfiles.items[0]).toBeInstanceOf(
    ContainerRootfilesRootfile
  );
});

test("can get default root file path", async () => {
  const containerManager = new ContainerManager();
  const data = await FileManager.readFile(epub3ContainerPath);
  await containerManager.loadXml(data);

  expect(containerManager.rootFilePath).toBe("OPS/package.opf");
});

test("can generate valid xml2js object", async () => {
  const containerManager = new ContainerManager();
  const data = await FileManager.readFile(epub3ContainerPath);

  await containerManager.loadXml(data);

  const testXml = containerManager.getXml2JsObject();

  const referenceXml = await parseXml(data);

  expect(testXml).toEqual(referenceXml);
});

test("can generate valid xml", async () => {
  const containerManager = new ContainerManager();
  const referenceXml = await FileManager.readFile(epub3ContainerPath, "utf8");

  const cleanReferenceXml = referenceXml.replace(/[\r\n]| {2,}/gm, "");
  await containerManager.loadXml(referenceXml);

  const testXml = await containerManager.getXml();
  const clearnTestXml = testXml.replace(/[\r\n]| {2,}/gm, "");
  const referenceJsdom = JSDOM.fragment(cleanReferenceXml);
  const testJsdom = JSDOM.fragment(clearnTestXml);

  expect(testJsdom.isEqualNode(referenceJsdom)).toBe(true);
});

test("can create valid xml without source file", async () => {
  const expectedXml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <container>
        <rootfiles>
            <rootfile full-path="package.opf" media-type="application/oebps-package+xml"/>
        </rootfiles>
    </container>
    `.replace(/\s/g, "");
  const containerManager = new ContainerManager();
  containerManager.create();
  const emptyXml = await containerManager.getXml();
  expect(emptyXml.replace(/\s/g, "")).toBe(expectedXml);
});

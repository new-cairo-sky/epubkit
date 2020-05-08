import path from "path";
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
  const containerManager = new ContainerManager(epub3ContainerPath);
  const data = await FileManager.readFile(epub3ContainerPath);

  await containerManager.loadXml(data);

  const testXml = containerManager.getXml2JsObject();

  const referenceXml = await parseXml(data);

  expect(testXml).toEqual(referenceXml);
});

test("can generate valid xml", async () => {
  const containerManager = new ContainerManager(epub3ContainerPath);
  const referenceXml = await FileManager.readFile(epub3ContainerPath, "utf8");

  await containerManager.loadXml(referenceXml);

  const testXml = await containerManager.getXml();

  expect(testXml).toEqual(referenceXml);
});

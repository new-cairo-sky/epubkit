import path from "path";
import { parseXml } from "../src/utils/xml";
import PackageManager from "../src/package-manager";
import PackageManifest from "../src/package-manifest";
import PackageMetadata from "../src/package-metadata";
import PackageSpine from "../src/package-spine";

import FileManager from "../src/file-manager";

const epub2OpfPath = path.resolve(
  "./test/fixtures/a_dogs_tale/3174/content.opf"
);
const epub3OpfPath = path.resolve("./test/fixtures/alice/OPS/package.opf");

test("can parse package.opf xml", async () => {
  const packageManager = new PackageManager();
  const fileManager = new FileManager();
  const data = await fileManager.readFile(epub3OpfPath);
  await packageManager.loadXml(data);

  expect(packageManager.metadata).toBeInstanceOf(PackageMetadata);
  expect(packageManager.manifest).toBeInstanceOf(PackageManifest);
  expect(packageManager.spine).toBeInstanceOf(PackageSpine);
});

test("can prepare package xml", async () => {
  const packageHandler = new PackageManager();
  const fileManager = new FileManager();
  const data = await fileManager.readFile(epub3OpfPath);

  await packageHandler.loadXml(data);

  const testXml = packageHandler.xml;

  const referenceXml = await parseXml(data);

  expect(testXml.package).toEqual(referenceXml.package);
});

test("can find Unique Identifier", async () => {
  const packageHandler = new PackageManager();
  const fileManager = new FileManager();
  const data = await fileManager.readFile(epub3OpfPath);

  await packageHandler.loadXml(data);

  expect(packageHandler.findUniqueIdentifier()).toBe(
    "edu.nyu.itp.future-of-publishing.alice-in-wonderland"
  );
});

test("can find ncx file path", async () => {
  const packageHandler = new PackageManager();
  const fileManager = new FileManager();
  const data = await fileManager.readFile(epub2OpfPath);

  await packageHandler.loadXml(data);

  expect(packageHandler.findNcxFilePath()).toBe("toc.ncx");
});

test("can find navigation file path", async () => {
  const packageHandler = new PackageManager();
  const fileManager = new FileManager();
  const data = await fileManager.readFile(epub3OpfPath);

  await packageHandler.loadXml(data);

  expect(packageHandler.findNavigationFilePath()).toBe("toc.xhtml");
});

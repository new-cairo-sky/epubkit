import path from "path";
import { parseXml } from "../src/utils/xml";
import PackageManager from "../src/package-manager";
import PackageManifest from "../src/package-manifest";
import PackageMetadata from "../src/package-metadata";
import PackageSpine from "../src/package-spine";

import FileManager from "../src/file-manager";

const epub2OpfPath = path.resolve(
  "./test/fixtures/a_dogs_tail/3174/OPS/content.opf"
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

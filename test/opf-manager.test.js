import EpubKit from "../src/epub-kit";
import OpfManager from "../src/opf-manager";

import path from "path";

const epub2OpfPath = path.resolve(
  "./test/fixtures/a_dogs_tail/3174/OPS/content.opf"
);
const epub3OpfPath = path.resolve("./test/fixtures/alice/OPS/package.opf");
const testPath = path.resolve("./test/");
console.log("testPath", testPath);

test("can get epub3 metadata", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  expect(opfManager.metadata).toHaveProperty("meta");
});

test("can add item to metadata", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  opfManager.addMetadata("testkey", "test value");
  const foundMeta = opfManager.findMetadataValue("testkey");
  expect(foundMeta[0].value).toBe("test value");
});

test("can add item to metadata with attributes", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  const key = "testkey";
  const value = "test value";
  const attributes = [{ attrkey: "attr value" }];
  opfManager.addMetadata(key, value, attributes);
  const foundMeta = opfManager.findMetadataValue(key);
  expect(foundMeta[0].value).toBe(value);
  expect(foundMeta[0].attributes).toBe(attributes);
});

test("can get epub3 empty spine toc attribute without crashing", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  expect(opfManager.spineToc).toBe(undefined);
});

test("can set spine TOC attribute", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  opfManager.spineToc = "toc";
  expect(opfManager.spineToc).toBe("toc");
});

test("can add item to manifest", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  const originalLength = opfManager.manifestItems.length;

  const newManifest = opfManager.addManifestItem(
    "hreftest.xhtml",
    "testId",
    "aatest-type"
  );

  const newLength = opfManager.manifestItems.length;

  expect(newLength).toBe(originalLength + 1);
  //console.log("newManifest", JSON.stringify(newManifest, null, 4));
});

test("can sort manifest", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  const newManifest = opfManager.addManifestItem(
    "hreftest.xhtml",
    "aaatestId",
    "aatest-type"
  );

  opfManager.sortManifest();

  const manifestItems = opfManager.manifestItems;
  expect(manifestItems[0].id).toBe("aaatestId");
});

test("can find manifest item with id", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);

  const item = opfManager.findManifestItemWithId("cover");

  expect(item.id).toBe("cover");
  expect(item.href).toBe("cover.xhtml");
});

test("can find manifest item with property", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);

  const item = opfManager.findManifestItemWithProperties("nav");

  expect(item.id).toBe("toc");
  expect(item.href).toBe("toc.xhtml");
});

test("can find epub3 Toc Href", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  const href = opfManager.findTocHref();
  expect(href).toBe("toc.xhtml");
});

test("can find epub3 Toc path", async () => {
  const opfManager = new OpfManager();
  await opfManager.loadFile(epub3OpfPath);
  const href = opfManager.findTocPath();
  expect(href).toBe(`${testPath}/fixtures/alice/OPS/toc.xhtml`);
});

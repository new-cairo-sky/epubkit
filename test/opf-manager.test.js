import EpubKit from "../src/epub-kit";
import OpfManager from "../src/opf-manager";

import path from "path";

test("can add item to manifest", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale/3174/content.opf");
  const opfManager = new OpfManager(epubPath);
  await opfManager.loadFile();
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
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale/3174/content.opf");
  const opfManager = new OpfManager(epubPath);
  await opfManager.loadFile();
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
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale/3174/content.opf");
  const opfManager = new OpfManager(epubPath);
  await opfManager.loadFile();

  const item = opfManager.findManifestItemWithId("coverpage");

  const manifestItems = opfManager.manifestItems;
  expect(item.id).toBe("coverpage");
  expect(item.href).toBe(
    "@public@vhost@g@gutenberg@html@files@3174@3174-h@images@cover.jpg"
  );
});

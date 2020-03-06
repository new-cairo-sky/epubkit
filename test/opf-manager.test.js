import EpubKit from "../src/epub-kit";
import OpfManager from "../src/opf-manager";

import path from "path";

test("can add to manifest", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale/3174/content.opf");
  const opfManager = new OpfManager(epubPath);
  await opfManager.loadFile();
  const newManifest = opfManager.addManifestItem(
    "hreftest.xhtml",
    "testId",
    "aatest-type"
  );
  console.log("newManifest", JSON.stringify(newManifest, null, 4));
});

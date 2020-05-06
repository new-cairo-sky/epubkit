import path from "path";
import FileManager from "../src/file-manager";
import OpfManager from "../src/opf-manager";
import {
  pathToObject,
  opfManifestToBrowserFsIndex,
} from "../src/utils/opf-to-browser-fs-index";

const epub3OpfPath = path.resolve("./test/fixtures/alice/OPS/package.opf");

test("can convert path to nested object", () => {
  const testPath = "/root/one/two/file.txt";

  const result = pathToObject(testPath);
  console.log("result", result);
});

test("can convert manifest to BrowserFS index object", async () => {
  const opfManager = new OpfManager();
  const data = await FileManager.readXmlFile(epub3OpfPath);
  opfManager.init(data);
  const manifestItems = opfManager.manifestItems;
  const result = opfManifestToBrowserFsIndex(
    manifestItems,
    "/test/fixtures/alice/",
    "/test/fixtures/alice/OPS/package.opf"
  );
  console.log("result", result);
});

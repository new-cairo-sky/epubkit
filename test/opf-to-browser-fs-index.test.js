import path from "path";
import FileManager from "../src/file-manager";
import OpfManager from "../src/opf-manager";
import PackageManager from "../src/package-manager";

import {
  pathToObject,
  opfManifestToBrowserFsIndex,
} from "../src/utils/opf-to-browser-fs-index";

const epub3OpfEpubLocation = "OPS/package.opf";
const epub3OpfPath = path.resolve("./test/fixtures/alice/OPS/package.opf");

test("can convert path to nested object", () => {
  const testPath = "/root/one/two/file.txt";

  const result = pathToObject(testPath);
  console.log("result", result);
});

test("can convert manifest to BrowserFS index object", async () => {
  const packageManager = new PackageManager();
  const data = await FileManager.readFile(epub3OpfPath);
  await packageManager.loadXml(data);
  packageManager.location = epub3OpfEpubLocation;
  const manifestItems = packageManager.manifest.items;
  const result = opfManifestToBrowserFsIndex(manifestItems, "OPS/package.opf");
  console.log("result", result);
  expect(result).toHaveProperty("OPS");
  expect(result).toHaveProperty("mimetype");
  expect(result).toHaveProperty(["OPS", "package.opf"]);
});

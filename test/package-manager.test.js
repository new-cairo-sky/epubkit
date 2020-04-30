import path from "path";

import Package from "../src/package-manager";
import FileManager from "../src/file-manager";

const epub2OpfPath = path.resolve(
  "./test/fixtures/a_dogs_tail/3174/OPS/content.opf"
);
const epub3OpfPath = path.resolve("./test/fixtures/alice/OPS/package.opf");

test("can parse package.opf xml", async () => {
  const packageHandler = new Package();
  const fileManager = new FileManager();
  const data = await fileManager.readFile(epub3OpfPath);
  await packageHandler.parseXml(data);
  const metadata = packageHandler.metadata;

  expect(metadata).toBeTruthy();
});

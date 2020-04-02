import EpubKit from "../src/epub-kit";
import path from "path";

test("can open epub directory", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubKit = new EpubKit();
  await epubKit.load(epubPath);
  expect(epubKit.pathToSource).toBe(epubPath);
});

test("can find opf", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubKit = new EpubKit();
  await epubKit.load(epubPath);
  expect(epubKit.opfFilePath).toBe(`${epubPath}/3174/content.opf`);
});

test("can read toc.ncx", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubKit = new EpubKit();
  await epubKit.load(epubPath);
  const ncx = epubKit.ncx;
  console.log("ncx", ncx);
  expect(epubKit.pathToSource).toBe(epubPath);
  expect(ncx.content).toBeTruthy();
  expect(ncx.content.ncx).toBeTruthy();
});

import EpubKit from "../src/epub-kit";
import path from "path";

test("can open epub directory", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubKit = new EpubKit();
  await epubKit.load(epubPath);
  expect(epubKit.pathToSource).toBe(epubPath);
});

test("can open epub directory in browser", async () => {
  await page.goto("http://localhost:3000");
  await page.once("load", () => {
    console.log("loaded");
    document.getElementById("result").textContent;
  });
  await expect(page).toMatch("/epubkit/overlay/assets/alice/OPS/package.opf");
  // page.evaluate(() => )
  // expect(result).toBe("/epubkit/zip/OPS/package.opf");
});

test("can find opf", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubKit = new EpubKit();
  await epubKit.load(epubPath);
  expect(epubKit.opfFilePath?.split(path.sep).pop()).toBe(`content.opf`);
});

test("can read toc.ncx", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubKit = new EpubKit();
  await epubKit.load(epubPath);
  const ncx = epubKit.ncx;
  expect(epubKit.pathToSource).toBe(epubPath);
  expect(ncx?.content).toBeTruthy();
  expect(ncx?.content.ncx).toBeTruthy();
});

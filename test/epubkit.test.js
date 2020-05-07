import Epubkit from "../src/epubkit";
import path from "path";

test("can open epub directory in node", async () => {
  process.env.MOCK_ENV = "node";
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubkit = new Epubkit();
  await epubkit.load(epubPath);
  expect(epubkit.pathToSource).toBe(epubPath);
});

test("can open epub directory in browser", async () => {
  process.env.MOCK_ENV = "browser";
  await page.goto("http://localhost:3000");
  await page.once("load", () => {
    console.log("loaded");
    document.getElementById("result").textContent;
  });
  await expect(page).toMatch("/epubkit/overlay/OPS/package.opf");
  // page.evaluate(() => )
  // expect(result).toBe("/epubkit/zip/OPS/package.opf");
});

test("can find opf", async () => {
  process.env.MOCK_ENV = "node";
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubkit = new Epubkit();
  await epubkit.load(epubPath);
  expect(epubkit.opfFilePath?.split(path.sep).pop()).toBe(`content.opf`);
});

test("can read toc.ncx", async () => {
  process.env.MOCK_ENV = "node";
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const epubkit = new Epubkit();
  await epubkit.load(epubPath);
  const ncx = epubkit.ncx;
  expect(epubkit.pathToSource).toBe(epubPath);
  expect(ncx?.content).toBeTruthy();
  expect(ncx?.content.ncx).toBeTruthy();
});

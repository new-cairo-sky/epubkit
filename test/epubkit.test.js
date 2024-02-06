import Epubkit from "../src/epubkit";
import path from "path";

describe("Can open epub directory in both node and browser", () => {
  it("can open epub directory in node", async () => {
    process.env.MOCK_ENV = "node";
    const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
    const epubkit = new Epubkit();
    await epubkit.load(epubPath);
    expect(epubkit.pathToSource).toBe(epubPath);
  });

  it("can open epub directory in browser", async () => {
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
});

describe("Can read epub internal files", () => {
  it("can find opf", async () => {
    process.env.MOCK_ENV = "node";
    const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
    const epubkit = new Epubkit();
    await epubkit.load(epubPath);
    expect(epubkit.opfFilePath?.split(path.sep).pop()).toBe(`content.opf`);
  });

  it.only("can read toc.ncx", async () => {
    process.env.MOCK_ENV = "node";
    const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
    const epubkit = new Epubkit();
    await epubkit.load(epubPath);
    const ncx = epubkit.ncx;
    expect(epubkit.pathToSource).toBe(epubPath);
    expect(ncx?.content).toBeTruthy();
    expect(ncx?.content.ncx).toBeTruthy();
  });
});
describe("findAllResources", () => {
  it("findAllResources", async () => {
    process.env.MOCK_ENV = "node";
    const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
    const epubkit = new Epubkit();
    await epubkit.load(epubPath);
    const resources = await epubkit.findAllResources();
    console.log(resources);
    expect(resources.length).toBe(12);
    const manifestResources = resources.filter((r) => !!r.id);
    // check that each resource has expected properties
    manifestResources.forEach((r) => {
      expect(r.href).toBeTruthy();
      expect(r.mediaType).toBeTruthy();
      expect(r.id).toBeTruthy();
      expect(r.location).toBeTruthy();
    });
  });
});

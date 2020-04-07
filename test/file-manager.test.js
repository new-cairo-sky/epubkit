import path from "path";
import FileManager from "../src/file-manager";

test("can prepare epub directory in browser", async () => {
  const fileManager = new FileManager();

  const epubPath = "/assets/alice.epub";

  // see: https://github.com/puppeteer/puppeteer/issues/2138
  page.evaluateOnNewDocument(`
    Object.defineProperty(window, 'epubPath', {
        get() {
        return '${epubPath}'
        }
    })
  `);

  await page.goto("http://localhost:3000");
  await page.once("load", () => {
    const epubPath = document.getElementById("epubPath").textContent;
    console.log("loaded", epubPath);
  });
  // await page.addScriptTag({
  //   content: `window.epubPath = "testtest";`
  // });
  await expect(page).toMatch(epubPath);
  await expect(page).toMatch("/epubkit/zip/OPS/package.opf");
});

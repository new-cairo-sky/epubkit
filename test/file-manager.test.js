import path from "path";
import FileManager from "../src/file-manager";

test("can prepare epub directory in browser", async () => {
  await jestPuppeteer.resetPage();
  const fileManager = new FileManager();

  const epubPath = "/fixtures/alice";

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
    const checkEpubPath = document.getElementById("epubPath").textContent;
    console.log("loaded", checkEpubPath);
  });

  await expect(page).toMatch(epubPath);
  await expect(page).toMatch("/epubkit/overlay/fixtures/alice");
});

test("can prepare epub archive in browser", async () => {
  await jestPuppeteer.resetPage();
  const fileManager = new FileManager();

  const epubPath = "/fixtures/alice.epub";

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
    const checkEpubPath = document.getElementById("epubPath").textContent;
    console.log("loaded", checkEpubPath);
  });
  await expect(page).toMatch(epubPath);
  await expect(page).toMatch("/epubkit/overlay/alice");
});

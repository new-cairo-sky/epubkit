import fs from "fs";
const util = require("util");
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
import os from "os";
import path from "path";

import { promisify } from "es6-promisify";
import FileManager from "../src/file-manager";
import epubkitCheck from "epubkit-check";

// beforeAll(async () => {
//   // clear out output directory

//   const directory = path.resolve("./test/output");

//   try {
//     const files = await readdir(directory);
//     const unlinkPromises = files.map((filename) =>
//       unlink(`${directory}/${filename}`)
//     );
//     return Promise.all(unlinkPromises);
//   } catch (err) {
//     console.log(err);
//   }
// });

beforeEach(async () => {
  //FileSaver.mockClear();

  const directory = path.resolve("./test/output");

  try {
    const files = await readdir(directory);
    const unlinkPromises = files.map((filename) =>
      unlink(`${directory}/${filename}`)
    );
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
});

test("can find All Files in directory in node.js", async () => {
  const fileManager = new FileManager("node");
  const epubPath = "./test/fixtures/alice";
  const fileList = await fileManager.findAllFiles(epubPath);
  expect(fileList.length).toBe(45);
});

// test("can find All Files in directory in browser", async () => {
//   const fileManager = new FileManager();
//   const epubPath = "./test/fixtures/alice";
//   await fileManager.prepareEpubDir(epubPath);
//   const fileList = await fileManager.findAllFiles(epubPath);
//   expect(fileList.length).toBe(45);
// });

test("can prepare epub directory in browser", async () => {
  await jestPuppeteer.resetPage();

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

test("can save epub dir to new archive with node.js fs", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const fileManager = new FileManager("node");
  const workingPath = await fileManager.prepareEpubDir(epubPath);

  // check working path
  const expectedWorkingPath = await promisify(fs.realpath)(os.tmpdir);
  expect(workingPath.indexOf(expectedWorkingPath)).toBe(0);

  const outputPath = path.resolve("./test/output/a_dogs_tale.epub");
  console.log("attempting to save to ", outputPath);
  await fileManager.saveEpubArchive(outputPath);
  const stats = await promisify(fs.stat)(outputPath);
  expect(stats.isFile()).toBe(true);
});

/**
 * Test that fileSaver produces a file download
 * Unfortunetly headless chrome does not seem to save the download. see:
 * https://stackoverflow.com/questions/49245080/how-to-download-file-with-puppeteer-using-headless-true
 * https://github.com/puppeteer/puppeteer/issues/299
 * https://javascript.info/blob
 * https://github.com/puppeteer/puppeteer/issues/3463
 * https://github.com/puppeteer/puppeteer/issues/3722
 */
test("can save epub dir to new archive in a browser", async () => {
  await jestPuppeteer.resetPage();
  jest.setTimeout(10000);
  const epubPath = "/fixtures/alice";
  const downloadPath = path.resolve(__dirname, "output");
  const client = await page.target().createCDPSession();

  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  page.evaluateOnNewDocument(`
    Object.defineProperty(window, 'epubPath', {
        get() {
        return '${epubPath}'
        }
    });
  `);

  await page.goto("http://localhost:3000");

  await expect(page).toMatch(epubPath);

  // the page lists all the resources in the epub. there should be 44 files.
  await expect(page).toMatch("44:");

  // print out all the comments made within the browser.
  await Promise.all([
    page.on("console", (msg) => {
      console.log("browser console", msg.text());
    }),
  ]);

  // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pageexposefunctionname-puppeteerfunction
  await page.exposeFunction("writeFile", async (filePath, content) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });

  /**
   * Headless chrome is not able to transfer blobs or buffers to node.
   * Instead it needs to be transfered in the form of a "binary string"
   * This function reads the binary string into a buffer before saving it to a file.
   * see: https://github.com/puppeteer/puppeteer/issues/3722
   */
  await page.exposeFunction("transferData", async (binaryString) => {
    return new Promise((resolve, reject) => {
      const binaryData = Buffer.from(binaryString, "binary");
      const filePath = "./test/output/file-saver-data.epub";
      fs.writeFile(filePath, binaryData, (err, result) => {
        console.log("writefile cb");
        if (err) reject(err);
        else resolve(result);
      });
    });
  });

  /**
   * Test that FileSaver produces an Epub file.
   * Unfortunetaly, headless chrome does not seem seem to download the actual file.
   */
  await page.evaluate(() => {
    /**
     * In Chrome, FileSaver module uses createElement but does not insert it into the DOM
     * and therefore cannot be captured with a jest expect.
     * In order to capture the event, the document.createElement instance is modified
     * and an onClick handler is added to the a element to capture the FileSaver click event.
     * see: https://stackoverflow.com/questions/11727759/hooking-document-createelement-using-function-prototype
     */

    document.createElement = ((create) => {
      console.log("create element a");
      return function () {
        const ret = create.apply(this, arguments);
        if (ret.tagName.toLowerCase() === "a") {
          ret.onclick = async (e) => {
            if (e.target.download === "test.epub") {
            }
            console.log(`create element onClick ${e.target.download}`);
            const objectUrl = e.target.href;
            let data;

            response = await fetch(objectUrl);

            if (!response.ok) {
              console.log("could not fetch.");
            } else {
              // when the click event is dispatched, we can grab the ObjectUrl
              // that FileSaver created. See also the comment above for the transferData
              // function.
              // https://github.com/puppeteer/puppeteer/issues/3722
              data = await response.blob();
              const reader = new FileReader();
              reader.readAsBinaryString(data);
              reader.onload = async () => {
                const binaryString = reader.result;
                await window.transferData(binaryString);
                const div = document.createElement("div");
                div.innerText = "Download Complete";
                window.document.body.appendChild(div);
              };
              reader.onerror = () =>
                reject("Error occurred while reading binary string");
            }
          };
        }
        return ret;
      };
    })(document.createElement);
  });

  await expect(page).toClick("button");

  await expect(page).toMatch("Saved");

  await expect(page).toMatch("Download Complete");

  const epubCheckResult = await epubkitCheck(
    "./test/output/file-saver-data.epub"
  );

  await expect(epubCheckResult.pass).toBe(true);
});

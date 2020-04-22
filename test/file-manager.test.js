import fs from "fs";
const util = require("util");
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
import os from "os";
import path from "path";
import { promisify } from "es6-promisify";
import FileManager from "../src/file-manager";

beforeAll(async () => {
  // clear out output directory

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
  const fileManager = new FileManager();
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

test("can save epub dir to new archive with node.js fs", async () => {
  const epubPath = path.resolve("./test/fixtures/a_dogs_tale");
  const fileManager = new FileManager();
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

// https://stackoverflow.com/questions/44686077/how-to-use-jest-to-test-file-download

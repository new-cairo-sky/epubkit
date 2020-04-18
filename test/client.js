import "core-js/stable";
import "regenerator-runtime/runtime";
import EpubKit from "../src/epub-kit";
const BrowserFS = require("browserfs");

BrowserFS.install(window);

async function test() {
  const TestEpubKit = new EpubKit();
  const srcEpubPath = window.epubPath ? window.epubPath : "/fixtures/alice";
  await TestEpubKit.load(srcEpubPath);
  console.log("opf file", TestEpubKit.opfFilePath);
  document.getElementById("src-epub-path").innerText = srcEpubPath;
  document.getElementById("working-path").innerText = TestEpubKit.pathToEpubDir;
  document.getElementById("opf-path").innerText = TestEpubKit.opfFilePath;
}
window.onload = () => {
  test();
};

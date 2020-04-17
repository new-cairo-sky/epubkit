import "core-js/stable";
import "regenerator-runtime/runtime";
import EpubKit from "../src/epub-kit";
const BrowserFS = require("browserfs");

BrowserFS.install(window);

async function test() {
  const TestEpubKit = new EpubKit();
  const epubPath = window.epubPath ? window.epubPath : "/fixtures/alice";
  await TestEpubKit.load(epubPath);
  console.log("opf file", TestEpubKit.opfFilePath);
  document.getElementById("epubpath").innerText = epubPath;
  const el = document.getElementById("result");
  el.innerText = TestEpubKit.opfFilePath;
}
window.onload = () => {
  test();
};

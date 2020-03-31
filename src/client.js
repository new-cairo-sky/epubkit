import "core-js/stable";
import "regenerator-runtime/runtime";
import EpubKit from "./epub-kit";
const BrowserFS = require("browserfs");

BrowserFS.install(window);

async function test() {
  const TestEpubKit = new EpubKit("/assets/alice.epub");
  await TestEpubKit.load();
  console.log("opf file", TestEpubKit.opfFilePath);
}

test();

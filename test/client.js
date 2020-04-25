import "core-js/stable";
import "regenerator-runtime/runtime";
import EpubKit from "../src/epub-kit";
const BrowserFS = require("browserfs");

BrowserFS.install(window);

async function test() {
  const TestEpubKit = new EpubKit("browser");
  const srcEpubPath = window.epubPath ? window.epubPath : "/fixtures/alice";
  await TestEpubKit.load(srcEpubPath);
  console.log("opf file", TestEpubKit.opfFilePath);
  document.getElementById("src-epub-path").innerText = srcEpubPath;
  document.getElementById("working-path").innerText = TestEpubKit.pathToEpubDir;
  document.getElementById("opf-path").innerText = TestEpubKit.opfFilePath;
  document.getElementById("save-epub").onclick = async () => {
    console.log("save");
    await TestEpubKit.saveAs("test.epub");
    document.getElementById("save-epub").innerText = "Saved";
  };

  const files = await TestEpubKit.fileManager.findAllFiles(
    TestEpubKit.pathToEpubDir
  );
  const fileList = files.map((file, i) => `<li>${i}: ${file}</li>`);

  document.getElementById("file-list").innerHTML = fileList.join("\r");
}
window.onload = () => {
  test();
};

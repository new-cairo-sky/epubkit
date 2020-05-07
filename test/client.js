import "core-js/stable";
import "regenerator-runtime/runtime";
import Epubkit from "../src/epubkit";
import FileManager from "../src/file-manager";
const BrowserFS = require("browserfs");

BrowserFS.install(window);

async function test() {
  const TestEpubkit = new Epubkit("browser");
  const srcEpubPath = window.epubPath ? window.epubPath : "/fixtures/alice";
  await TestEpubkit.load(srcEpubPath);
  const files = await FileManager.findAllFiles(TestEpubkit.pathToEpubDir);
  console.log("files", files);
  const fileList = files.map((file, i) => `<li>${i}: ${file}</li>`);

  console.log("opf file", TestEpubkit.opfFilePath);

  document.getElementById("src-epub-path").innerText = srcEpubPath;
  document.getElementById("working-path").innerText = TestEpubkit.pathToEpubDir;
  document.getElementById("opf-path").innerText = TestEpubkit.opfFilePath;

  document.getElementById("save-epub").onclick = async () => {
    console.log("save");
    await TestEpubkit.saveAs("test.epub");
    document.getElementById("save-epub").innerText = "Saved";
  };

  document.getElementById("file-list").innerHTML = fileList.join("\r");
}
window.onload = () => {
  test();
};

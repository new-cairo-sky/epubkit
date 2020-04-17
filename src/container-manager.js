import { promisify } from "es6-promisify";
import xml2js from "xml2js";
import FileManager from "./file-manager";
/**
 * Manager for the container.xml file
 * https://www.w3.org/publishing/epub32/epub-ocf.html
 */
class ContainerManager {
  constructor(path) {
    this._path = path;
    this._content = undefined;
  }

  async loadFile(newPath) {
    let result;
    this._path = newPath ? newPath : this._path;

    const fileManager = new FileManager();
    const data = await fileManager.readFile(this._path);

    if (!data) {
      console.warn("Error reading file", this._path);
      return;
    }

    try {
      // const parser = new xml2js.Parser();
      result = await promisify(xml2js.parseString)(data);
    } catch (err) {
      console.warn("Error parsing container.xml file:", err);
      return;
    }

    this._content = result;
    return result;
  }

  get rootFilePath() {
    if (!this._content) {
      return;
    }
    const rootPath = this._content?.container?.rootfiles[0].rootfile[0]?.$[
      "full-path"
    ];
    return rootPath;
  }

  get path() {
    return this._path;
  }

  get content() {
    return this._content;
  }
}

export default ContainerManager;

import fs from "fs";
import util from "util";
import xml2js from "xml2js";
import FileManager from "./file-manager";

class NcxManager {
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
      result = await util.promisify(xml2js.parseString)(data);
    } catch (err) {
      console.warn("Error parsing ncx file:", err);
      return;
    }

    console.log("ncx", JSON.stringify(result));
    this._content = result;
    return result;
  }

  get path() {
    return this._path;
  }

  get content() {
    return this._content;
  }
}

export default NcxManager;

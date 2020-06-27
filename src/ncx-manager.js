import { promisify } from "es6-promisify";
import xml2js from "xml2js";
import FileManager from "./file-manager";
import DataElement from "./data-element";
import {
  parseXml,
  generateXml,
  filterAttributes,
  prepareItemsForXml,
} from "./utils/xml";

class NcxManager {
  constructor() {
    this._content = undefined;
  }

  init(jsonData) {
    this._content = jsonData;
  }

  async loadXml() {
    const result = await parseXml(data);

    if (result) {
      this.rawData = result;

      if (this.rawData.package.attr) {
        this.addAttributes(this.rawData.ncx.attr);
      }
    }
  }

  async oldloadFile(newPath) {
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
      console.warn("Error parsing ncx file:", err);
      return;
    }

    this._content = result;
    return result;
  }

  get content() {
    return this._content;
  }
}

export default NcxManager;

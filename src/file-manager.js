import { promises as fs } from "fs";
import path from "path";

/**
 * This class acts as an abstraction layer over native node file system libraries
 * so that it will be easier to adopt for use in client side applications later
 */
class FileManager {
  async readFile(location) {
    let data;
    try {
      data = await fs.readFile(location /*, "utf8"*/);
    } catch (err) {
      console.warn("Could not readFile", err);
      return;
    }
    return data;
  }

  async walk(directoryName, results = []) {
    let files = await fs.readdir(directoryName, { withFileTypes: true });
    for (let f of files) {
      let fullPath = path.join(directoryName, f.name);
      if (f.isDirectory()) {
        await this.walk(fullPath, results);
      } else {
        results.push(fullPath);
      }
    }
    return results;
  }

  async findFilesWithExt(directoryName, findExt, results = []) {
    let files = await fs.readdir(directoryName, { withFileTypes: true });

    const ext = findExt.substr(0, 1) === "." ? findExt : `.${findExt}`;

    for (let f of files) {
      let fullPath = path.join(directoryName, f.name);
      if (f.isDirectory()) {
        await this.findFilesWithExt(fullPath, findExt, results);
      } else {
        if (path.extname(fullPath) === ext) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }
}

export default FileManager;

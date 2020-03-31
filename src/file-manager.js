import fs from "fs";
import path from "path";
// NOTE: we cannot use the native fs promises because BrowserFS does not support them yet.
import { promisify } from "es6-promisify";

/**
 * This class acts as an abstraction layer over the node file system libraries.
 * For browser clients the BroswerFS module is used to emulate Node FS.
 * Most of the nasty details in managing the different environments is contained in here.
 *
 * see also:
 * https://github.com/jvilk/BrowserFS
 * https://github.com/browserify/path-browserify
 *
 */
class FileManager {
  constructor() {
    this._isClient = typeof window != "undefined" && window.document;
  }

  async getStats(location) {
    let stats;

    try {
      stats = await promisify(fs.stat)(location);
    } catch (err) {
      console.warn("Could not get stat", err.message);
      return;
    }
    return stats;
  }

  async isDir(location) {
    const stats = await this.getStats(location);
    if (stats) {
      return stats.isDirectory();
    }
    return;
  }

  async isFile(location) {
    const stats = await this.getStats(location);
    if (stats) {
      return stats.isFile();
    }
    return;
  }

  async prepareEpubArchive(location) {
    const isEpub = this.isEpubArchive(location);

    if (!isEpub) {
      console.warn("File is not an epub", location);
      return;
    }

    if (this._isClient) {
      // if running in client, use BrowserFS to mount Zip as file system in memory
      console.log("Mounting epub archive with BrowserFS", location);
      const response = await fetch(location);
      const zipData = await response.arrayBuffer();
      const Buffer = BrowserFS.BFSRequire("buffer").Buffer;
      const epubDir = path.resolve("/tmp", path.basename(location));
      console.log("configure BroswerFS", epubDir);

      const result = await promisify(BrowserFS.configure)({
        fs: "MountableFileSystem",
        options: {
          "/zip": {
            fs: "ZipFS",
            options: {
              // Wrap as Buffer object.
              zipData: Buffer.from(zipData)
            }
          },
          "/tmp": { fs: "InMemory" }
        }
      });

      if (result) {
        // An error occurred.
        console.warn("Error at BrowserFS.configure", result.message);
        throw result;
      }
      console.log("BrowserFS init complete", epubDir);
      const files = await promisify(fs.readdir)("/zip");
      console.log("epub contents", files);
      return "/zip";
    } else {
      // when running in Node, decompress epub to tmp directory.
      const tmpDir = os.tmpdir();
      const tmpPath = path.resolve(tmpDir, path.basename(location));
      const AdmZip = new AdmZip(location);
      AdmZip.extractAllTo(tmpPath, true);
      return tmpPath;
    }
  }

  isEpubArchive(location) {
    const ext = path.extname(location);

    if (ext === ".epub") {
      return true;
    }

    return false;
  }

  async readFile(location) {
    let data;
    try {
      data = await promisify(fs.readFile)(location /*, "utf8"*/);
    } catch (err) {
      console.warn("Could not readFile", err);
      return;
    }
    return data;
  }

  async walk(directoryName, results = []) {
    let files = await promisify(fs.readdir)(directoryName, {
      withFileTypes: true
    });
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
    let files = await promisify(fs.readdir)(directoryName, {
      withFileTypes: true
    });

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

  async fileExists(path) {
    try {
      const stats = await promisify(fs.stat)(path);
      if (stats.isFile()) {
        return true;
      }
    } catch (err) {
      console.warn("Could not detect file", path);
      return false;
    }

    return false;
  }

  get isClient() {
    return this._isClient;
  }
}

export default FileManager;

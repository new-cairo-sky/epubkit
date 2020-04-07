import fs from "fs";
import path from "path";
// NOTE: we cannot use the native fs promises because BrowserFS does not support them yet.
import { promisify } from "es6-promisify";
import xml2js from "xml2js";
import OpfManager from "./opf-manager";

import { opfManifestToBrowserFsIndex } from "./utils/opf-to-browser-fs-index";
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
    this._fetchOptions = {};
    this._virtualPath = "/epubkit";
    this._workingPath = undefined;
  }

  async loadEpub(location) {
    if (this.isEpubArchive(location)) {
      this._workingPath = this.prepareEpubArchive(location);
    } else {
    }
  }
  /**
   * When running in a browser client, fetch is used to load files.
   * fetchOptions are passed to the fetch options parameter.
   *
   * @param {object} options - a fetch options object
   */
  set fetchOptions(options) {
    this._fetchOptions = options;
  }

  get fetchOptions() {
    return this._fetchOptions;
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

  /**
   * When loading an Epub directory in a browser client, the files
   * are fetched lazily by BrowserFS and saved to localStorage.
   * @param {string} location
   */
  async prepareEpubDir(location) {
    if (this._isClient) {
      /*
      For the browser we need to build a file index for BrowserFS 
      That index is derived from the OPF file so we must find the opf
      path given in the container.xml file. 
      There is a chicken and egg problem in that BrowserFS can not be 
      initialized without the file index, so we must preload the container.xml
      and OPF file first. 
      */
      const containerLocation = "./META-INF/container.xml";
      const containerUrl = path.resolve(location, containerLocation);
      const response = await fetch(containerUrl, this._fetchOptions);

      if (!response.ok) {
        console.error("Error fetching container.xml");
        return;
      }
      const containerData = await response.text();
      console.log("containerData", containerData);
      let manifestPath;
      try {
        // const parser = new xml2js.Parser();
        const result = await promisify(xml2js.parseString)(containerData);

        manifestPath =
          result?.container?.rootfiles[0].rootfile[0]?.$["full-path"];
        if (!manifestPath) {
          console.error("Could not find path to opf file.");
          return;
        }
      } catch (err) {
        console.error("Error parsing container.xml file:", err);
        return;
      }

      const opfLocation = path.resolve(location, manifestPath);
      const opfFetchResponse = await fetch(opfLocation, this._fetchOptions);
      const opfData = await opfFetchResponse.text();
      const opfManager = new OpfManager();
      await opfManager.loadData(opfData);
      const manifestItems = opfManager.manifestItems;

      const fsManifestPath = path.join(location, manifestPath);
      const fileIndex = opfManifestToBrowserFsIndex(
        manifestItems,
        location,
        fsManifestPath
      );
      console.log("Mounting epub directiry with BrowserFS", location);
      console.log("file index", JSON.parse(JSON.stringify(fileIndex)));

      try {
        const result = await promisify(BrowserFS.configure)({
          fs: "MountableFileSystem",
          options: {
            [this._virtualPath + "/overlay"]: {
              fs: "OverlayFS",
              options: {
                readable: {
                  fs: "HTTPRequest",
                  options: {
                    index: fileIndex /* a json directory structure */,
                  },
                },
                writable: {
                  fs: "LocalStorage",
                },
              },
            },
          },
        });
      } catch (err) {
        console.error("Error configuring BrowserFS:", err.message);
        return;
      }
      fs.readdir("./epubkit/overlay/assets/alice/META-INF", (err, files) => {
        files.forEach((file) => {
          console.log(":", file);
        });
      });

      // return the virtual path to the epub root
      return `${this._virtualPath}/overlay/${location}/`;
    }
  }

  /**
   * Loads and unarchives an .epub file to a tmp working directory
   * When in browser client, BrowserFS will unzip the archive to the virtual path `${this._virtualPath}/zip`
   *
   * @param {string} location - the url or path to an .epub file
   * @returns {string} - the path to the tmp location
   */
  async prepareEpubArchive(location) {
    const isEpub = this.isEpubArchive(location);

    if (!isEpub) {
      console.warn("File is not an epub", location);
      return;
    }

    if (this._isClient) {
      // if running in client, use BrowserFS to mount Zip as file system in memory
      console.log("Mounting epub archive with BrowserFS", location);
      const response = await fetch(location, this._fetchOptions);
      const zipData = await response.arrayBuffer();
      const Buffer = BrowserFS.BFSRequire("buffer").Buffer;

      const result = await promisify(BrowserFS.configure)({
        fs: "MountableFileSystem",
        options: {
          [`${this._virtualPath}/zip`]: {
            fs: "ZipFS",
            options: {
              // Wrap as Buffer object.
              zipData: Buffer.from(zipData),
            },
          },
          "/tmp": { fs: "InMemory" },
        },
      });

      if (result) {
        // An error occurred.
        console.warn("Error at BrowserFS.configure", result.message);
        throw result;
      }

      // const files = await promisify(fs.readdir)("/zip");
      // console.log("epub contents", files);
      return `${this._virtualPath}/zip`;
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
      withFileTypes: true,
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
      withFileTypes: true,
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
      console.warn("Could not detect file", path, err);
      return false;
    }

    return false;
  }

  get isClient() {
    return this._isClient;
  }
}

export default FileManager;

import fs from "fs";
import os from "os";
import path from "path";
import FileSaver from "../node_modules/file-saver/src/FileSaver.js";
// NOTE: we cannot use the native fs promises because BrowserFS does not support them yet.
import { promisify } from "es6-promisify";
import xml2js from "xml2js";
import JSZip from "jszip";

import OpfManager from "./opf-manager";

import { opfManifestToBrowserFsIndex } from "./utils/opf-to-browser-fs-index";
/**
 * This class wraps a lot of the node fs file system library methods.
 * For browser clients the BroswerFS module is used to emulate Node FS and
 * FileSaver is used to enable client's to download documents for saving.
 * Most of the nasty details in managing the different environments is contained in here.
 *
 * see also:
 * https://github.com/jvilk/BrowserFS
 * https://github.com/browserify/path-browserify
 *
 */
class FileManager {
  constructor(environment = "auto") {
    if (environment === "auto") {
      console.log("window?", typeof window !== "undefined");
      this._environment = typeof window === "undefined" ? "node" : "browser";
    } else {
      this._environment = environment;
    }
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
   * Saves the epub archive to the given location. In the browser,
   * the user will be prompted to set the file download location.
   * This method relies on JSZip for ziping the archive in both client and node
   * TODO: if testing shows that JSZip is not best for node, consider using
   * archiver: https://github.com/archiverjs/node-archiver
   * epub zip spec: https://www.w3.org/publishing/epub3/epub-ocf.html#sec-zip-container-zipreqs
   * @param {string} location - destination path to save epub to
   * @param {boolean} compress - flag to enable archive compression
   */
  async saveEpubArchive(location, compress = false) {
    console.log("saveEpubArchive", location, this._environment, window);
    const pathInfo = path.parse(location);
    const epubName = pathInfo.name;

    const zip = new JSZip();
    const filePaths = await this.findAllFiles(this._workingPath);

    // mimetime must be first file in the zip;
    const mimeTypeContent = await this.readFile(
      path.resolve(this._workingPath, "mimetype")
    );
    zip.file("mimetype", mimeTypeContent);

    // to run in parallel see: https://stackoverflow.com/a/50874507/7943589
    for (const filePath of filePaths) {
      const contents = await this.readFile(filePath);
      // convert the absolute path to the internal epub path
      const relativePath = filePath.substring(
        `${path.normalize(this._workingPath)}/`.length
      );
      if (relativePath !== "mimetype") {
        if (contents) {
          zip.file(`${relativePath}`, contents);
        } else {
          console.error("Could not read contents of file", filePath);
          return;
        }
      }
    }

    let zipContent;

    try {
      zipContent = await zip.generateAsync({
        type: this._environment === "browser" ? "blob" : "nodebuffer",
        compression: compress ? "DEFLATE" : "STORE",
        compressionOptions: {
          level: compress
            ? 8
            : 0 /* only levels 0 or 8 are allowed in epub spec */,
        },
      });
    } catch (err) {
      console.log("Error at zip.generateAsync ", err);
    }

    console.log("zipCOntent", !!zipContent);

    if (zipContent) {
      // TODO- FileSaver is currently bugged in chrome:
      // see: https://github.com/eligrey/FileSaver.js/issues/624
      if (this._environment === "browser") {
        console.log("before try");
        try {
          const result = FileSaver.saveAs(zipContent, pathInfo.base);
          console.log("result", result);
        } catch (err) {
          console.error("Error saving epub", err);
          return;
        }
        console.log("FileSaver.saveAs() finished");
      } else {
        try {
          await promisify(fs.writeFile)(location, zipContent);
        } catch (err) {
          console.log("Error writing zip file:", err);
          return;
        }
      }
    } else {
      console.error("Error generating zip file.");
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

  set workingPath(location) {
    // TODO make sure this effects the prepareEpubDir and prepareEpubArchive
    this._workingPath = location;
  }

  get workingPath() {
    return this._workingPath;
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
   *
   * @param {string} location
   */
  async prepareEpubDir(location) {
    if (this._environment === "browser") {
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

      let opfJsonData;
      if (opfData) {
        try {
          opfJsonData = await promisify(xml2js.parseString)(opfData, {
            attrkey: "attr",
            charkey: "val",
            trim: true,
          });
        } catch (err) {
          console.warn("Error parsing container.xml file:", err);
          return;
        }
      }

      const opfManager = new OpfManager();
      await opfManager.init(opfJsonData);
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
            "/tmp": { fs: "InMemory" },
          },
        });
      } catch (err) {
        console.error("Error configuring BrowserFS:", err.message);
        return;
      }
      // fs.readdir("./epubkit/overlay/test/alice/META-INF", (err, files) => {
      //   files.forEach((file) => {
      //     console.log(":", file);
      //   });
      // });

      // return the virtual path to the epub root
      this._workingPath = path.normalize(
        `${this._virtualPath}/overlay/${location}`
      );
      return this._workingPath;
    } else {
      // when running in Node, copy the epub dir to tmp directory.
      let tmpDir;
      try {
        tmpDir = await this.getTmpDir();
      } catch (err) {
        throw err;
      }

      const epubDirName = location.split(path.sep).pop();

      const tmpPath = path.resolve(tmpDir, `${epubDirName}_${Date.now()}`);
      if (await this.dirExists(tmpPath)) {
        try {
          await promisify(fs.rmdir)(tmpPath, {
            recursive: true,
            maxRetries: 3,
          });
        } catch (err) {
          console.log("Could not remove dir", tmpPath, err.message);
          throw "Could not prepare directory. Tmp director already exists and could not be removed.";
        }
      }
      try {
        await this.copyDir(location, tmpPath);
      } catch (err) {
        console.error(
          "prepareEpubDir Error: Could not copy dir to",
          tmpPath,
          err.message
        );
        return;
      }

      this._workingPath = path.normalize(tmpPath);
      return this._workingPath;
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

    if (this._environment === "browser") {
      // if running in client, use BrowserFS to mount Zip as file system in memory
      console.log("Mounting epub archive with BrowserFS", location);
      const response = await fetch(location, this._fetchOptions);
      const zipData = await response.arrayBuffer();
      const Buffer = BrowserFS.BFSRequire("buffer").Buffer;
      const workingDir = path.parse(location).name;
      const result = await promisify(BrowserFS.configure)({
        fs: "MountableFileSystem",
        options: {
          [`${this._virtualPath}/overlay/${workingDir}`]: {
            fs: "OverlayFS",
            options: {
              readable: {
                fs: "ZipFS",
                options: {
                  // Wrap as Buffer object.
                  zipData: Buffer.from(zipData),
                },
              },
              writable: {
                fs: "LocalStorage",
              },
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
      fs.readdir("./epubkit/overlay", (err, files) => {
        console.log("files", files);
      });
      // return the virtual path to the epub root
      this._workingPath = path.normalize(
        `${this._virtualPath}/overlay/${workingDir}`
      );
      return this._workingPath;
    } else {
      // when running in Node, decompress epub to tmp directory.
      const tmpDir = os.tmpdir();
      const tmpPath = path.resolve(tmpDir, path.basename(location));
      const AdmZip = new AdmZip(location);
      AdmZip.extractAllTo(tmpPath, true);
      this._workingPath = tmpPath;
      return this._workingPath;
    }
  }

  isEpubArchive(location) {
    const ext = path.extname(location);

    if (ext === ".epub") {
      return true;
    }

    return false;
  }

  /**
   * Read a file and return the data
   * @param {string} location
   */
  async readFile(location) {
    let data;
    try {
      data = await promisify(fs.readFile)(location /*, "utf8"*/);
    } catch (err) {
      console.warn("Could not readFile", location, err);
      return;
    }
    return data;
  }

  /**
   * Read a XML file and parse it into a json object using xml2js
   * @param {string} - location
   * @returns {object} - a json object
   */
  async readXmlFile(location) {
    const data = await this.readFile(location);
    let result;
    if (data) {
      try {
        result = await promisify(xml2js.parseString)(data, {
          attrkey: "attr",
          charkey: "val",
          trim: true,
        });
      } catch (err) {
        console.warn("Error parsing container.xml file:", location, err);
      }
    }
    return result;
  }

  /**
   * Recursively searches a directory and returns a flat array of all files
   *
   * @param {string} directoryName - the base directory to search
   * @param {array} _results - private. holds _results for recursive search
   * @returns {array} - an array of file path strings
   */
  async findAllFiles(directoryName, _results = []) {
    let files;
    try {
      files = await this.readDir(directoryName);
    } catch (err) {
      console.error("Error reading directory", directoryName, err);
      return _results;
    }

    for (let file of files) {
      const fullPath = path.join(directoryName, file);
      if (await this.isDir(fullPath)) {
        await this.findAllFiles(fullPath, _results);
      } else {
        _results.push(fullPath);
      }
    }
    return _results;
  }

  async readDir(directory) {
    return new Promise((resolve, reject) => {
      fs.readdir(directory, (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  }

  /**
   * Recursively search directory for files with the given extension
   *
   * @param {string} directoryName - the dir to start search in
   * @param {string} findExt - the file extension to search for
   * @param {array} _results - private. holds results for recursive search
   * @returns {array} - an array of file path strings
   */
  async findFilesWithExt(directoryName, findExt, _results = []) {
    let files = await promisify(fs.readdir)(directoryName, {
      withFileTypes: true,
    });

    const ext = findExt.substr(0, 1) === "." ? findExt : `.${findExt}`;

    for (let f of files) {
      let fullPath = path.join(directoryName, f.name);
      if (f.isDirectory()) {
        await this.findFilesWithExt(fullPath, findExt, _results);
      } else {
        if (path.extname(fullPath) === ext) {
          _results.push(fullPath);
        }
      }
    }
    return _results;
  }

  /**
   * Checks if a file already exists at the given location
   *
   * @param {string} path - file path to test
   * @returns {boolean}
   */
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

  /**
   * Checks if a directory already exists at the given location
   * @param {string} path - dir to test
   * @returns {boolean}
   */
  async dirExists(path) {
    try {
      const stats = await promisify(fs.stat)(path);
      if (stats.isDirectory()) {
        return true;
      }
    } catch (err) {
      // console.warn("Could not detect dir", path, err.message);
      return false;
    }

    return false;
  }

  /**
   * Public class property isClient.
   * isClient indicates if we are running in a browser or not.
   * @returns {bool} - true if running in browser client, false if node.js
   */
  get isClient() {
    return this._environment === "browser";
  }

  /**
   * Recursive directory copy
   * @param {string} src - path to the directory to copy
   * @param {string} dest - path to the copy destination
   */
  async copyDir(src, dest) {
    const entries = await promisify(fs.readdir)(src, { withFileTypes: true });
    try {
      await promisify(fs.mkdir)(dest);
    } catch (err) {
      console.error("copyDir Error: Could not mkdir", dest, err.message);
      throw err;
    }

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await this.copyDir(srcPath, destPath);
      } else {
        await promisify(fs.copyFile)(srcPath, destPath);
      }
    }
  }

  /**
   * A wrapper for os.tmpdir that resolves symlinks
   * see: https://github.com/nodejs/node/issues/11422
   */
  async getTmpDir() {
    try {
      const tmpDir = await promisify(fs.realpath)(os.tmpdir);
      return tmpDir;
    } catch (err) {
      console.error("Error in getTmpDir", err.message);
      throw err;
    }
  }
}

export default FileManager;

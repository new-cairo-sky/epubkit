import fs from "fs";
import os from "os";
import path from "path";
import FileSaver from "file-saver"; //"../node_modules/file-saver/src/FileSaver.js";
// NOTE: we cannot use the native fs promises because BrowserFS does not support them yet.
import { promisify } from "es6-promisify";
import xml2js from "xml2js";
import JSZip from "jszip";

import PackageManager from "./package-manager";
import { opfManifestToBrowserFsIndex } from "./utils/opf-to-browser-fs-index";

/**
 * Most of the nasty details in managing the different environments is
 * contained in here.
 * This class wraps a lot of the node fs file system library methods.
 * For browser clients, the BroswerFS module is used to emulate Node FS and
 * FileSaver is used to enable client's to download documents for saving.
 * BrowserFS does not pollyfill the fs native promises, so many fs methods
 * are wrapped with promisify below.
 *
 * see also:
 * https://github.com/jvilk/BrowserFS
 * https://github.com/browserify/path-browserify
 *
 */
class FileManager {
  static get virtualPath() {
    return "/epubkit";
  }
  /**
   * Public class property environment.
   * environment indicates if we are running in a browser or not.
   * @returns {string} - one of "browser" or "node"
   */
  static get environment() {
    // for testing in jest we sometimes need to force the env node_env
    if (process?.env?.MOCK_ENV) {
      return process.env.MOCK_ENV;
    }
    return typeof window === "undefined" ? "node" : "browser";
  }

  static async loadEpub(location, fetchOptions = {}) {
    if (FileManager.isEpubArchive(location)) {
      const workingPath = await FileManager.prepareEpubArchive(
        location,
        fetchOptions
      );
      return workingPath;
    } else {
      const workingPath = await FileManager.prepareEpubDir(
        location,
        fetchOptions
      );
      return workingPath;
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
  static async saveEpubArchive(sourceLocation, saveLocation, compress = false) {
    const pathInfo = path.parse(saveLocation);
    const epubName = pathInfo.name;

    const zip = new JSZip();
    const filePaths = await FileManager.findAllFiles(sourceLocation);

    // mimetime must be first file in the zip;
    const mimeTypeContent = await FileManager.readFile(
      path.resolve(sourceLocation, "mimetype")
    );
    zip.file("mimetype", mimeTypeContent);

    // to run in parallel see: https://stackoverflow.com/a/50874507/7943589
    for (const filePath of filePaths) {
      const contents = await FileManager.readFile(filePath);
      // convert the absolute path to the internal epub path
      let relativePath = filePath.substring(
        `${path.normalize(sourceLocation)}`.length
      );
      if (relativePath.substring(0, 1) === "/") {
        relativePath = relativePath.substring(1);
      }
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
        type: FileManager.environment === "browser" ? "blob" : "nodebuffer",
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

    if (zipContent) {
      // TODO- FileSaver is currently bugged in chrome:
      // see: https://github.com/eligrey/FileSaver.js/issues/624
      if (FileManager.environment === "browser") {
        try {
          const result = FileSaver.saveAs(zipContent, pathInfo.base);
        } catch (err) {
          console.error("Error saving epub", err);
          return;
        }
      } else {
        try {
          await promisify(fs.writeFile)(saveLocation, zipContent);
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
   * When loading an Epub directory in a browser client, the files
   * are fetched lazily by BrowserFS and saved to localStorage.
   *
   * @param {string} location
   */
  static async prepareEpubDir(location, fetchOptions = {}) {
    if (FileManager.environment === "browser") {
      /*
      For the browser we need to build a file index for BrowserFS 
      That index is derived from the OPF file so we must find the opf
      path given in the container.xml file. 
      There is a chicken and egg problem in that BrowserFS can not be 
      initialized without the file index, so we must preload the container.xml
      and OPF file first. 
      */
      const prefixUrl = path.resolve(location);
      const containerLocation = "./META-INF/container.xml";
      const containerUrl = path.resolve(location, containerLocation);
      const response = await fetch(containerUrl, fetchOptions);

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
      const opfFetchResponse = await fetch(opfLocation, fetchOptions);
      const opfData = await opfFetchResponse.text();
      const packageManager = new PackageManager(manifestPath);
      await packageManager.loadXml(opfData);
      const manifestItems = packageManager.manifest.items;

      const fsManifestPath = path.join(location, manifestPath);
      const fileIndex = opfManifestToBrowserFsIndex(
        manifestItems,
        manifestPath
      );
      console.log("Mounting epub directory with BrowserFS", location);
      console.log("file index", JSON.parse(JSON.stringify(fileIndex)));

      try {
        const result = await promisify(BrowserFS.configure)({
          fs: "MountableFileSystem",
          options: {
            [FileManager.virtualPath + "/overlay"]: {
              fs: "OverlayFS",
              options: {
                readable: {
                  fs: "HTTPRequest",
                  options: {
                    baseUrl: prefixUrl,
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
      const workingPath = path.normalize(`${FileManager.virtualPath}/overlay/`);
      return workingPath;
    } else {
      // when running in Node, copy the epub dir to tmp directory.
      let tmpDir;
      try {
        tmpDir = await FileManager.getTmpDir();
      } catch (err) {
        throw err;
      }

      const epubDirName = location.split(path.sep).pop();

      const tmpPath = path.resolve(tmpDir, `${epubDirName}_${Date.now()}`);
      if (await FileManager.dirExists(tmpPath)) {
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
        await FileManager.copyDir(location, tmpPath);
      } catch (err) {
        console.error(
          "prepareEpubDir Error: Could not copy dir to",
          tmpPath,
          err.message
        );
        return;
      }

      const workingPath = path.normalize(tmpPath);
      return workingPath;
    }
  }

  /**
   * Loads and unarchives an .epub file to a tmp working directory
   * When in browser client, BrowserFS will unzip the archive to the virtual path `${FileManager.virtualPath}/zip`
   *
   * @param {string} location - the url or path to an .epub file
   * @returns {string} - the path to the tmp location
   */
  static async prepareEpubArchive(location, fetchOptions = {}) {
    const isEpub = FileManager.isEpubArchive(location);

    if (!isEpub) {
      console.warn("File is not an epub", location);
      return;
    }

    if (FileManager.environment === "browser") {
      // if running in client, use BrowserFS to mount Zip as file system in memory
      console.log("Mounting epub archive with BrowserFS", location);
      const response = await fetch(location, fetchOptions);
      const zipData = await response.arrayBuffer();
      const Buffer = BrowserFS.BFSRequire("buffer").Buffer;
      const workingDir = path.parse(location).name;
      const result = await promisify(BrowserFS.configure)({
        fs: "MountableFileSystem",
        options: {
          [`${FileManager.virtualPath}/overlay/${workingDir}`]: {
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
      const workingPath = path.normalize(
        `${FileManager.virtualPath}/overlay/${workingDir}`
      );
      return workingPath;
    } else {
      // when running in Node, decompress epub to tmp directory.
      const tmpDir = os.tmpdir();
      const tmpPath = path.resolve(tmpDir, path.basename(location));
      const AdmZip = new AdmZip(location);
      AdmZip.extractAllTo(tmpPath, true);
      const workingPath = tmpPath;
      return workingPath;
    }
  }

  /**
   * Test if file is a .epub archive
   * @param {string} location - path to file
   * @returns {boolean}
   */
  static isEpubArchive(location) {
    const ext = path.extname(location);

    if (ext === ".epub") {
      return true;
    }

    return false;
  }

  /**
   * A wrapepr for the fs.stat method
   * @param {string} location
   * @returns {object} - stats object
   */
  static async getStats(location) {
    let stats;

    try {
      stats = await promisify(fs.stat)(location);
    } catch (err) {
      console.warn("Could not get stat", err);
      return;
    }
    return stats;
  }

  /**
   * Wrapper for stats isDirectory()
   * @param {string} location
   * @returns {boolean}
   */
  static async isDir(location) {
    const stats = await FileManager.getStats(location);
    if (stats) {
      return stats.isDirectory();
    }
    return false;
  }

  /**
   * Wrapper for stats isFile()
   * @param {string} location
   * @returns {boolean}
   */
  static async isFile(location) {
    const stats = await FileManager.getStats(location);
    if (stats) {
      return stats.isFile();
    }
    return false;
  }

  /**
   * Read a file and return the data
   * @param {string} location
   */
  static async readFile(location, encoding = undefined) {
    let data;
    try {
      data = await promisify(fs.readFile)(location, encoding);
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
  static async readXmlFile(location) {
    const data = await FileManager.readFile(location);
    let result;
    if (data) {
      try {
        result = await promisify(xml2js.parseString)(data, {
          attrkey: "attr",
          charkey: "val",
          trim: true,
        });
      } catch (err) {
        console.warn("Error parsing xml file:", location, err);
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
  static async findAllFiles(directoryName, _results = []) {
    let files;
    if (directoryName === "..") {
      return;
    }

    try {
      files = await FileManager.readDir(directoryName);
    } catch (err) {
      console.error("Error reading directory", directoryName, err);
      return _results;
    }

    for (let file of files) {
      const fullPath = path.join(directoryName, file);
      if (file !== "." && (await FileManager.isDir(fullPath))) {
        const subdir = await FileManager.findAllFiles(fullPath, _results);
        // console.log("subdir", subdir);
      } else {
        _results.push(fullPath);
      }
    }
    return _results;
  }

  // static async findAllFiles(directoryName) {
  //   let files = [];
  //   let allFiles = [];
  //   try {
  //     files = await FileManager.readDir(directoryName);
  //   } catch (err) {
  //     console.error("Error reading directory", directoryName, err);
  //     return;
  //   }

  //   for (let file of files) {
  //     const fullPath = path.join(directoryName, file);
  //     if (await FileManager.isDir(fullPath)) {
  //       allFiles = allFiles.concat(await FileManager.findAllFiles(fullPath));
  //       return;
  //     } else {
  //       allFiles = allFiles.concat(fullPath);
  //     }
  //   }
  //   return allFiles;
  // }

  /**
   * Get the contents of a directory
   * @param {string} directory
   * @returns {array}
   */
  static async readDir(directory) {
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
  static async findFilesWithExt(directoryName, findExt, _results = []) {
    let files = await promisify(fs.readdir)(directoryName, {
      withFileTypes: true,
    });

    const ext = findExt.substr(0, 1) === "." ? findExt : `.${findExt}`;

    for (let f of files) {
      let fullPath = path.join(directoryName, f.name);
      if (f.isDirectory()) {
        await FileManager.findFilesWithExt(fullPath, findExt, _results);
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
  static async fileExists(path) {
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
  static async dirExists(path) {
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
   * Recursive directory copy
   * @param {string} src - path to the directory to copy
   * @param {string} dest - path to the copy destination
   */
  static async copyDir(src, dest) {
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
        await FileManager.copyDir(srcPath, destPath);
      } else {
        await promisify(fs.copyFile)(srcPath, destPath);
      }
    }
  }

  /**
   * A wrapper for os.tmpdir that resolves symlinks
   * see: https://github.com/nodejs/node/issues/11422
   */
  static async getTmpDir() {
    if (FileManager.environment === "node") {
      try {
        const tmpDir = await promisify(fs.realpath)(os.tmpdir);
        return tmpDir;
      } catch (err) {
        console.error("Error in getTmpDir", err.message);
        throw err;
      }
    } else {
      return "/tmp";
    }
  }

  static resolveIriToEpubLocation(iri, referencePath) {
    if (iri.indexOf("http") === 0) {
      return iri;
    } else {
      return path.join(path.dirname(referencePath), iri);
    }
  }

  static absolutePathToEpubLocation(epubPath, resourcePath) {
    return path.relative(epubPath, resourcePath);
  }

  static epubLocationToAbsolutePath(epubPath, resourcePath) {
    return path.join(path.dirname, epubPath, resourcePath);
  }
}

export default FileManager;

"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _fs = _interopRequireDefault(require("fs"));
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var _fileSaver = _interopRequireDefault(require("file-saver"));

var _es6Promisify = require("es6-promisify");
var _xml2js = _interopRequireDefault(require("xml2js"));
var _jszip = _interopRequireDefault(require("jszip"));

var _packageManager = _interopRequireDefault(require("./package-manager"));
var _opfToBrowserFsIndex = require("./utils/opf-to-browser-fs-index");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} //"../node_modules/file-saver/src/FileSaver.js";
// NOTE: we cannot use the native fs promises because BrowserFS does not support them yet.
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
  static get environment() {var _process, _process$env;
    // for testing in jest we sometimes need to force the env node_env
    if ((_process = process) !== null && _process !== void 0 && (_process$env = _process.env) !== null && _process$env !== void 0 && _process$env.MOCK_ENV) {
      return process.env.MOCK_ENV;
    }
    return typeof window === "undefined" ? "node" : "browser";
  }

  static async loadEpub(location, fetchOptions = {}) {
    if (FileManager.isEpubArchive(location)) {
      const workingPath = await FileManager.prepareEpubArchive(
      location,
      fetchOptions);

      return workingPath;
    } else {
      const workingPath = await FileManager.prepareEpubDir(
      location,
      fetchOptions);

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
    const pathInfo = _path.default.parse(saveLocation);
    const epubName = pathInfo.name;

    const zip = new _jszip.default();
    const filePaths = await FileManager.findAllFiles(sourceLocation);

    // mimetime must be first file in the zip;
    const mimeTypeContent = await FileManager.readFile(
    _path.default.resolve(sourceLocation, "mimetype"));

    zip.file("mimetype", mimeTypeContent);

    // to run in parallel see: https://stackoverflow.com/a/50874507/7943589
    for (const filePath of filePaths) {
      const contents = await FileManager.readFile(filePath);
      // convert the absolute path to the internal epub path
      let relativePath = filePath.substring(
      `${_path.default.normalize(sourceLocation)}`.length);

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
          level: compress ?
          8 :
          0 /* only levels 0 or 8 are allowed in epub spec */ } });


    } catch (err) {
      console.log("Error at zip.generateAsync ", err);
    }

    if (zipContent) {
      // TODO- FileSaver is currently bugged in chrome:
      // see: https://github.com/eligrey/FileSaver.js/issues/624
      if (FileManager.environment === "browser") {
        try {
          const result = _fileSaver.default.saveAs(zipContent, pathInfo.base);
        } catch (err) {
          console.error("Error saving epub", err);
          return;
        }
      } else {
        try {
          await (0, _es6Promisify.promisify)(_fs.default.writeFile)(saveLocation, zipContent);
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
      const prefixUrl = _path.default.resolve(location);
      const containerLocation = "./META-INF/container.xml";
      const containerUrl = _path.default.resolve(location, containerLocation);
      const response = await fetch(containerUrl, fetchOptions);

      if (!response.ok) {
        console.error("Error fetching container.xml");
        return;
      }
      const containerData = await response.text();
      console.log("containerData", containerData);
      let manifestPath;
      try {var _result$container, _result$container$roo;
        // const parser = new xml2js.Parser();
        const result = await (0, _es6Promisify.promisify)(_xml2js.default.parseString)(containerData);

        manifestPath =
        result === null || result === void 0 ? void 0 : (_result$container = result.container) === null || _result$container === void 0 ? void 0 : (_result$container$roo = _result$container.rootfiles[0].rootfile[0]) === null || _result$container$roo === void 0 ? void 0 : _result$container$roo.$["full-path"];
        if (!manifestPath) {
          console.error("Could not find path to opf file.");
          return;
        }
      } catch (err) {
        console.error("Error parsing container.xml file:", err);
        return;
      }

      const opfLocation = _path.default.resolve(location, manifestPath);
      const opfFetchResponse = await fetch(opfLocation, fetchOptions);
      const opfData = await opfFetchResponse.text();
      const packageManager = new _packageManager.default(manifestPath);
      await packageManager.loadXml(opfData);
      const manifestItems = packageManager.manifest.items;

      const fsManifestPath = _path.default.join(location, manifestPath);
      const fileIndex = (0, _opfToBrowserFsIndex.opfManifestToBrowserFsIndex)(
      manifestItems,
      manifestPath);

      console.log("Mounting epub directory with BrowserFS", location);
      console.log("file index", JSON.parse(JSON.stringify(fileIndex)));

      try {
        const result = await (0, _es6Promisify.promisify)(BrowserFS.configure)({
          fs: "MountableFileSystem",
          options: {
            [FileManager.virtualPath + "/overlay"]: {
              fs: "OverlayFS",
              options: {
                readable: {
                  fs: "HTTPRequest",
                  options: {
                    baseUrl: prefixUrl,
                    index: fileIndex /* a json directory structure */ } },


                writable: {
                  fs: "LocalStorage" } } },



            "/tmp": { fs: "InMemory" } } });


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
      const workingPath = _path.default.normalize(`${FileManager.virtualPath}/overlay/`);
      return workingPath;
    } else {
      // when running in Node, copy the epub dir to tmp directory.
      let tmpDir;
      try {
        tmpDir = await FileManager.getTmpDir();
      } catch (err) {
        throw err;
      }

      const epubDirName = location.split(_path.default.sep).pop();

      const tmpPath = _path.default.resolve(tmpDir, `${epubDirName}_${Date.now()}`);
      if (await FileManager.dirExists(tmpPath)) {
        try {
          await (0, _es6Promisify.promisify)(_fs.default.rmdir)(tmpPath, {
            recursive: true,
            maxRetries: 3 });

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
        err.message);

        return;
      }

      const workingPath = _path.default.normalize(tmpPath);
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
      const workingDir = _path.default.parse(location).name;
      const result = await (0, _es6Promisify.promisify)(BrowserFS.configure)({
        fs: "MountableFileSystem",
        options: {
          [`${FileManager.virtualPath}/overlay/${workingDir}`]: {
            fs: "OverlayFS",
            options: {
              readable: {
                fs: "ZipFS",
                options: {
                  // Wrap as Buffer object.
                  zipData: Buffer.from(zipData) } },


              writable: {
                fs: "LocalStorage" } } },



          "/tmp": { fs: "InMemory" } } });



      if (result) {
        // An error occurred.
        console.warn("Error at BrowserFS.configure", result.message);
        throw result;
      }
      _fs.default.readdir("./epubkit/overlay", (err, files) => {
        console.log("files", files);
      });
      // return the virtual path to the epub root
      const workingPath = _path.default.normalize(
      `${FileManager.virtualPath}/overlay/${workingDir}`);

      return workingPath;
    } else {
      // when running in Node, decompress epub to tmp directory.
      const tmpDir = _os.default.tmpdir();
      const tmpPath = _path.default.resolve(tmpDir, _path.default.basename(location));
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
    const ext = _path.default.extname(location);

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
      stats = await (0, _es6Promisify.promisify)(_fs.default.stat)(location);
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
   * Read entire file and return the data
   * if no encoding is set, a raw buffer is returned.
   * Use 'utf8' for string
   * @param {string} location
   */
  static async readFile(location, encoding = undefined) {
    let data;
    try {
      data = await (0, _es6Promisify.promisify)(_fs.default.readFile)(location, encoding);
    } catch (err) {
      console.warn("Could not readFile", location, err);
      return;
    }
    return data;
  }

  // static async read(location, buffer = undefined) {
  //   const dataBuffer = buffer ? buffer : new Buffer();
  //   try {
  //     await promisify(fs.read)(location, dataBuffer);
  //   }
  // }

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
        result = await (0, _es6Promisify.promisify)(_xml2js.default.parseString)(data, {
          attrkey: "attr",
          charkey: "val",
          trim: true });

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
      const fullPath = _path.default.join(directoryName, file);
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
      _fs.default.readdir(directory, (err, content) => {
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
    let files = await (0, _es6Promisify.promisify)(_fs.default.readdir)(directoryName, {
      withFileTypes: true });


    const ext = findExt.substr(0, 1) === "." ? findExt : `.${findExt}`;

    for (let f of files) {
      let fullPath = _path.default.join(directoryName, f.name);
      if (f.isDirectory()) {
        await FileManager.findFilesWithExt(fullPath, findExt, _results);
      } else {
        if (_path.default.extname(fullPath) === ext) {
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
      const stats = await (0, _es6Promisify.promisify)(_fs.default.stat)(path);
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
      const stats = await (0, _es6Promisify.promisify)(_fs.default.stat)(path);
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
    const entries = await (0, _es6Promisify.promisify)(_fs.default.readdir)(src, { withFileTypes: true });
    try {
      await (0, _es6Promisify.promisify)(_fs.default.mkdir)(dest);
    } catch (err) {
      console.error("copyDir Error: Could not mkdir", dest, err.message);
      throw err;
    }

    for (let entry of entries) {
      const srcPath = _path.default.join(src, entry.name);
      const destPath = _path.default.join(dest, entry.name);
      if (entry.isDirectory()) {
        await FileManager.copyDir(srcPath, destPath);
      } else {
        await (0, _es6Promisify.promisify)(_fs.default.copyFile)(srcPath, destPath);
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
        const tmpDir = await (0, _es6Promisify.promisify)(_fs.default.realpath)(_os.default.tmpdir);
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
      return _path.default.join(_path.default.dirname(referencePath), iri);
    }
  }

  static absolutePathToEpubLocation(epubPath, resourcePath) {
    return _path.default.relative(epubPath, resourcePath);
  }

  static epubLocationToAbsolutePath(epubPath, resourcePath) {
    return _path.default.join(_path.default.dirname, epubPath, resourcePath);
  }}var _default =


FileManager;exports.default = _default;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiRmlsZU1hbmFnZXIiLCJ2aXJ0dWFsUGF0aCIsImVudmlyb25tZW50IiwicHJvY2VzcyIsImVudiIsIk1PQ0tfRU5WIiwid2luZG93IiwibG9hZEVwdWIiLCJsb2NhdGlvbiIsImZldGNoT3B0aW9ucyIsImlzRXB1YkFyY2hpdmUiLCJ3b3JraW5nUGF0aCIsInByZXBhcmVFcHViQXJjaGl2ZSIsInByZXBhcmVFcHViRGlyIiwic2F2ZUVwdWJBcmNoaXZlIiwic291cmNlTG9jYXRpb24iLCJzYXZlTG9jYXRpb24iLCJjb21wcmVzcyIsInBhdGhJbmZvIiwicGF0aCIsInBhcnNlIiwiZXB1Yk5hbWUiLCJuYW1lIiwiemlwIiwiSlNaaXAiLCJmaWxlUGF0aHMiLCJmaW5kQWxsRmlsZXMiLCJtaW1lVHlwZUNvbnRlbnQiLCJyZWFkRmlsZSIsInJlc29sdmUiLCJmaWxlIiwiZmlsZVBhdGgiLCJjb250ZW50cyIsInJlbGF0aXZlUGF0aCIsInN1YnN0cmluZyIsIm5vcm1hbGl6ZSIsImxlbmd0aCIsImNvbnNvbGUiLCJlcnJvciIsInppcENvbnRlbnQiLCJnZW5lcmF0ZUFzeW5jIiwidHlwZSIsImNvbXByZXNzaW9uIiwiY29tcHJlc3Npb25PcHRpb25zIiwibGV2ZWwiLCJlcnIiLCJsb2ciLCJyZXN1bHQiLCJGaWxlU2F2ZXIiLCJzYXZlQXMiLCJiYXNlIiwiZnMiLCJ3cml0ZUZpbGUiLCJwcmVmaXhVcmwiLCJjb250YWluZXJMb2NhdGlvbiIsImNvbnRhaW5lclVybCIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImNvbnRhaW5lckRhdGEiLCJ0ZXh0IiwibWFuaWZlc3RQYXRoIiwieG1sMmpzIiwicGFyc2VTdHJpbmciLCJjb250YWluZXIiLCJyb290ZmlsZXMiLCJyb290ZmlsZSIsIiQiLCJvcGZMb2NhdGlvbiIsIm9wZkZldGNoUmVzcG9uc2UiLCJvcGZEYXRhIiwicGFja2FnZU1hbmFnZXIiLCJQYWNrYWdlTWFuYWdlciIsImxvYWRYbWwiLCJtYW5pZmVzdEl0ZW1zIiwibWFuaWZlc3QiLCJpdGVtcyIsImZzTWFuaWZlc3RQYXRoIiwiam9pbiIsImZpbGVJbmRleCIsIkpTT04iLCJzdHJpbmdpZnkiLCJCcm93c2VyRlMiLCJjb25maWd1cmUiLCJvcHRpb25zIiwicmVhZGFibGUiLCJiYXNlVXJsIiwiaW5kZXgiLCJ3cml0YWJsZSIsIm1lc3NhZ2UiLCJ0bXBEaXIiLCJnZXRUbXBEaXIiLCJlcHViRGlyTmFtZSIsInNwbGl0Iiwic2VwIiwicG9wIiwidG1wUGF0aCIsIkRhdGUiLCJub3ciLCJkaXJFeGlzdHMiLCJybWRpciIsInJlY3Vyc2l2ZSIsIm1heFJldHJpZXMiLCJjb3B5RGlyIiwiaXNFcHViIiwid2FybiIsInppcERhdGEiLCJhcnJheUJ1ZmZlciIsIkJ1ZmZlciIsIkJGU1JlcXVpcmUiLCJ3b3JraW5nRGlyIiwiZnJvbSIsInJlYWRkaXIiLCJmaWxlcyIsIm9zIiwidG1wZGlyIiwiYmFzZW5hbWUiLCJBZG1aaXAiLCJleHRyYWN0QWxsVG8iLCJleHQiLCJleHRuYW1lIiwiZ2V0U3RhdHMiLCJzdGF0cyIsInN0YXQiLCJpc0RpciIsImlzRGlyZWN0b3J5IiwiaXNGaWxlIiwiZW5jb2RpbmciLCJ1bmRlZmluZWQiLCJkYXRhIiwicmVhZFhtbEZpbGUiLCJhdHRya2V5IiwiY2hhcmtleSIsInRyaW0iLCJkaXJlY3RvcnlOYW1lIiwiX3Jlc3VsdHMiLCJyZWFkRGlyIiwiZnVsbFBhdGgiLCJzdWJkaXIiLCJwdXNoIiwiZGlyZWN0b3J5IiwiUHJvbWlzZSIsInJlamVjdCIsImNvbnRlbnQiLCJmaW5kRmlsZXNXaXRoRXh0IiwiZmluZEV4dCIsIndpdGhGaWxlVHlwZXMiLCJzdWJzdHIiLCJmIiwiZmlsZUV4aXN0cyIsInNyYyIsImRlc3QiLCJlbnRyaWVzIiwibWtkaXIiLCJlbnRyeSIsInNyY1BhdGgiLCJkZXN0UGF0aCIsImNvcHlGaWxlIiwicmVhbHBhdGgiLCJyZXNvbHZlSXJpVG9FcHViTG9jYXRpb24iLCJpcmkiLCJyZWZlcmVuY2VQYXRoIiwiaW5kZXhPZiIsImRpcm5hbWUiLCJhYnNvbHV0ZVBhdGhUb0VwdWJMb2NhdGlvbiIsImVwdWJQYXRoIiwicmVzb3VyY2VQYXRoIiwicmVsYXRpdmUiLCJlcHViTG9jYXRpb25Ub0Fic29sdXRlUGF0aCJdLCJtYXBwaW5ncyI6Im9HQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNFLDhGQVBvQztBQUNwQztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxXQUFOLENBQWtCO0FBQ00sYUFBWEMsV0FBVyxHQUFHO0FBQ3ZCLFdBQU8sVUFBUDtBQUNEO0FBQ0Q7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUN3QixhQUFYQyxXQUFXLEdBQUc7QUFDdkI7QUFDQSxvQkFBSUMsT0FBSixxREFBSSxTQUFTQyxHQUFiLHlDQUFJLGFBQWNDLFFBQWxCLEVBQTRCO0FBQzFCLGFBQU9GLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFuQjtBQUNEO0FBQ0QsV0FBTyxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDLE1BQWhDLEdBQXlDLFNBQWhEO0FBQ0Q7O0FBRW9CLGVBQVJDLFFBQVEsQ0FBQ0MsUUFBRCxFQUFXQyxZQUFZLEdBQUcsRUFBMUIsRUFBOEI7QUFDakQsUUFBSVQsV0FBVyxDQUFDVSxhQUFaLENBQTBCRixRQUExQixDQUFKLEVBQXlDO0FBQ3ZDLFlBQU1HLFdBQVcsR0FBRyxNQUFNWCxXQUFXLENBQUNZLGtCQUFaO0FBQ3hCSixNQUFBQSxRQUR3QjtBQUV4QkMsTUFBQUEsWUFGd0IsQ0FBMUI7O0FBSUEsYUFBT0UsV0FBUDtBQUNELEtBTkQsTUFNTztBQUNMLFlBQU1BLFdBQVcsR0FBRyxNQUFNWCxXQUFXLENBQUNhLGNBQVo7QUFDeEJMLE1BQUFBLFFBRHdCO0FBRXhCQyxNQUFBQSxZQUZ3QixDQUExQjs7QUFJQSxh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O0FBRWdDLFNBQTFCSSwwQkFBMEIsQ0FBQ0MsUUFBRCxFQUFXQyxZQUFYLEVBQXlCO0FBQ3hELFdBQU9uSixjQUFLb0osUUFBTCxDQUFjRixRQUFkLEVBQXdCQyxZQUF4QixDQUFQO0FBQ0Q7O0FBRWdDLFNBQTFCRSwwQkFBMEIsQ0FBQ0gsUUFBRCxFQUFXQyxZQUFYLEVBQXlCO0FBQ3hELFdBQU9uSixjQUFLMkQsSUFBTCxDQUFVM0QsY0FBS2dKLE9BQWYsRUFBd0JFLFFBQXhCLEVBQWtDQyxZQUFsQyxDQUFQO0FBQ0QsR0F0bUJlLEM7OztBQXltQkh0SyxXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IG9zIGZyb20gXCJvc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBGaWxlU2F2ZXIgZnJvbSBcImZpbGUtc2F2ZXJcIjsgLy9cIi4uL25vZGVfbW9kdWxlcy9maWxlLXNhdmVyL3NyYy9GaWxlU2F2ZXIuanNcIjtcbi8vIE5PVEU6IHdlIGNhbm5vdCB1c2UgdGhlIG5hdGl2ZSBmcyBwcm9taXNlcyBiZWNhdXNlIEJyb3dzZXJGUyBkb2VzIG5vdCBzdXBwb3J0IHRoZW0geWV0LlxuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcImVzNi1wcm9taXNpZnlcIjtcbmltcG9ydCB4bWwyanMgZnJvbSBcInhtbDJqc1wiO1xuaW1wb3J0IEpTWmlwIGZyb20gXCJqc3ppcFwiO1xuXG5pbXBvcnQgUGFja2FnZU1hbmFnZXIgZnJvbSBcIi4vcGFja2FnZS1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBvcGZNYW5pZmVzdFRvQnJvd3NlckZzSW5kZXggfSBmcm9tIFwiLi91dGlscy9vcGYtdG8tYnJvd3Nlci1mcy1pbmRleFwiO1xuXG4vKipcbiAqIE1vc3Qgb2YgdGhlIG5hc3R5IGRldGFpbHMgaW4gbWFuYWdpbmcgdGhlIGRpZmZlcmVudCBlbnZpcm9ubWVudHMgaXNcbiAqIGNvbnRhaW5lZCBpbiBoZXJlLlxuICogVGhpcyBjbGFzcyB3cmFwcyBhIGxvdCBvZiB0aGUgbm9kZSBmcyBmaWxlIHN5c3RlbSBsaWJyYXJ5IG1ldGhvZHMuXG4gKiBGb3IgYnJvd3NlciBjbGllbnRzLCB0aGUgQnJvc3dlckZTIG1vZHVsZSBpcyB1c2VkIHRvIGVtdWxhdGUgTm9kZSBGUyBhbmRcbiAqIEZpbGVTYXZlciBpcyB1c2VkIHRvIGVuYWJsZSBjbGllbnQncyB0byBkb3dubG9hZCBkb2N1bWVudHMgZm9yIHNhdmluZy5cbiAqIEJyb3dzZXJGUyBkb2VzIG5vdCBwb2xseWZpbGwgdGhlIGZzIG5hdGl2ZSBwcm9taXNlcywgc28gbWFueSBmcyBtZXRob2RzXG4gKiBhcmUgd3JhcHBlZCB3aXRoIHByb21pc2lmeSBiZWxvdy5cbiAqXG4gKiBzZWUgYWxzbzpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qdmlsay9Ccm93c2VyRlNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9icm93c2VyaWZ5L3BhdGgtYnJvd3NlcmlmeVxuICpcbiAqL1xuY2xhc3MgRmlsZU1hbmFnZXIge1xuICBzdGF0aWMgZ2V0IHZpcnR1YWxQYXRoKCkge1xuICAgIHJldHVybiBcIi9lcHVia2l0XCI7XG4gIH1cbiAgLyoqXG4gICAqIFB1YmxpYyBjbGFzcyBwcm9wZXJ0eSBlbnZpcm9ubWVudC5cbiAgICogZW52aXJvbm1lbnQgaW5kaWNhdGVzIGlmIHdlIGFyZSBydW5uaW5nIGluIGEgYnJvd3NlciBvciBub3QuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gb25lIG9mIFwiYnJvd3NlclwiIG9yIFwibm9kZVwiXG4gICAqL1xuICBzdGF0aWMgZ2V0IGVudmlyb25tZW50KCkge1xuICAgIC8vIGZvciB0ZXN0aW5nIGluIGplc3Qgd2Ugc29tZXRpbWVzIG5lZWQgdG8gZm9yY2UgdGhlIGVudiBub2RlX2VudlxuICAgIGlmIChwcm9jZXNzPy5lbnY/Lk1PQ0tfRU5WKSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5lbnYuTU9DS19FTlY7XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gXCJub2RlXCIgOiBcImJyb3dzZXJcIjtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBsb2FkRXB1Yihsb2NhdGlvbiwgZmV0Y2hPcHRpb25zID0ge30pIHtcbiAgICBpZiAoRmlsZU1hbmFnZXIuaXNFcHViQXJjaGl2ZShsb2NhdGlvbikpIHtcbiAgICAgIGNvbnN0IHdvcmtpbmdQYXRoID0gYXdhaXQgRmlsZU1hbmFnZXIucHJlcGFyZUVwdWJBcmNoaXZlKFxuICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgZmV0Y2hPcHRpb25zXG4gICAgICApO1xuICAgICAgcmV0dXJuIHdvcmtpbmdQYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB3b3JraW5nUGF0aCA9IGF3YWl0IEZpbGVNYW5hZ2VyLnByZXBhcmVFcHViRGlyKFxuICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgZmV0Y2hPcHRpb25zXG4gICAgICApO1xuICAgICAgcmV0dXJuIHdvcmtpbmdQYXRoO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyB0aGUgZXB1YiBhcmNoaXZlIHRvIHRoZSBnaXZlbiBsb2NhdGlvbi4gSW4gdGhlIGJyb3dzZXIsXG4gICAqIHRoZSB1c2VyIHdpbGwgYmUgcHJvbXB0ZWQgdG8gc2V0IHRoZSBmaWxlIGRvd25sb2FkIGxvY2F0aW9uLlxuICAgKiBUaGlzIG1ldGhvZCByZWxpZXMgb24gSlNaaXAgZm9yIHppcGluZyB0aGUgYXJjaGl2ZSBpbiBib3RoIGNsaWVudCBhbmQgbm9kZVxuICAgKiBUT0RPOiBpZiB0ZXN0aW5nIHNob3dzIHRoYXQgSlNaaXAgaXMgbm90IGJlc3QgZm9yIG5vZGUsIGNvbnNpZGVyIHVzaW5nXG4gICAqIGFyY2hpdmVyOiBodHRwczovL2dpdGh1Yi5jb20vYXJjaGl2ZXJqcy9ub2RlLWFyY2hpdmVyXG4gICAqIGVwdWIgemlwIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzL2VwdWItb2NmLmh0bWwjc2VjLXppcC1jb250YWluZXItemlwcmVxc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gLSBkZXN0aW5hdGlvbiBwYXRoIHRvIHNhdmUgZXB1YiB0b1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbXByZXNzIC0gZmxhZyB0byBlbmFibGUgYXJjaGl2ZSBjb21wcmVzc2lvblxuICAgKi9cbiAgc3RhdGljIGFzeW5jIHNhdmVFcHViQXJjaGl2ZShzb3VyY2VMb2NhdGlvbiwgc2F2ZUxvY2F0aW9uLCBjb21wcmVzcyA9IGZhbHNlKSB7XG4gICAgY29uc3QgcGF0aEluZm8gPSBwYXRoLnBhcnNlKHNhdmVMb2NhdGlvbik7XG4gICAgY29uc3QgZXB1Yk5hbWUgPSBwYXRoSW5mby5uYW1lO1xuXG4gICAgY29uc3QgemlwID0gbmV3IEpTWmlwKCk7XG4gICAgY29uc3QgZmlsZVBhdGhzID0gYXdhaXQgRmlsZU1hbmFnZXIuZmluZEFsbEZpbGVzKHNvdXJjZUxvY2F0aW9uKTtcblxuICAgIC8vIG1pbWV0aW1lIG11c3QgYmUgZmlyc3QgZmlsZSBpbiB0aGUgemlwO1xuICAgIGNvbnN0IG1pbWVUeXBlQ29udGVudCA9IGF3YWl0IEZpbGVNYW5hZ2VyLnJlYWRGaWxlKFxuICAgICAgcGF0aC5yZXNvbHZlKHNvdXJjZUxvY2F0aW9uLCBcIm1pbWV0eXBlXCIpXG4gICAgKTtcbiAgICB6aXAuZmlsZShcIm1pbWV0eXBlXCIsIG1pbWVUeXBlQ29udGVudCk7XG5cbiAgICAvLyB0byBydW4gaW4gcGFyYWxsZWwgc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTA4NzQ1MDcvNzk0MzU4OVxuICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgZmlsZVBhdGhzKSB7XG4gICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IEZpbGVNYW5hZ2VyLnJlYWRGaWxlKGZpbGVQYXRoKTtcbiAgICAgIC8vIGNvbnZlcnQgdGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGludGVybmFsIGVwdWIgcGF0aFxuICAgICAgbGV0IHJlbGF0aXZlUGF0aCA9IGZpbGVQYXRoLnN1YnN0cmluZyhcbiAgICAgICAgYCR7cGF0aC5ub3JtYWxpemUoc291cmNlTG9jYXRpb24pfWAubGVuZ3RoXG4gICAgICApO1xuICAgICAgaWYgKHJlbGF0aXZlUGF0aC5zdWJzdHJpbmcoMCwgMSkgPT09IFwiL1wiKSB7XG4gICAgICAgIHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlUGF0aC5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG4gICAgICBpZiAocmVsYXRpdmVQYXRoICE9PSBcIm1pbWV0eXBlXCIpIHtcbiAgICAgICAgaWYgKGNvbnRlbnRzKSB7XG4gICAgICAgICAgemlwLmZpbGUoYCR7cmVsYXRpdmVQYXRofWAsIGNvbnRlbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IHJlYWQgY29udGVudHMgb2YgZmlsZVwiLCBmaWxlUGF0aCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHppcENvbnRlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgemlwQ29udGVudCA9IGF3YWl0IHppcC5nZW5lcmF0ZUFzeW5jKHtcbiAgICAgICAgdHlwZTogRmlsZU1hbmFnZXIuZW52aXJvbm1lbnQgPT09IFwiYnJvd3NlclwiID8gXCJibG9iXCIgOiBcIm5vZGVidWZmZXJcIixcbiAgICAgICAgY29tcHJlc3Npb246IGNvbXByZXNzID8gXCJERUZMQVRFXCIgOiBcIlNUT1JFXCIsXG4gICAgICAgIGNvbXByZXNzaW9uT3B0aW9uczoge1xuICAgICAgICAgIGxldmVsOiBjb21wcmVzc1xuICAgICAgICAgICAgPyA4XG4gICAgICAgICAgICA6IDAgLyogb25seSBsZXZlbHMgMCBvciA4IGFyZSBhbGxvd2VkIGluIGVwdWIgc3BlYyAqLyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coXCJFcnJvciBhdCB6aXAuZ2VuZXJhdGVBc3luYyBcIiwgZXJyKTtcbiAgICB9XG5cbiAgICBpZiAoemlwQ29udGVudCkge1xuICAgICAgLy8gVE9ETy0gRmlsZVNhdmVyIGlzIGN1cnJlbnRseSBidWdnZWQgaW4gY2hyb21lOlxuICAgICAgLy8gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9GaWxlU2F2ZXIuanMvaXNzdWVzLzYyNFxuICAgICAgaWYgKEZpbGVNYW5hZ2VyLmVudmlyb25tZW50ID09PSBcImJyb3dzZXJcIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEZpbGVTYXZlci5zYXZlQXMoemlwQ29udGVudCwgcGF0aEluZm8uYmFzZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzYXZpbmcgZXB1YlwiLCBlcnIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBwcm9taXNpZnkoZnMud3JpdGVGaWxlKShzYXZlTG9jYXRpb24sIHppcENvbnRlbnQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHdyaXRpbmcgemlwIGZpbGU6XCIsIGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBnZW5lcmF0aW5nIHppcCBmaWxlLlwiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBsb2FkaW5nIGFuIEVwdWIgZGlyZWN0b3J5IGluIGEgYnJvd3NlciBjbGllbnQsIHRoZSBmaWxlc1xuICAgKiBhcmUgZmV0Y2hlZCBsYXppbHkgYnkgQnJvd3NlckZTIGFuZCBzYXZlZCB0byBsb2NhbFN0b3JhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc3RhdGljIGFzeW5jIHByZXBhcmVFcHViRGlyKGxvY2F0aW9uLCBmZXRjaE9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChGaWxlTWFuYWdlci5lbnZpcm9ubWVudCA9PT0gXCJicm93c2VyXCIpIHtcbiAgICAgIC8qXG4gICAgICBGb3IgdGhlIGJyb3dzZXIgd2UgbmVlZCB0byBidWlsZCBhIGZpbGUgaW5kZXggZm9yIEJyb3dzZXJGUyBcbiAgICAgIFRoYXQgaW5kZXggaXMgZGVyaXZlZCBmcm9tIHRoZSBPUEYgZmlsZSBzbyB3ZSBtdXN0IGZpbmQgdGhlIG9wZlxuICAgICAgcGF0aCBnaXZlbiBpbiB0aGUgY29udGFpbmVyLnhtbCBmaWxlLiBcbiAgICAgIFRoZXJlIGlzIGEgY2hpY2tlbiBhbmQgZWdnIHByb2JsZW0gaW4gdGhhdCBCcm93c2VyRlMgY2FuIG5vdCBiZSBcbiAgICAgIGluaXRpYWxpemVkIHdpdGhvdXQgdGhlIGZpbGUgaW5kZXgsIHNvIHdlIG11c3QgcHJlbG9hZCB0aGUgY29udGFpbmVyLnhtbFxuICAgICAgYW5kIE9QRiBmaWxlIGZpcnN0LiBcbiAgICAgICovXG4gICAgICBjb25zdCBwcmVmaXhVcmwgPSBwYXRoLnJlc29sdmUobG9jYXRpb24pO1xuICAgICAgY29uc3QgY29udGFpbmVyTG9jYXRpb24gPSBcIi4vTUVUQS1JTkYvY29udGFpbmVyLnhtbFwiO1xuICAgICAgY29uc3QgY29udGFpbmVyVXJsID0gcGF0aC5yZXNvbHZlKGxvY2F0aW9uLCBjb250YWluZXJMb2NhdGlvbik7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGNvbnRhaW5lclVybCwgZmV0Y2hPcHRpb25zKTtcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgY29udGFpbmVyLnhtbFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgY29udGFpbmVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiY29udGFpbmVyRGF0YVwiLCBjb250YWluZXJEYXRhKTtcbiAgICAgIGxldCBtYW5pZmVzdFBhdGg7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBjb25zdCBwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcigpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9taXNpZnkoeG1sMmpzLnBhcnNlU3RyaW5nKShjb250YWluZXJEYXRhKTtcblxuICAgICAgICBtYW5pZmVzdFBhdGggPVxuICAgICAgICAgIHJlc3VsdD8uY29udGFpbmVyPy5yb290ZmlsZXNbMF0ucm9vdGZpbGVbMF0/LiRbXCJmdWxsLXBhdGhcIl07XG4gICAgICAgIGlmICghbWFuaWZlc3RQYXRoKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBmaW5kIHBhdGggdG8gb3BmIGZpbGUuXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXJzaW5nIGNvbnRhaW5lci54bWwgZmlsZTpcIiwgZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvcGZMb2NhdGlvbiA9IHBhdGgucmVzb2x2ZShsb2NhdGlvbiwgbWFuaWZlc3RQYXRoKTtcbiAgICAgIGNvbnN0IG9wZkZldGNoUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChvcGZMb2NhdGlvbiwgZmV0Y2hPcHRpb25zKTtcbiAgICAgIGNvbnN0IG9wZkRhdGEgPSBhd2FpdCBvcGZGZXRjaFJlc3BvbnNlLnRleHQoKTtcbiAgICAgIGNvbnN0IHBhY2thZ2VNYW5hZ2VyID0gbmV3IFBhY2thZ2VNYW5hZ2VyKG1hbmlmZXN0UGF0aCk7XG4gICAgICBhd2FpdCBwYWNrYWdlTWFuYWdlci5sb2FkWG1sKG9wZkRhdGEpO1xuICAgICAgY29uc3QgbWFuaWZlc3RJdGVtcyA9IHBhY2thZ2VNYW5hZ2VyLm1hbmlmZXN0Lml0ZW1zO1xuXG4gICAgICBjb25zdCBmc01hbmlmZXN0UGF0aCA9IHBhdGguam9pbihsb2NhdGlvbiwgbWFuaWZlc3RQYXRoKTtcbiAgICAgIGNvbnN0IGZpbGVJbmRleCA9IG9wZk1hbmlmZXN0VG9Ccm93c2VyRnNJbmRleChcbiAgICAgICAgbWFuaWZlc3RJdGVtcyxcbiAgICAgICAgbWFuaWZlc3RQYXRoXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXCJNb3VudGluZyBlcHViIGRpcmVjdG9yeSB3aXRoIEJyb3dzZXJGU1wiLCBsb2NhdGlvbik7XG4gICAgICBjb25zb2xlLmxvZyhcImZpbGUgaW5kZXhcIiwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShmaWxlSW5kZXgpKSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2lmeShCcm93c2VyRlMuY29uZmlndXJlKSh7XG4gICAgICAgICAgZnM6IFwiTW91bnRhYmxlRmlsZVN5c3RlbVwiLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIFtGaWxlTWFuYWdlci52aXJ0dWFsUGF0aCArIFwiL292ZXJsYXlcIl06IHtcbiAgICAgICAgICAgICAgZnM6IFwiT3ZlcmxheUZTXCIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICByZWFkYWJsZToge1xuICAgICAgICAgICAgICAgICAgZnM6IFwiSFRUUFJlcXVlc3RcIixcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVVybDogcHJlZml4VXJsLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogZmlsZUluZGV4IC8qIGEganNvbiBkaXJlY3Rvcnkgc3RydWN0dXJlICovLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB7XG4gICAgICAgICAgICAgICAgICBmczogXCJMb2NhbFN0b3JhZ2VcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiL3RtcFwiOiB7IGZzOiBcIkluTWVtb3J5XCIgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY29uZmlndXJpbmcgQnJvd3NlckZTOlwiLCBlcnIubWVzc2FnZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGZzLnJlYWRkaXIoXCIuL2VwdWJraXQvb3ZlcmxheS90ZXN0L2FsaWNlL01FVEEtSU5GXCIsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAvLyAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIjpcIiwgZmlsZSk7XG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfSk7XG5cbiAgICAgIC8vIHJldHVybiB0aGUgdmlydHVhbCBwYXRoIHRvIHRoZSBlcHViIHJvb3RcbiAgICAgIGNvbnN0IHdvcmtpbmdQYXRoID0gcGF0aC5ub3JtYWxpemUoYCR7RmlsZU1hbmFnZXIudmlydHVhbFBhdGh9L292ZXJsYXkvYCk7XG4gICAgICByZXR1cm4gd29ya2luZ1BhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHdoZW4gcnVubmluZyBpbiBOb2RlLCBjb3B5IHRoZSBlcHViIGRpciB0byB0bXAgZGlyZWN0b3J5LlxuICAgICAgbGV0IHRtcERpcjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRtcERpciA9IGF3YWl0IEZpbGVNYW5hZ2VyLmdldFRtcERpcigpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXB1YkRpck5hbWUgPSBsb2NhdGlvbi5zcGxpdChwYXRoLnNlcCkucG9wKCk7XG5cbiAgICAgIGNvbnN0IHRtcFBhdGggPSBwYXRoLnJlc29sdmUodG1wRGlyLCBgJHtlcHViRGlyTmFtZX1fJHtEYXRlLm5vdygpfWApO1xuICAgICAgaWYgKGF3YWl0IEZpbGVNYW5hZ2VyLmRpckV4aXN0cyh0bXBQYXRoKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHByb21pc2lmeShmcy5ybWRpcikodG1wUGF0aCwge1xuICAgICAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICAgICAgbWF4UmV0cmllczogMyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZCBub3QgcmVtb3ZlIGRpclwiLCB0bXBQYXRoLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgdGhyb3cgXCJDb3VsZCBub3QgcHJlcGFyZSBkaXJlY3RvcnkuIFRtcCBkaXJlY3RvciBhbHJlYWR5IGV4aXN0cyBhbmQgY291bGQgbm90IGJlIHJlbW92ZWQuXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IEZpbGVNYW5hZ2VyLmNvcHlEaXIobG9jYXRpb24sIHRtcFBhdGgpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJwcmVwYXJlRXB1YkRpciBFcnJvcjogQ291bGQgbm90IGNvcHkgZGlyIHRvXCIsXG4gICAgICAgICAgdG1wUGF0aCxcbiAgICAgICAgICBlcnIubWVzc2FnZVxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHdvcmtpbmdQYXRoID0gcGF0aC5ub3JtYWxpemUodG1wUGF0aCk7XG4gICAgICByZXR1cm4gd29ya2luZ1BhdGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGFuZCB1bmFyY2hpdmVzIGFuIC5lcHViIGZpbGUgdG8gYSB0bXAgd29ya2luZyBkaXJlY3RvcnlcbiAgICogV2hlbiBpbiBicm93c2VyIGNsaWVudCwgQnJvd3NlckZTIHdpbGwgdW56aXAgdGhlIGFyY2hpdmUgdG8gdGhlIHZpcnR1YWwgcGF0aCBgJHtGaWxlTWFuYWdlci52aXJ0dWFsUGF0aH0vemlwYFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gLSB0aGUgdXJsIG9yIHBhdGggdG8gYW4gLmVwdWIgZmlsZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHRoZSBwYXRoIHRvIHRoZSB0bXAgbG9jYXRpb25cbiAgICovXG4gIHN0YXRpYyBhc3luYyBwcmVwYXJlRXB1YkFyY2hpdmUobG9jYXRpb24sIGZldGNoT3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaXNFcHViID0gRmlsZU1hbmFnZXIuaXNFcHViQXJjaGl2ZShsb2NhdGlvbik7XG5cbiAgICBpZiAoIWlzRXB1Yikge1xuICAgICAgY29uc29sZS53YXJuKFwiRmlsZSBpcyBub3QgYW4gZXB1YlwiLCBsb2NhdGlvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKEZpbGVNYW5hZ2VyLmVudmlyb25tZW50ID09PSBcImJyb3dzZXJcIikge1xuICAgICAgLy8gaWYgcnVubmluZyBpbiBjbGllbnQsIHVzZSBCcm93c2VyRlMgdG8gbW91bnQgWmlwIGFzIGZpbGUgc3lzdGVtIGluIG1lbW9yeVxuICAgICAgY29uc29sZS5sb2coXCJNb3VudGluZyBlcHViIGFyY2hpdmUgd2l0aCBCcm93c2VyRlNcIiwgbG9jYXRpb24pO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChsb2NhdGlvbiwgZmV0Y2hPcHRpb25zKTtcbiAgICAgIGNvbnN0IHppcERhdGEgPSBhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgY29uc3QgQnVmZmVyID0gQnJvd3NlckZTLkJGU1JlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyO1xuICAgICAgY29uc3Qgd29ya2luZ0RpciA9IHBhdGgucGFyc2UobG9jYXRpb24pLm5hbWU7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9taXNpZnkoQnJvd3NlckZTLmNvbmZpZ3VyZSkoe1xuICAgICAgICBmczogXCJNb3VudGFibGVGaWxlU3lzdGVtXCIsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBbYCR7RmlsZU1hbmFnZXIudmlydHVhbFBhdGh9L292ZXJsYXkvJHt3b3JraW5nRGlyfWBdOiB7XG4gICAgICAgICAgICBmczogXCJPdmVybGF5RlNcIixcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgcmVhZGFibGU6IHtcbiAgICAgICAgICAgICAgICBmczogXCJaaXBGU1wiLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgIC8vIFdyYXAgYXMgQnVmZmVyIG9iamVjdC5cbiAgICAgICAgICAgICAgICAgIHppcERhdGE6IEJ1ZmZlci5mcm9tKHppcERhdGEpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHdyaXRhYmxlOiB7XG4gICAgICAgICAgICAgICAgZnM6IFwiTG9jYWxTdG9yYWdlXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCIvdG1wXCI6IHsgZnM6IFwiSW5NZW1vcnlcIiB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgLy8gQW4gZXJyb3Igb2NjdXJyZWQuXG4gICAgICAgIGNvbnNvbGUud2FybihcIkVycm9yIGF0IEJyb3dzZXJGUy5jb25maWd1cmVcIiwgcmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICB0aHJvdyByZXN1bHQ7XG4gICAgICB9XG4gICAgICBmcy5yZWFkZGlyKFwiLi9lcHVia2l0L292ZXJsYXlcIiwgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJmaWxlc1wiLCBmaWxlcyk7XG4gICAgICB9KTtcbiAgICAgIC8vIHJldHVybiB0aGUgdmlydHVhbCBwYXRoIHRvIHRoZSBlcHViIHJvb3RcbiAgICAgIGNvbnN0IHdvcmtpbmdQYXRoID0gcGF0aC5ub3JtYWxpemUoXG4gICAgICAgIGAke0ZpbGVNYW5hZ2VyLnZpcnR1YWxQYXRofS9vdmVybGF5LyR7d29ya2luZ0Rpcn1gXG4gICAgICApO1xuICAgICAgcmV0dXJuIHdvcmtpbmdQYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3aGVuIHJ1bm5pbmcgaW4gTm9kZSwgZGVjb21wcmVzcyBlcHViIHRvIHRtcCBkaXJlY3RvcnkuXG4gICAgICBjb25zdCB0bXBEaXIgPSBvcy50bXBkaXIoKTtcbiAgICAgIGNvbnN0IHRtcFBhdGggPSBwYXRoLnJlc29sdmUodG1wRGlyLCBwYXRoLmJhc2VuYW1lKGxvY2F0aW9uKSk7XG4gICAgICBjb25zdCBBZG1aaXAgPSBuZXcgQWRtWmlwKGxvY2F0aW9uKTtcbiAgICAgIEFkbVppcC5leHRyYWN0QWxsVG8odG1wUGF0aCwgdHJ1ZSk7XG4gICAgICBjb25zdCB3b3JraW5nUGF0aCA9IHRtcFBhdGg7XG4gICAgICByZXR1cm4gd29ya2luZ1BhdGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRlc3QgaWYgZmlsZSBpcyBhIC5lcHViIGFyY2hpdmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIC0gcGF0aCB0byBmaWxlXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzRXB1YkFyY2hpdmUobG9jYXRpb24pIHtcbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUobG9jYXRpb24pO1xuXG4gICAgaWYgKGV4dCA9PT0gXCIuZXB1YlwiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQSB3cmFwZXByIGZvciB0aGUgZnMuc3RhdCBtZXRob2RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gc3RhdHMgb2JqZWN0XG4gICAqL1xuICBzdGF0aWMgYXN5bmMgZ2V0U3RhdHMobG9jYXRpb24pIHtcbiAgICBsZXQgc3RhdHM7XG5cbiAgICB0cnkge1xuICAgICAgc3RhdHMgPSBhd2FpdCBwcm9taXNpZnkoZnMuc3RhdCkobG9jYXRpb24pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGdldCBzdGF0XCIsIGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciBzdGF0cyBpc0RpcmVjdG9yeSgpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBhc3luYyBpc0Rpcihsb2NhdGlvbikge1xuICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgRmlsZU1hbmFnZXIuZ2V0U3RhdHMobG9jYXRpb24pO1xuICAgIGlmIChzdGF0cykge1xuICAgICAgcmV0dXJuIHN0YXRzLmlzRGlyZWN0b3J5KCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciBzdGF0cyBpc0ZpbGUoKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgYXN5bmMgaXNGaWxlKGxvY2F0aW9uKSB7XG4gICAgY29uc3Qgc3RhdHMgPSBhd2FpdCBGaWxlTWFuYWdlci5nZXRTdGF0cyhsb2NhdGlvbik7XG4gICAgaWYgKHN0YXRzKSB7XG4gICAgICByZXR1cm4gc3RhdHMuaXNGaWxlKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIGVudGlyZSBmaWxlIGFuZCByZXR1cm4gdGhlIGRhdGFcbiAgICogaWYgbm8gZW5jb2RpbmcgaXMgc2V0LCBhIHJhdyBidWZmZXIgaXMgcmV0dXJuZWQuXG4gICAqIFVzZSAndXRmOCcgZm9yIHN0cmluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHN0YXRpYyBhc3luYyByZWFkRmlsZShsb2NhdGlvbiwgZW5jb2RpbmcgPSB1bmRlZmluZWQpIHtcbiAgICBsZXQgZGF0YTtcbiAgICB0cnkge1xuICAgICAgZGF0YSA9IGF3YWl0IHByb21pc2lmeShmcy5yZWFkRmlsZSkobG9jYXRpb24sIGVuY29kaW5nKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCByZWFkRmlsZVwiLCBsb2NhdGlvbiwgZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvLyBzdGF0aWMgYXN5bmMgcmVhZChsb2NhdGlvbiwgYnVmZmVyID0gdW5kZWZpbmVkKSB7XG4gIC8vICAgY29uc3QgZGF0YUJ1ZmZlciA9IGJ1ZmZlciA/IGJ1ZmZlciA6IG5ldyBCdWZmZXIoKTtcbiAgLy8gICB0cnkge1xuICAvLyAgICAgYXdhaXQgcHJvbWlzaWZ5KGZzLnJlYWQpKGxvY2F0aW9uLCBkYXRhQnVmZmVyKTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvKipcbiAgICogUmVhZCBhIFhNTCBmaWxlIGFuZCBwYXJzZSBpdCBpbnRvIGEganNvbiBvYmplY3QgdXNpbmcgeG1sMmpzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAtIGxvY2F0aW9uXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gYSBqc29uIG9iamVjdFxuICAgKi9cbiAgc3RhdGljIGFzeW5jIHJlYWRYbWxGaWxlKGxvY2F0aW9uKSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IEZpbGVNYW5hZ2VyLnJlYWRGaWxlKGxvY2F0aW9uKTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCBwcm9taXNpZnkoeG1sMmpzLnBhcnNlU3RyaW5nKShkYXRhLCB7XG4gICAgICAgICAgYXR0cmtleTogXCJhdHRyXCIsXG4gICAgICAgICAgY2hhcmtleTogXCJ2YWxcIixcbiAgICAgICAgICB0cmltOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJFcnJvciBwYXJzaW5nIHhtbCBmaWxlOlwiLCBsb2NhdGlvbiwgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBzZWFyY2hlcyBhIGRpcmVjdG9yeSBhbmQgcmV0dXJucyBhIGZsYXQgYXJyYXkgb2YgYWxsIGZpbGVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3RvcnlOYW1lIC0gdGhlIGJhc2UgZGlyZWN0b3J5IHRvIHNlYXJjaFxuICAgKiBAcGFyYW0ge2FycmF5fSBfcmVzdWx0cyAtIHByaXZhdGUuIGhvbGRzIF9yZXN1bHRzIGZvciByZWN1cnNpdmUgc2VhcmNoXG4gICAqIEByZXR1cm5zIHthcnJheX0gLSBhbiBhcnJheSBvZiBmaWxlIHBhdGggc3RyaW5nc1xuICAgKi9cbiAgc3RhdGljIGFzeW5jIGZpbmRBbGxGaWxlcyhkaXJlY3RvcnlOYW1lLCBfcmVzdWx0cyA9IFtdKSB7XG4gICAgbGV0IGZpbGVzO1xuICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSBcIi4uXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZmlsZXMgPSBhd2FpdCBGaWxlTWFuYWdlci5yZWFkRGlyKGRpcmVjdG9yeU5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJlYWRpbmcgZGlyZWN0b3J5XCIsIGRpcmVjdG9yeU5hbWUsIGVycik7XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyZWN0b3J5TmFtZSwgZmlsZSk7XG4gICAgICBpZiAoZmlsZSAhPT0gXCIuXCIgJiYgKGF3YWl0IEZpbGVNYW5hZ2VyLmlzRGlyKGZ1bGxQYXRoKSkpIHtcbiAgICAgICAgY29uc3Qgc3ViZGlyID0gYXdhaXQgRmlsZU1hbmFnZXIuZmluZEFsbEZpbGVzKGZ1bGxQYXRoLCBfcmVzdWx0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3ViZGlyXCIsIHN1YmRpcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGZ1bGxQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9XG5cbiAgLy8gc3RhdGljIGFzeW5jIGZpbmRBbGxGaWxlcyhkaXJlY3RvcnlOYW1lKSB7XG4gIC8vICAgbGV0IGZpbGVzID0gW107XG4gIC8vICAgbGV0IGFsbEZpbGVzID0gW107XG4gIC8vICAgdHJ5IHtcbiAgLy8gICAgIGZpbGVzID0gYXdhaXQgRmlsZU1hbmFnZXIucmVhZERpcihkaXJlY3RvcnlOYW1lKTtcbiAgLy8gICB9IGNhdGNoIChlcnIpIHtcbiAgLy8gICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciByZWFkaW5nIGRpcmVjdG9yeVwiLCBkaXJlY3RvcnlOYW1lLCBlcnIpO1xuICAvLyAgICAgcmV0dXJuO1xuICAvLyAgIH1cblxuICAvLyAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgLy8gICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeU5hbWUsIGZpbGUpO1xuICAvLyAgICAgaWYgKGF3YWl0IEZpbGVNYW5hZ2VyLmlzRGlyKGZ1bGxQYXRoKSkge1xuICAvLyAgICAgICBhbGxGaWxlcyA9IGFsbEZpbGVzLmNvbmNhdChhd2FpdCBGaWxlTWFuYWdlci5maW5kQWxsRmlsZXMoZnVsbFBhdGgpKTtcbiAgLy8gICAgICAgcmV0dXJuO1xuICAvLyAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgYWxsRmlsZXMgPSBhbGxGaWxlcy5jb25jYXQoZnVsbFBhdGgpO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gICByZXR1cm4gYWxsRmlsZXM7XG4gIC8vIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb250ZW50cyBvZiBhIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyZWN0b3J5XG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHN0YXRpYyBhc3luYyByZWFkRGlyKGRpcmVjdG9yeSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmcy5yZWFkZGlyKGRpcmVjdG9yeSwgKGVyciwgY29udGVudCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShjb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgc2VhcmNoIGRpcmVjdG9yeSBmb3IgZmlsZXMgd2l0aCB0aGUgZ2l2ZW4gZXh0ZW5zaW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3RvcnlOYW1lIC0gdGhlIGRpciB0byBzdGFydCBzZWFyY2ggaW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbmRFeHQgLSB0aGUgZmlsZSBleHRlbnNpb24gdG8gc2VhcmNoIGZvclxuICAgKiBAcGFyYW0ge2FycmF5fSBfcmVzdWx0cyAtIHByaXZhdGUuIGhvbGRzIHJlc3VsdHMgZm9yIHJlY3Vyc2l2ZSBzZWFyY2hcbiAgICogQHJldHVybnMge2FycmF5fSAtIGFuIGFycmF5IG9mIGZpbGUgcGF0aCBzdHJpbmdzXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgZmluZEZpbGVzV2l0aEV4dChkaXJlY3RvcnlOYW1lLCBmaW5kRXh0LCBfcmVzdWx0cyA9IFtdKSB7XG4gICAgbGV0IGZpbGVzID0gYXdhaXQgcHJvbWlzaWZ5KGZzLnJlYWRkaXIpKGRpcmVjdG9yeU5hbWUsIHtcbiAgICAgIHdpdGhGaWxlVHlwZXM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBleHQgPSBmaW5kRXh0LnN1YnN0cigwLCAxKSA9PT0gXCIuXCIgPyBmaW5kRXh0IDogYC4ke2ZpbmRFeHR9YDtcblxuICAgIGZvciAobGV0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGxldCBmdWxsUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnlOYW1lLCBmLm5hbWUpO1xuICAgICAgaWYgKGYuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBhd2FpdCBGaWxlTWFuYWdlci5maW5kRmlsZXNXaXRoRXh0KGZ1bGxQYXRoLCBmaW5kRXh0LCBfcmVzdWx0cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZ1bGxQYXRoKSA9PT0gZXh0KSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChmdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGZpbGUgYWxyZWFkeSBleGlzdHMgYXQgdGhlIGdpdmVuIGxvY2F0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gZmlsZSBwYXRoIHRvIHRlc3RcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgYXN5bmMgZmlsZUV4aXN0cyhwYXRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgcHJvbWlzaWZ5KGZzLnN0YXQpKHBhdGgpO1xuICAgICAgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGRldGVjdCBmaWxlXCIsIHBhdGgsIGVycik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGRpcmVjdG9yeSBhbHJlYWR5IGV4aXN0cyBhdCB0aGUgZ2l2ZW4gbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBkaXIgdG8gdGVzdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBhc3luYyBkaXJFeGlzdHMocGF0aCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHByb21pc2lmeShmcy5zdGF0KShwYXRoKTtcbiAgICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gY29uc29sZS53YXJuKFwiQ291bGQgbm90IGRldGVjdCBkaXJcIiwgcGF0aCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmUgZGlyZWN0b3J5IGNvcHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNyYyAtIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB0byBjb3B5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZXN0IC0gcGF0aCB0byB0aGUgY29weSBkZXN0aW5hdGlvblxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGNvcHlEaXIoc3JjLCBkZXN0KSB7XG4gICAgY29uc3QgZW50cmllcyA9IGF3YWl0IHByb21pc2lmeShmcy5yZWFkZGlyKShzcmMsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcHJvbWlzaWZ5KGZzLm1rZGlyKShkZXN0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb3B5RGlyIEVycm9yOiBDb3VsZCBub3QgbWtkaXJcIiwgZGVzdCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIGZvciAobGV0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgIGNvbnN0IHNyY1BhdGggPSBwYXRoLmpvaW4oc3JjLCBlbnRyeS5uYW1lKTtcbiAgICAgIGNvbnN0IGRlc3RQYXRoID0gcGF0aC5qb2luKGRlc3QsIGVudHJ5Lm5hbWUpO1xuICAgICAgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgYXdhaXQgRmlsZU1hbmFnZXIuY29weURpcihzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBwcm9taXNpZnkoZnMuY29weUZpbGUpKHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSB3cmFwcGVyIGZvciBvcy50bXBkaXIgdGhhdCByZXNvbHZlcyBzeW1saW5rc1xuICAgKiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvMTE0MjJcbiAgICovXG4gIHN0YXRpYyBhc3luYyBnZXRUbXBEaXIoKSB7XG4gICAgaWYgKEZpbGVNYW5hZ2VyLmVudmlyb25tZW50ID09PSBcIm5vZGVcIikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdG1wRGlyID0gYXdhaXQgcHJvbWlzaWZ5KGZzLnJlYWxwYXRoKShvcy50bXBkaXIpO1xuICAgICAgICByZXR1cm4gdG1wRGlyO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbiBnZXRUbXBEaXJcIiwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi90bXBcIjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmVzb2x2ZUlyaVRvRXB1YkxvY2F0aW9uKGlyaSwgcmVmZXJlbmNlUGF0aCkge1xuICAgIGlmIChpcmkuaW5kZXhPZihcImh0dHBcIikgPT09IDApIHtcbiAgICAgIHJldHVybiBpcmk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHJlZmVyZW5jZVBhdGgpLCBpcmkpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhYnNvbHV0ZVBhdGhUb0VwdWJMb2NhdGlvbihlcHViUGF0aCwgcmVzb3VyY2VQYXRoKSB7XG4gICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoZXB1YlBhdGgsIHJlc291cmNlUGF0aCk7XG4gIH1cblxuICBzdGF0aWMgZXB1YkxvY2F0aW9uVG9BYnNvbHV0ZVBhdGgoZXB1YlBhdGgsIHJlc291cmNlUGF0aCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lLCBlcHViUGF0aCwgcmVzb3VyY2VQYXRoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGaWxlTWFuYWdlcjtcbiJdfQ==
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _containerManager = _interopRequireDefault(require("./container-manager"));
var _packageManager = _interopRequireDefault(require("./package-manager"));
var _ncxManager = _interopRequireDefault(require("./ncx-manager"));
var _fileManager = _interopRequireDefault(require("./file-manager"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class Epubkit {
  constructor(environment = "auto") {
    if (environment === "auto") {
      this._environment = typeof window === "undefined" ? "node" : "browser";
    } else {
      this._environment = environment;
    }

    this._pathToSource = undefined;
    this._pathToEpubDir = undefined;

    this._loaded = false;

    /* paths to epub's internal files */
    this._containerPath = undefined;
    this._opfFilePath = undefined;
    this._navigationFilePath = undefined;
    this._ncxFilePath = undefined;
    this._navPath = undefined;

    /* managers */
    this._containerManager = new _containerManager.default();
    this._packageManager = new _packageManager.default();
    this._ncxManager = new _ncxManager.default();
  }

  /**
   * Load an epub archive file or directory
   * @param {string} location
   */
  async load(location) {
    this._pathToSource = _path.default.resolve(location);

    console.log("pathToSource", this._pathToSource);

    // check if epub is an archive or a directory.
    // if (FileManager.isEpubArchive(this._pathToSource)) {
    //   this._pathToEpubDir = await FileManager.prepareEpubArchive(
    //     this._pathToSource
    //   );
    // } else {
    //   this._pathToEpubDir = await FileManager.prepareEpubDir(
    //     this._pathToSource
    //   );
    // }

    this._pathToEpubDir = await _fileManager.default.loadEpub(this._pathToSource);

    console.log("pathToEpub", this._pathToEpubDir);
    if (!this._pathToEpubDir) {
      return;
    }

    // find the container.xml file.
    const containerFilePath = _path.default.resolve(
    this._pathToEpubDir,
    "./META-INF/container.xml");

    const containerExists = await _fileManager.default.fileExists(containerFilePath);

    if (!containerExists) {
      console.warn("container.xml not found at : ", containerFilePath);
      return;
    }

    const containerData = await _fileManager.default.readFile(containerFilePath);
    if (containerData) {
      await this._containerManager.loadXml(containerData);
    } else {
      console.error("Error reading container.xml file.");
      return;
    }

    const rootPath = this._containerManager.rootFilePath;

    /**
     * Find the OPF file
     */
    if (rootPath) {
      // if rootPath is found in the container.xml use that.
      this._opfFilePath = _path.default.resolve(this._pathToEpubDir, rootPath);
    } else {
      // if containerXml is missing or is missing the rootFile, do a file search for the opf.
      const opfFilePath = await _fileManager.default.findFilesWithExt(
      this._pathToEpubDir,
      "opf");

      if (opfFilePath.length > 1) {
        console.warn("More than one OPF file found: ", opfFilePath);
      }
      this._opfFilePath = opfFilePath[0];
    }

    /**
     * load the OPF file
     */
    if (!this._opfFilePath) {
      this._opfFilePath = undefined;
      throw "Opf file not found.";
    }

    try {
      const opfData = await _fileManager.default.readFile(this._opfFilePath);
      await this._packageManager.loadXml(opfData);
    } catch (e) {
      this._packageManager = undefined;
      throw e;
    }

    /**
     * If ncx file exists, initialize the NCX manager
     */
    if (this._packageManager) {
      const tocPath = this._packageManager.findNavigationFilePath();
      if (tocPath) {
        this._navigationFilePath = _path.default.join(
        _path.default.dirname(this._opfFilePath),
        tocPath);

        if (_path.default.extname(tocPath) === ".ncx") {
          this._ncxFilePath = this._navigationFilePath;
        }
      }
    }

    // ncx is not listed in the TOC in the opf. look for ncx specifically.
    if (!this._ncxFilePath) {
      try {
        this._ncxFilePath = this._packageManager.findNcxFilePath();
        if (this._ncxFilePath) {
          this._ncxFilePath = _path.default.join(
          _path.default.dirname(this._opfFilePath),
          this._ncxFilePath);

        }
      } catch (e) {
        // epub may not have an ncx file.
        this._ncxFilePath = undefined;
      }
    }

    if (this._ncxFilePath) {
      const ncxData = await _fileManager.default.readXmlFile(this._ncxFilePath);
      if (ncxData) {
        this._ncxManager.init(ncxData);
      } else {
        this._ncxManager = undefined;
      }
    }

    this._loaded = true;
  }

  async saveAs(location) {
    await _fileManager.default.saveEpubArchive(this._pathToEpubDir, location);
  }

  /**
   * Public Getters and Setters
   */

  /**
   * Get the epub input path
   */
  get pathToSource() {
    return this._pathToSource;
  }

  /**
   * Get the epub working directory.
   * Node: When epub is an archive, it will be decompressed to this tmp location.
   * Client: When epub is an archive, BrowserFS will load the zip at this virtual path.
   */
  get pathToEpubDir() {
    return this._pathToEpubDir;
  }

  get ncx() {
    return this._ncxManager;
  }

  get opf() {
    return this._packageManager;
  }

  get opfFilePath() {
    return this._opfFilePath;
  }

  get ncxFilePath() {
    return this._ncxFilePath;
  }}exports.default = Epubkit;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lcHVia2l0LmpzIl0sIm5hbWVzIjpbIkVwdWJraXQiLCJjb25zdHJ1Y3RvciIsImVudmlyb25tZW50IiwiX2Vudmlyb25tZW50Iiwid2luZG93IiwiX3BhdGhUb1NvdXJjZSIsInVuZGVmaW5lZCIsIl9wYXRoVG9FcHViRGlyIiwiX2xvYWRlZCIsIl9jb250YWluZXJQYXRoIiwiX29wZkZpbGVQYXRoIiwiX25hdmlnYXRpb25GaWxlUGF0aCIsIl9uY3hGaWxlUGF0aCIsIl9uYXZQYXRoIiwiX2NvbnRhaW5lck1hbmFnZXIiLCJDb250YWluZXJNYW5hZ2VyIiwiX3BhY2thZ2VNYW5hZ2VyIiwiUGFja2FnZU1hbmFnZXIiLCJfbmN4TWFuYWdlciIsIk5jeE1hbmFnZXIiLCJsb2FkIiwibG9jYXRpb24iLCJwYXRoIiwicmVzb2x2ZSIsImNvbnNvbGUiLCJsb2ciLCJGaWxlTWFuYWdlciIsImxvYWRFcHViIiwiY29udGFpbmVyRmlsZVBhdGgiLCJjb250YWluZXJFeGlzdHMiLCJmaWxlRXhpc3RzIiwid2FybiIsImNvbnRhaW5lckRhdGEiLCJyZWFkRmlsZSIsImxvYWRYbWwiLCJlcnJvciIsInJvb3RQYXRoIiwicm9vdEZpbGVQYXRoIiwib3BmRmlsZVBhdGgiLCJmaW5kRmlsZXNXaXRoRXh0IiwibGVuZ3RoIiwib3BmRGF0YSIsImUiLCJ0b2NQYXRoIiwiZmluZE5hdmlnYXRpb25GaWxlUGF0aCIsImpvaW4iLCJkaXJuYW1lIiwiZXh0bmFtZSIsImZpbmROY3hGaWxlUGF0aCIsIm5jeERhdGEiLCJyZWFkWG1sRmlsZSIsImluaXQiLCJzYXZlQXMiLCJzYXZlRXB1YkFyY2hpdmUiLCJwYXRoVG9Tb3VyY2UiLCJwYXRoVG9FcHViRGlyIiwibmN4Iiwib3BmIiwibmN4RmlsZVBhdGgiXSwibWFwcGluZ3MiOiJvR0FBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFOztBQUVlLE1BQU1BLE9BQU4sQ0FBYztBQUMzQkMsRUFBQUEsV0FBVyxDQUFDQyxXQUFX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VjtBQUNBLGFBQUs5QixZQUFMLEdBQW9CTixTQUFwQjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxLQUFLTSxZQUFULEVBQXVCO0FBQ3JCLFlBQU1xQyxPQUFPLEdBQUcsTUFBTXZCLHFCQUFZd0IsV0FBWixDQUF3QixLQUFLdEMsWUFBN0IsQ0FBdEI7QUFDQSxVQUFJcUMsT0FBSixFQUFhO0FBQ1gsYUFBSy9CLFdBQUwsQ0FBaUJpQyxJQUFqQixDQUFzQkYsT0FBdEI7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLL0IsV0FBTCxHQUFtQlosU0FBbkI7QUFDRDtBQUNGOztBQUVELFNBQUtFLE9BQUwsR0FBZSxJQUFmO0FBQ0Q7O0FBRVcsUUFBTjRDLE1BQU0sQ0FBQy9CLFFBQUQsRUFBVztBQUNyQixVQUFNSyxxQkFBWTJCLGVBQVosQ0FBNEIsS0FBSzlDLGNBQWpDLEVBQWlEYyxRQUFqRCxDQUFOO0FBQ0Q7O0FBRUQ7QUFDRjtBQUNBOztBQUVFO0FBQ0Y7QUFDQTtBQUNrQixNQUFaaUMsWUFBWSxHQUFHO0FBQ2pCLFdBQU8sS0FBS2pELGFBQVo7QUFDRDs7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ21CLE1BQWJrRCxhQUFhLEdBQUc7QUFDbEIsV0FBTyxLQUFLaEQsY0FBWjtBQUNEOztBQUVNLE1BQUhpRCxHQUFHLEdBQUc7QUFDUixXQUFPLEtBQUt0QyxXQUFaO0FBQ0Q7O0FBRU0sTUFBSHVDLEdBQUcsR0FBRztBQUNSLFdBQU8sS0FBS3pDLGVBQVo7QUFDRDs7QUFFYyxNQUFYc0IsV0FBVyxHQUFHO0FBQ2hCLFdBQU8sS0FBSzVCLFlBQVo7QUFDRDs7QUFFYyxNQUFYZ0QsV0FBVyxHQUFHO0FBQ2hCLFdBQU8sS0FBSzlDLFlBQVo7QUFDRCxHQS9MMEIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgQ29udGFpbmVyTWFuYWdlciBmcm9tIFwiLi9jb250YWluZXItbWFuYWdlclwiO1xuaW1wb3J0IFBhY2thZ2VNYW5hZ2VyIGZyb20gXCIuL3BhY2thZ2UtbWFuYWdlclwiO1xuaW1wb3J0IE5jeE1hbmFnZXIgZnJvbSBcIi4vbmN4LW1hbmFnZXJcIjtcbmltcG9ydCBGaWxlTWFuYWdlciBmcm9tIFwiLi9maWxlLW1hbmFnZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXB1YmtpdCB7XG4gIGNvbnN0cnVjdG9yKGVudmlyb25tZW50ID0gXCJhdXRvXCIpIHtcbiAgICBpZiAoZW52aXJvbm1lbnQgPT09IFwiYXV0b1wiKSB7XG4gICAgICB0aGlzLl9lbnZpcm9ubWVudCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBcIm5vZGVcIiA6IFwiYnJvd3NlclwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgIH1cblxuICAgIHRoaXMuX3BhdGhUb1NvdXJjZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9wYXRoVG9FcHViRGlyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5fbG9hZGVkID0gZmFsc2U7XG5cbiAgICAvKiBwYXRocyB0byBlcHViJ3MgaW50ZXJuYWwgZmlsZXMgKi9cbiAgICB0aGlzLl9jb250YWluZXJQYXRoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX29wZkZpbGVQYXRoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX25hdmlnYXRpb25GaWxlUGF0aCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9uY3hGaWxlUGF0aCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9uYXZQYXRoID0gdW5kZWZpbmVkO1xuXG4gICAgLyogbWFuYWdlcnMgKi9cbiAgICB0aGlzLl9jb250YWluZXJNYW5hZ2VyID0gbmV3IENvbnRhaW5lck1hbmFnZXIoKTtcbiAgICB0aGlzLl9wYWNrYWdlTWFuYWdlciA9IG5ldyBQYWNrYWdlTWFuYWdlcigpO1xuICAgIHRoaXMuX25jeE1hbmFnZXIgPSBuZXcgTmN4TWFuYWdlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYW4gZXB1YiBhcmNoaXZlIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgYXN5bmMgbG9hZChsb2NhdGlvbikge1xuICAgIHRoaXMuX3BhdGhUb1NvdXJjZSA9IHBhdGgucmVzb2x2ZShsb2NhdGlvbik7XG5cbiAgICBjb25zb2xlLmxvZyhcInBhdGhUb1NvdXJjZVwiLCB0aGlzLl9wYXRoVG9Tb3VyY2UpO1xuXG4gICAgLy8gY2hlY2sgaWYgZXB1YiBpcyBhbiBhcmNoaXZlIG9yIGEgZGlyZWN0b3J5LlxuICAgIC8vIGlmIChGaWxlTWFuYWdlci5pc0VwdWJBcmNoaXZlKHRoaXMuX3BhdGhUb1NvdXJjZSkpIHtcbiAgICAvLyAgIHRoaXMuX3BhdGhUb0VwdWJEaXIgPSBhd2FpdCBGaWxlTWFuYWdlci5wcmVwYXJlRXB1YkFyY2hpdmUoXG4gICAgLy8gICAgIHRoaXMuX3BhdGhUb1NvdXJjZVxuICAgIC8vICAgKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgdGhpcy5fcGF0aFRvRXB1YkRpciA9IGF3YWl0IEZpbGVNYW5hZ2VyLnByZXBhcmVFcHViRGlyKFxuICAgIC8vICAgICB0aGlzLl9wYXRoVG9Tb3VyY2VcbiAgICAvLyAgICk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5fcGF0aFRvRXB1YkRpciA9IGF3YWl0IEZpbGVNYW5hZ2VyLmxvYWRFcHViKHRoaXMuX3BhdGhUb1NvdXJjZSk7XG5cbiAgICBjb25zb2xlLmxvZyhcInBhdGhUb0VwdWJcIiwgdGhpcy5fcGF0aFRvRXB1YkRpcik7XG4gICAgaWYgKCF0aGlzLl9wYXRoVG9FcHViRGlyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZmluZCB0aGUgY29udGFpbmVyLnhtbCBmaWxlLlxuICAgIGNvbnN0IGNvbnRhaW5lckZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgdGhpcy5fcGF0aFRvRXB1YkRpcixcbiAgICAgIFwiLi9NRVRBLUlORi9jb250YWluZXIueG1sXCJcbiAgICApO1xuICAgIGNvbnN0IGNvbnRhaW5lckV4aXN0cyA9IGF3YWl0IEZpbGVNYW5hZ2VyLmZpbGVFeGlzdHMoY29udGFpbmVyRmlsZVBhdGgpO1xuXG4gICAgaWYgKCFjb250YWluZXJFeGlzdHMpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImNvbnRhaW5lci54bWwgbm90IGZvdW5kIGF0IDogXCIsIGNvbnRhaW5lckZpbGVQYXRoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXJEYXRhID0gYXdhaXQgRmlsZU1hbmFnZXIucmVhZEZpbGUoY29udGFpbmVyRmlsZVBhdGgpO1xuICAgIGlmIChjb250YWluZXJEYXRhKSB7XG4gICAgICBhd2FpdCB0aGlzLl9jb250YWluZXJNYW5hZ2VyLmxvYWRYbWwoY29udGFpbmVyRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciByZWFkaW5nIGNvbnRhaW5lci54bWwgZmlsZS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFBhdGggPSB0aGlzLl9jb250YWluZXJNYW5hZ2VyLnJvb3RGaWxlUGF0aDtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIE9QRiBmaWxlXG4gICAgICovXG4gICAgaWYgKHJvb3RQYXRoKSB7XG4gICAgICAvLyBpZiByb290UGF0aCBpcyBmb3VuZCBpbiB0aGUgY29udGFpbmVyLnhtbCB1c2UgdGhhdC5cbiAgICAgIHRoaXMuX29wZkZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMuX3BhdGhUb0VwdWJEaXIsIHJvb3RQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgY29udGFpbmVyWG1sIGlzIG1pc3Npbmcgb3IgaXMgbWlzc2luZyB0aGUgcm9vdEZpbGUsIGRvIGEgZmlsZSBzZWFyY2ggZm9yIHRoZSBvcGYuXG4gICAgICBjb25zdCBvcGZGaWxlUGF0aCA9IGF3YWl0IEZpbGVNYW5hZ2VyLmZpbmRGaWxlc1dpdGhFeHQoXG4gICAgICAgIHRoaXMuX3BhdGhUb0VwdWJEaXIsXG4gICAgICAgIFwib3BmXCJcbiAgICAgICk7XG4gICAgICBpZiAob3BmRmlsZVBhdGgubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJNb3JlIHRoYW4gb25lIE9QRiBmaWxlIGZvdW5kOiBcIiwgb3BmRmlsZVBhdGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fb3BmRmlsZVBhdGggPSBvcGZGaWxlUGF0aFswXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBsb2FkIHRoZSBPUEYgZmlsZVxuICAgICAqL1xuICAgIGlmICghdGhpcy5fb3BmRmlsZVBhdGgpIHtcbiAgICAgIHRoaXMuX29wZkZpbGVQYXRoID0gdW5kZWZpbmVkO1xuICAgICAgdGhyb3cgXCJPcGYgZmlsZSBub3QgZm91bmQuXCI7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9wZkRhdGEgPSBhd2FpdCBGaWxlTWFuYWdlci5yZWFkRmlsZSh0aGlzLl9vcGZGaWxlUGF0aCk7XG4gICAgICBhd2FpdCB0aGlzLl9wYWNrYWdlTWFuYWdlci5sb2FkWG1sKG9wZkRhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuX3BhY2thZ2VNYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiBuY3ggZmlsZSBleGlzdHMsIGluaXRpYWxpemUgdGhlIE5DWCBtYW5hZ2VyXG4gICAgICovXG4gICAgaWYgKHRoaXMuX3BhY2thZ2VNYW5hZ2VyKSB7XG4gICAgICBjb25zdCB0b2NQYXRoID0gdGhpcy5fcGFja2FnZU1hbmFnZXIuZmluZE5hdmlnYXRpb25GaWxlUGF0aCgpO1xuICAgICAgaWYgKHRvY1BhdGgpIHtcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbkZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgIHBhdGguZGlybmFtZSh0aGlzLl9vcGZGaWxlUGF0aCksXG4gICAgICAgICAgdG9jUGF0aFxuICAgICAgICApO1xuICAgICAgICBpZiAocGF0aC5leHRuYW1lKHRvY1BhdGgpID09PSBcIi5uY3hcIikge1xuICAgICAgICAgIHRoaXMuX25jeEZpbGVQYXRoID0gdGhpcy5fbmF2aWdhdGlvbkZpbGVQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbmN4IGlzIG5vdCBsaXN0ZWQgaW4gdGhlIFRPQyBpbiB0aGUgb3BmLiBsb29rIGZvciBuY3ggc3BlY2lmaWNhbGx5LlxuICAgIGlmICghdGhpcy5fbmN4RmlsZVBhdGgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX25jeEZpbGVQYXRoID0gdGhpcy5fcGFja2FnZU1hbmFnZXIuZmluZE5jeEZpbGVQYXRoKCk7XG4gICAgICAgIGlmICh0aGlzLl9uY3hGaWxlUGF0aCkge1xuICAgICAgICAgIHRoaXMuX25jeEZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHRoaXMuX29wZkZpbGVQYXRoKSxcbiAgICAgICAgICAgIHRoaXMuX25jeEZpbGVQYXRoXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBlcHViIG1heSBub3QgaGF2ZSBhbiBuY3ggZmlsZS5cbiAgICAgICAgdGhpcy5fbmN4RmlsZVBhdGggPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX25jeEZpbGVQYXRoKSB7XG4gICAgICBjb25zdCBuY3hEYXRhID0gYXdhaXQgRmlsZU1hbmFnZXIucmVhZFhtbEZpbGUodGhpcy5fbmN4RmlsZVBhdGgpO1xuICAgICAgaWYgKG5jeERhdGEpIHtcbiAgICAgICAgdGhpcy5fbmN4TWFuYWdlci5pbml0KG5jeERhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbmN4TWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9sb2FkZWQgPSB0cnVlO1xuICB9XG5cbiAgYXN5bmMgc2F2ZUFzKGxvY2F0aW9uKSB7XG4gICAgYXdhaXQgRmlsZU1hbmFnZXIuc2F2ZUVwdWJBcmNoaXZlKHRoaXMuX3BhdGhUb0VwdWJEaXIsIGxvY2F0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgR2V0dGVycyBhbmQgU2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogR2V0IHRoZSBlcHViIGlucHV0IHBhdGhcbiAgICovXG4gIGdldCBwYXRoVG9Tb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhdGhUb1NvdXJjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGVwdWIgd29ya2luZyBkaXJlY3RvcnkuXG4gICAqIE5vZGU6IFdoZW4gZXB1YiBpcyBhbiBhcmNoaXZlLCBpdCB3aWxsIGJlIGRlY29tcHJlc3NlZCB0byB0aGlzIHRtcCBsb2NhdGlvbi5cbiAgICogQ2xpZW50OiBXaGVuIGVwdWIgaXMgYW4gYXJjaGl2ZSwgQnJvd3NlckZTIHdpbGwgbG9hZCB0aGUgemlwIGF0IHRoaXMgdmlydHVhbCBwYXRoLlxuICAgKi9cbiAgZ2V0IHBhdGhUb0VwdWJEaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhdGhUb0VwdWJEaXI7XG4gIH1cblxuICBnZXQgbmN4KCkge1xuICAgIHJldHVybiB0aGlzLl9uY3hNYW5hZ2VyO1xuICB9XG5cbiAgZ2V0IG9wZigpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFja2FnZU1hbmFnZXI7XG4gIH1cblxuICBnZXQgb3BmRmlsZVBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wZkZpbGVQYXRoO1xuICB9XG5cbiAgZ2V0IG5jeEZpbGVQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLl9uY3hGaWxlUGF0aDtcbiAgfVxufVxuXG4iXX0=
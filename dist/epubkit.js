"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _path = _interopRequireDefault(require("path"));
var _containerManager = _interopRequireDefault(require("./container-manager"));
var _packageManager = _interopRequireDefault(require("./package-manager"));
var _ncxManager = _interopRequireDefault(require("./ncx-manager"));
var _fileManager = _interopRequireDefault(require("./file-manager"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Epubkit = /*#__PURE__*/function () {
  function Epubkit() {var environment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "auto";_classCallCheck(this, Epubkit);
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
    this._containerManager = new _containerManager["default"]();
    this._packageManager = new _packageManager["default"]();
    this._ncxManager = new _ncxManager["default"]();
  }

  /**
     * Load an epub archive file or directory
     * @param {string} location
     */_createClass(Epubkit, [{ key: "load", value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
      location) {var containerFilePath, containerExists, containerData, rootPath, opfFilePath, opfData, tocPath, ncxData;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                this._pathToSource = _path["default"].resolve(location);

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
                _context.next = 4;return (
                  _fileManager["default"].loadEpub(this._pathToSource));case 4:this._pathToEpubDir = _context.sent;

                console.log("pathToEpub", this._pathToEpubDir);if (
                this._pathToEpubDir) {_context.next = 8;break;}return _context.abrupt("return");case 8:



                // find the container.xml file.
                containerFilePath = _path["default"].resolve(
                this._pathToEpubDir,
                "./META-INF/container.xml");_context.next = 11;return (

                  _fileManager["default"].fileExists(containerFilePath));case 11:containerExists = _context.sent;if (

                containerExists) {_context.next = 15;break;}
                console.warn("container.xml not found at : ", containerFilePath);return _context.abrupt("return");case 15:_context.next = 17;return (



                  _fileManager["default"].readFile(containerFilePath));case 17:containerData = _context.sent;if (!
                containerData) {_context.next = 23;break;}_context.next = 21;return (
                  this._containerManager.loadXml(containerData));case 21:_context.next = 25;break;case 23:

                console.error("Error reading container.xml file.");return _context.abrupt("return");case 25:



                rootPath = this._containerManager.rootFilePath;

                /**
                                                                 * Find the OPF file
                                                                 */if (!
                rootPath) {_context.next = 30;break;}
                // if rootPath is found in the container.xml use that.
                this._opfFilePath = _path["default"].resolve(this._pathToEpubDir, rootPath);_context.next = 35;break;case 30:_context.next = 32;return (


                  _fileManager["default"].findFilesWithExt(
                  this._pathToEpubDir,
                  "opf"));case 32:opfFilePath = _context.sent;

                if (opfFilePath.length > 1) {
                  console.warn("More than one OPF file found: ", opfFilePath);
                }
                this._opfFilePath = opfFilePath[0];case 35:if (





                this._opfFilePath) {_context.next = 38;break;}
                this._opfFilePath = undefined;throw (
                  "Opf file not found.");case 38:_context.prev = 38;_context.next = 41;return (



                  _fileManager["default"].readFile(this._opfFilePath));case 41:opfData = _context.sent;_context.next = 44;return (
                  this._packageManager.loadXml(opfData));case 44:_context.next = 50;break;case 46:_context.prev = 46;_context.t0 = _context["catch"](38);

                this._packageManager = undefined;throw _context.t0;case 50:



                /**
                                                                             * If ncx file exists, initialize the NCX manager
                                                                             */
                if (this._packageManager) {
                  tocPath = this._packageManager.findNavigationFilePath();
                  if (tocPath) {
                    this._navigationFilePath = _path["default"].join(
                    _path["default"].dirname(this._opfFilePath),
                    tocPath);

                    if (_path["default"].extname(tocPath) === ".ncx") {
                      this._ncxFilePath = this._navigationFilePath;
                    }
                  }
                }

                // ncx is not listed in the TOC in the opf. look for ncx specifically.
                if (!this._ncxFilePath) {
                  try {
                    this._ncxFilePath = this._packageManager.findNcxFilePath();
                    if (this._ncxFilePath) {
                      this._ncxFilePath = _path["default"].join(
                      _path["default"].dirname(this._opfFilePath),
                      this._ncxFilePath);

                    }
                  } catch (e) {
                    // epub may not have an ncx file.
                    this._ncxFilePath = undefined;
                  }
                }if (!

                this._ncxFilePath) {_context.next = 57;break;}_context.next = 55;return (
                  _fileManager["default"].readXmlFile(this._ncxFilePath));case 55:ncxData = _context.sent;
                if (ncxData) {
                  this._ncxManager.init(ncxData);
                } else {
                  this._ncxManager = undefined;
                }case 57:


                this._loaded = true;case 58:case "end":return _context.stop();}}}, _callee, this, [[38, 46]]);}));function load(_x) {return _load.apply(this, arguments);}return load;}() }, { key: "saveAs", value: function () {var _saveAs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(


      location) {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                  _fileManager["default"].saveEpubArchive(this._pathToEpubDir, location));case 2:case "end":return _context2.stop();}}}, _callee2, this);}));function saveAs(_x2) {return _saveAs.apply(this, arguments);}return saveAs;}()


    /**
                                                                                                                                                                                                                                             * Public Getters and Setters
                                                                                                                                                                                                                                             */

    /**
                                                                                                                                                                                                                                                 * Get the epub input path
                                                                                                                                                                                                                                                 */ }, { key: "pathToSource", get: function get()
    {
      return this._pathToSource;
    }

    /**
       * Get the epub working directory.
       * Node: When epub is an archive, it will be decompressed to this tmp location.
       * Client: When epub is an archive, BrowserFS will load the zip at this virtual path.
       */ }, { key: "pathToEpubDir", get: function get()
    {
      return this._pathToEpubDir;
    } }, { key: "ncx", get: function get()

    {
      return this._ncxManager;
    } }, { key: "opf", get: function get()

    {
      return this._packageManager;
    } }, { key: "opfFilePath", get: function get()

    {
      return this._opfFilePath;
    } }, { key: "ncxFilePath", get: function get()

    {
      return this._ncxFilePath;
    } }]);return Epubkit;}();exports["default"] = Epubkit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lcHVia2l0LmpzIl0sIm5hbWVzIjpbIkVwdWJraXQiLCJlbnZpcm9ubWVudCIsIl9lbnZpcm9ubWVudCIsIndpbmRvdyIsIl9wYXRoVG9Tb3VyY2UiLCJ1bmRlZmluZWQiLCJfcGF0aFRvRXB1YkRpciIsIl9sb2FkZWQiLCJfY29udGFpbmVyUGF0aCIsIl9vcGZGaWxlUGF0aCIsIl9uYXZpZ2F0aW9uRmlsZVBhdGgiLCJfbmN4RmlsZVBhdGgiLCJfbmF2UGF0aCIsIl9jb250YWluZXJNYW5hZ2VyIiwiQ29udGFpbmVyTWFuYWdlciIsIl9wYWNrYWdlTWFuYWdlciIsIlBhY2thZ2VNYW5hZ2VyIiwiX25jeE1hbmFnZXIiLCJOY3hNYW5hZ2VyIiwibG9jYXRpb24iLCJwYXRoIiwicmVzb2x2ZSIsImNvbnNvbGUiLCJsb2ciLCJGaWxlTWFuYWdlciIsImxvYWRFcHViIiwiY29udGFpbmVyRmlsZVBhdGgiLCJmaWxlRXhpc3RzIiwiY29udGFpbmVyRXhpc3RzIiwid2FybiIsInJlYWRGaWxlIiwiY29udGFpbmVyRGF0YSIsImxvYWRYbWwiLCJlcnJvciIsInJvb3RQYXRoIiwicm9vdEZpbGVQYXRoIiwiZmluZEZpbGVzV2l0aEV4dCIsIm9wZkZpbGVQYXRoIiwibGVuZ3RoIiwib3BmRGF0YSIsInRvY1BhdGgiLCJmaW5kTmF2aWdhdGlvbkZpbGVQYXRoIiwiam9pbiIsImRpcm5hbWUiLCJleHRuYW1lIiwiZmluZE5jeEZpbGVQYXRoIiwiZSIsInJlYWRYbWxGaWxlIiwibmN4RGF0YSIsImluaXQiLCJzYXZlRXB1YkFyY2hpdmUiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFOztBQUVxQkEsTztBQUNuQixxQkFBa0MsS0FBdEJDLFdBQXNCLHVFQUFSLE1BQVE7QUFDaEMsUUFBSUEsV0FBVyxLQUFLLE1BQXBCLEVBQTRCO0FBQzFCLFdBQUtDLFlBQUwsR0FBb0IsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQyxNQUFo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LEtBQUtFLGNBQVo7QUFDRCxLOztBQUVTO0FBQ1IsYUFBTyxLQUFLVyxXQUFaO0FBQ0QsSzs7QUFFUztBQUNSLGFBQU8sS0FBS0YsZUFBWjtBQUNELEs7O0FBRWlCO0FBQ2hCLGFBQU8sS0FBS04sWUFBWjtBQUNELEs7O0FBRWlCO0FBQ2hCLGFBQU8sS0FBS0UsWUFBWjtBQUNELEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IENvbnRhaW5lck1hbmFnZXIgZnJvbSBcIi4vY29udGFpbmVyLW1hbmFnZXJcIjtcbmltcG9ydCBQYWNrYWdlTWFuYWdlciBmcm9tIFwiLi9wYWNrYWdlLW1hbmFnZXJcIjtcbmltcG9ydCBOY3hNYW5hZ2VyIGZyb20gXCIuL25jeC1tYW5hZ2VyXCI7XG5pbXBvcnQgRmlsZU1hbmFnZXIgZnJvbSBcIi4vZmlsZS1tYW5hZ2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVwdWJraXQge1xuICBjb25zdHJ1Y3RvcihlbnZpcm9ubWVudCA9IFwiYXV0b1wiKSB7XG4gICAgaWYgKGVudmlyb25tZW50ID09PSBcImF1dG9cIikge1xuICAgICAgdGhpcy5fZW52aXJvbm1lbnQgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gXCJub2RlXCIgOiBcImJyb3dzZXJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcbiAgICB9XG5cbiAgICB0aGlzLl9wYXRoVG9Tb3VyY2UgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcGF0aFRvRXB1YkRpciA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuX2xvYWRlZCA9IGZhbHNlO1xuXG4gICAgLyogcGF0aHMgdG8gZXB1YidzIGludGVybmFsIGZpbGVzICovXG4gICAgdGhpcy5fY29udGFpbmVyUGF0aCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9vcGZGaWxlUGF0aCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9uYXZpZ2F0aW9uRmlsZVBhdGggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbmN4RmlsZVBhdGggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbmF2UGF0aCA9IHVuZGVmaW5lZDtcblxuICAgIC8qIG1hbmFnZXJzICovXG4gICAgdGhpcy5fY29udGFpbmVyTWFuYWdlciA9IG5ldyBDb250YWluZXJNYW5hZ2VyKCk7XG4gICAgdGhpcy5fcGFja2FnZU1hbmFnZXIgPSBuZXcgUGFja2FnZU1hbmFnZXIoKTtcbiAgICB0aGlzLl9uY3hNYW5hZ2VyID0gbmV3IE5jeE1hbmFnZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGFuIGVwdWIgYXJjaGl2ZSBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIGFzeW5jIGxvYWQobG9jYXRpb24pIHtcbiAgICB0aGlzLl9wYXRoVG9Tb3VyY2UgPSBwYXRoLnJlc29sdmUobG9jYXRpb24pO1xuXG4gICAgY29uc29sZS5sb2coXCJwYXRoVG9Tb3VyY2VcIiwgdGhpcy5fcGF0aFRvU291cmNlKTtcblxuICAgIC8vIGNoZWNrIGlmIGVwdWIgaXMgYW4gYXJjaGl2ZSBvciBhIGRpcmVjdG9yeS5cbiAgICAvLyBpZiAoRmlsZU1hbmFnZXIuaXNFcHViQXJjaGl2ZSh0aGlzLl9wYXRoVG9Tb3VyY2UpKSB7XG4gICAgLy8gICB0aGlzLl9wYXRoVG9FcHViRGlyID0gYXdhaXQgRmlsZU1hbmFnZXIucHJlcGFyZUVwdWJBcmNoaXZlKFxuICAgIC8vICAgICB0aGlzLl9wYXRoVG9Tb3VyY2VcbiAgICAvLyAgICk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIHRoaXMuX3BhdGhUb0VwdWJEaXIgPSBhd2FpdCBGaWxlTWFuYWdlci5wcmVwYXJlRXB1YkRpcihcbiAgICAvLyAgICAgdGhpcy5fcGF0aFRvU291cmNlXG4gICAgLy8gICApO1xuICAgIC8vIH1cblxuICAgIHRoaXMuX3BhdGhUb0VwdWJEaXIgPSBhd2FpdCBGaWxlTWFuYWdlci5sb2FkRXB1Yih0aGlzLl9wYXRoVG9Tb3VyY2UpO1xuXG4gICAgY29uc29sZS5sb2coXCJwYXRoVG9FcHViXCIsIHRoaXMuX3BhdGhUb0VwdWJEaXIpO1xuICAgIGlmICghdGhpcy5fcGF0aFRvRXB1YkRpcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGZpbmQgdGhlIGNvbnRhaW5lci54bWwgZmlsZS5cbiAgICBjb25zdCBjb250YWluZXJGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShcbiAgICAgIHRoaXMuX3BhdGhUb0VwdWJEaXIsXG4gICAgICBcIi4vTUVUQS1JTkYvY29udGFpbmVyLnhtbFwiXG4gICAgKTtcbiAgICBjb25zdCBjb250YWluZXJFeGlzdHMgPSBhd2FpdCBGaWxlTWFuYWdlci5maWxlRXhpc3RzKGNvbnRhaW5lckZpbGVQYXRoKTtcblxuICAgIGlmICghY29udGFpbmVyRXhpc3RzKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJjb250YWluZXIueG1sIG5vdCBmb3VuZCBhdCA6IFwiLCBjb250YWluZXJGaWxlUGF0aCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyRGF0YSA9IGF3YWl0IEZpbGVNYW5hZ2VyLnJlYWRGaWxlKGNvbnRhaW5lckZpbGVQYXRoKTtcbiAgICBpZiAoY29udGFpbmVyRGF0YSkge1xuICAgICAgYXdhaXQgdGhpcy5fY29udGFpbmVyTWFuYWdlci5sb2FkWG1sKGNvbnRhaW5lckRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVhZGluZyBjb250YWluZXIueG1sIGZpbGUuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3RQYXRoID0gdGhpcy5fY29udGFpbmVyTWFuYWdlci5yb290RmlsZVBhdGg7XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBPUEYgZmlsZVxuICAgICAqL1xuICAgIGlmIChyb290UGF0aCkge1xuICAgICAgLy8gaWYgcm9vdFBhdGggaXMgZm91bmQgaW4gdGhlIGNvbnRhaW5lci54bWwgdXNlIHRoYXQuXG4gICAgICB0aGlzLl9vcGZGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLl9wYXRoVG9FcHViRGlyLCByb290UGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIGNvbnRhaW5lclhtbCBpcyBtaXNzaW5nIG9yIGlzIG1pc3NpbmcgdGhlIHJvb3RGaWxlLCBkbyBhIGZpbGUgc2VhcmNoIGZvciB0aGUgb3BmLlxuICAgICAgY29uc3Qgb3BmRmlsZVBhdGggPSBhd2FpdCBGaWxlTWFuYWdlci5maW5kRmlsZXNXaXRoRXh0KFxuICAgICAgICB0aGlzLl9wYXRoVG9FcHViRGlyLFxuICAgICAgICBcIm9wZlwiXG4gICAgICApO1xuICAgICAgaWYgKG9wZkZpbGVQYXRoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiTW9yZSB0aGFuIG9uZSBPUEYgZmlsZSBmb3VuZDogXCIsIG9wZkZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX29wZkZpbGVQYXRoID0gb3BmRmlsZVBhdGhbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbG9hZCB0aGUgT1BGIGZpbGVcbiAgICAgKi9cbiAgICBpZiAoIXRoaXMuX29wZkZpbGVQYXRoKSB7XG4gICAgICB0aGlzLl9vcGZGaWxlUGF0aCA9IHVuZGVmaW5lZDtcbiAgICAgIHRocm93IFwiT3BmIGZpbGUgbm90IGZvdW5kLlwiO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBvcGZEYXRhID0gYXdhaXQgRmlsZU1hbmFnZXIucmVhZEZpbGUodGhpcy5fb3BmRmlsZVBhdGgpO1xuICAgICAgYXdhaXQgdGhpcy5fcGFja2FnZU1hbmFnZXIubG9hZFhtbChvcGZEYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLl9wYWNrYWdlTWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgbmN4IGZpbGUgZXhpc3RzLCBpbml0aWFsaXplIHRoZSBOQ1ggbWFuYWdlclxuICAgICAqL1xuICAgIGlmICh0aGlzLl9wYWNrYWdlTWFuYWdlcikge1xuICAgICAgY29uc3QgdG9jUGF0aCA9IHRoaXMuX3BhY2thZ2VNYW5hZ2VyLmZpbmROYXZpZ2F0aW9uRmlsZVBhdGgoKTtcbiAgICAgIGlmICh0b2NQYXRoKSB7XG4gICAgICAgIHRoaXMuX25hdmlnYXRpb25GaWxlUGF0aCA9IHBhdGguam9pbihcbiAgICAgICAgICBwYXRoLmRpcm5hbWUodGhpcy5fb3BmRmlsZVBhdGgpLFxuICAgICAgICAgIHRvY1BhdGhcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHBhdGguZXh0bmFtZSh0b2NQYXRoKSA9PT0gXCIubmN4XCIpIHtcbiAgICAgICAgICB0aGlzLl9uY3hGaWxlUGF0aCA9IHRoaXMuX25hdmlnYXRpb25GaWxlUGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5jeCBpcyBub3QgbGlzdGVkIGluIHRoZSBUT0MgaW4gdGhlIG9wZi4gbG9vayBmb3IgbmN4IHNwZWNpZmljYWxseS5cbiAgICBpZiAoIXRoaXMuX25jeEZpbGVQYXRoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl9uY3hGaWxlUGF0aCA9IHRoaXMuX3BhY2thZ2VNYW5hZ2VyLmZpbmROY3hGaWxlUGF0aCgpO1xuICAgICAgICBpZiAodGhpcy5fbmN4RmlsZVBhdGgpIHtcbiAgICAgICAgICB0aGlzLl9uY3hGaWxlUGF0aCA9IHBhdGguam9pbihcbiAgICAgICAgICAgIHBhdGguZGlybmFtZSh0aGlzLl9vcGZGaWxlUGF0aCksXG4gICAgICAgICAgICB0aGlzLl9uY3hGaWxlUGF0aFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gZXB1YiBtYXkgbm90IGhhdmUgYW4gbmN4IGZpbGUuXG4gICAgICAgIHRoaXMuX25jeEZpbGVQYXRoID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9uY3hGaWxlUGF0aCkge1xuICAgICAgY29uc3QgbmN4RGF0YSA9IGF3YWl0IEZpbGVNYW5hZ2VyLnJlYWRYbWxGaWxlKHRoaXMuX25jeEZpbGVQYXRoKTtcbiAgICAgIGlmIChuY3hEYXRhKSB7XG4gICAgICAgIHRoaXMuX25jeE1hbmFnZXIuaW5pdChuY3hEYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX25jeE1hbmFnZXIgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbG9hZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVBcyhsb2NhdGlvbikge1xuICAgIGF3YWl0IEZpbGVNYW5hZ2VyLnNhdmVFcHViQXJjaGl2ZSh0aGlzLl9wYXRoVG9FcHViRGlyLCBsb2NhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIEdldHRlcnMgYW5kIFNldHRlcnNcbiAgICovXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZXB1YiBpbnB1dCBwYXRoXG4gICAqL1xuICBnZXQgcGF0aFRvU291cmNlKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXRoVG9Tb3VyY2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBlcHViIHdvcmtpbmcgZGlyZWN0b3J5LlxuICAgKiBOb2RlOiBXaGVuIGVwdWIgaXMgYW4gYXJjaGl2ZSwgaXQgd2lsbCBiZSBkZWNvbXByZXNzZWQgdG8gdGhpcyB0bXAgbG9jYXRpb24uXG4gICAqIENsaWVudDogV2hlbiBlcHViIGlzIGFuIGFyY2hpdmUsIEJyb3dzZXJGUyB3aWxsIGxvYWQgdGhlIHppcCBhdCB0aGlzIHZpcnR1YWwgcGF0aC5cbiAgICovXG4gIGdldCBwYXRoVG9FcHViRGlyKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXRoVG9FcHViRGlyO1xuICB9XG5cbiAgZ2V0IG5jeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmN4TWFuYWdlcjtcbiAgfVxuXG4gIGdldCBvcGYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhY2thZ2VNYW5hZ2VyO1xuICB9XG5cbiAgZ2V0IG9wZkZpbGVQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLl9vcGZGaWxlUGF0aDtcbiAgfVxuXG4gIGdldCBuY3hGaWxlUGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmN4RmlsZVBhdGg7XG4gIH1cbn1cblxuIl19
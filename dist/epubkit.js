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
    } }]);return Epubkit;}();var _default =


Epubkit;exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lcHVia2l0LmpzIl0sIm5hbWVzIjpbIkVwdWJraXQiLCJlbnZpcm9ubWVudCIsIl9lbnZpcm9ubWVudCIsIndpbmRvdyIsIl9wYXRoVG9Tb3VyY2UiLCJ1bmRlZmluZWQiLCJfcGF0aFRvRXB1YkRpciIsIl9sb2FkZWQiLCJfY29udGFpbmVyUGF0aCIsIl9vcGZGaWxlUGF0aCIsIl9uYXZpZ2F0aW9uRmlsZVBhdGgiLCJfbmN4RmlsZVBhdGgiLCJfbmF2UGF0aCIsIl9jb250YWluZXJNYW5hZ2VyIiwiQ29udGFpbmVyTWFuYWdlciIsIl9wYWNrYWdlTWFuYWdlciIsIlBhY2thZ2VNYW5hZ2VyIiwiX25jeE1hbmFnZXIiLCJOY3hNYW5hZ2VyIiwibG9jYXRpb24iLCJwYXRoIiwicmVzb2x2ZSIsImNvbnNvbGUiLCJsb2ciLCJGaWxlTWFuYWdlciIsImxvYWRFcHViIiwiY29udGFpbmVyRmlsZVBhdGgiLCJmaWxlRXhpc3RzIiwiY29udGFpbmVyRXhpc3RzIiwid2FybiIsInJlYWRGaWxlIiwiY29udGFpbmVyRGF0YSIsImxvYWRYbWwiLCJlcnJvciIsInJvb3RQYXRoIiwicm9vdEZpbGVQYXRoIiwiZmluZEZpbGVzV2l0aEV4dCIsIm9wZkZpbGVQYXRoIiwibGVuZ3RoIiwib3BmRGF0YSIsInRvY1BhdGgiLCJmaW5kTmF2aWdhdGlvbkZpbGVQYXRoIiwiam9pbiIsImRpcm5hbWUiLCJleHRuYW1lIiwiZmluZE5jeEZpbGVQYXRoIiwiZSIsInJlYWRYbWxGaWxlIiwibmN4RGF0YSIsImluaXQiLCJzYXZlRXB1YkFyY2hpdmUiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFOztBQUVNQSxPO0FBQ0oscUJBQWtDLEtBQXRCQyxXQUFzQix1RUFBUixNQUFRO0FBQ2hDLFFBQUlBLFdBQVcsS0FBSyxNQUFwQixFQUE0QjtBQUMxQixXQUFLQyxZQUFMLEdBQW9CLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0MsTUFBaEMs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QUFLRSxjQUFaO0FBQ0QsSzs7QUFFUztBQUNSLGFBQU8sS0FBS1csV0FBWjtBQUNELEs7O0FBRVM7QUFDUixhQUFPLEtBQUtGLGVBQVo7QUFDRCxLOztBQUVpQjtBQUNoQixhQUFPLEtBQUtOLFlBQVo7QUFDRCxLOztBQUVpQjtBQUNoQixhQUFPLEtBQUtFLFlBQVo7QUFDRCxLOzs7QUFHWVgsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgQ29udGFpbmVyTWFuYWdlciBmcm9tIFwiLi9jb250YWluZXItbWFuYWdlclwiO1xuaW1wb3J0IFBhY2thZ2VNYW5hZ2VyIGZyb20gXCIuL3BhY2thZ2UtbWFuYWdlclwiO1xuaW1wb3J0IE5jeE1hbmFnZXIgZnJvbSBcIi4vbmN4LW1hbmFnZXJcIjtcbmltcG9ydCBGaWxlTWFuYWdlciBmcm9tIFwiLi9maWxlLW1hbmFnZXJcIjtcblxuY2xhc3MgRXB1YmtpdCB7XG4gIGNvbnN0cnVjdG9yKGVudmlyb25tZW50ID0gXCJhdXRvXCIpIHtcbiAgICBpZiAoZW52aXJvbm1lbnQgPT09IFwiYXV0b1wiKSB7XG4gICAgICB0aGlzLl9lbnZpcm9ubWVudCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBcIm5vZGVcIiA6IFwiYnJvd3NlclwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgIH1cblxuICAgIHRoaXMuX3BhdGhUb1NvdXJjZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9wYXRoVG9FcHViRGlyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5fbG9hZGVkID0gZmFsc2U7XG5cbiAgICAvKiBwYXRocyB0byBlcHViJ3MgaW50ZXJuYWwgZmlsZXMgKi9cbiAgICB0aGlzLl9jb250YWluZXJQYXRoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX29wZkZpbGVQYXRoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX25hdmlnYXRpb25GaWxlUGF0aCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9uY3hGaWxlUGF0aCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9uYXZQYXRoID0gdW5kZWZpbmVkO1xuXG4gICAgLyogbWFuYWdlcnMgKi9cbiAgICB0aGlzLl9jb250YWluZXJNYW5hZ2VyID0gbmV3IENvbnRhaW5lck1hbmFnZXIoKTtcbiAgICB0aGlzLl9wYWNrYWdlTWFuYWdlciA9IG5ldyBQYWNrYWdlTWFuYWdlcigpO1xuICAgIHRoaXMuX25jeE1hbmFnZXIgPSBuZXcgTmN4TWFuYWdlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYW4gZXB1YiBhcmNoaXZlIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgYXN5bmMgbG9hZChsb2NhdGlvbikge1xuICAgIHRoaXMuX3BhdGhUb1NvdXJjZSA9IHBhdGgucmVzb2x2ZShsb2NhdGlvbik7XG5cbiAgICBjb25zb2xlLmxvZyhcInBhdGhUb1NvdXJjZVwiLCB0aGlzLl9wYXRoVG9Tb3VyY2UpO1xuXG4gICAgLy8gY2hlY2sgaWYgZXB1YiBpcyBhbiBhcmNoaXZlIG9yIGEgZGlyZWN0b3J5LlxuICAgIC8vIGlmIChGaWxlTWFuYWdlci5pc0VwdWJBcmNoaXZlKHRoaXMuX3BhdGhUb1NvdXJjZSkpIHtcbiAgICAvLyAgIHRoaXMuX3BhdGhUb0VwdWJEaXIgPSBhd2FpdCBGaWxlTWFuYWdlci5wcmVwYXJlRXB1YkFyY2hpdmUoXG4gICAgLy8gICAgIHRoaXMuX3BhdGhUb1NvdXJjZVxuICAgIC8vICAgKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgdGhpcy5fcGF0aFRvRXB1YkRpciA9IGF3YWl0IEZpbGVNYW5hZ2VyLnByZXBhcmVFcHViRGlyKFxuICAgIC8vICAgICB0aGlzLl9wYXRoVG9Tb3VyY2VcbiAgICAvLyAgICk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5fcGF0aFRvRXB1YkRpciA9IGF3YWl0IEZpbGVNYW5hZ2VyLmxvYWRFcHViKHRoaXMuX3BhdGhUb1NvdXJjZSk7XG5cbiAgICBjb25zb2xlLmxvZyhcInBhdGhUb0VwdWJcIiwgdGhpcy5fcGF0aFRvRXB1YkRpcik7XG4gICAgaWYgKCF0aGlzLl9wYXRoVG9FcHViRGlyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZmluZCB0aGUgY29udGFpbmVyLnhtbCBmaWxlLlxuICAgIGNvbnN0IGNvbnRhaW5lckZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgdGhpcy5fcGF0aFRvRXB1YkRpcixcbiAgICAgIFwiLi9NRVRBLUlORi9jb250YWluZXIueG1sXCJcbiAgICApO1xuICAgIGNvbnN0IGNvbnRhaW5lckV4aXN0cyA9IGF3YWl0IEZpbGVNYW5hZ2VyLmZpbGVFeGlzdHMoY29udGFpbmVyRmlsZVBhdGgpO1xuXG4gICAgaWYgKCFjb250YWluZXJFeGlzdHMpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImNvbnRhaW5lci54bWwgbm90IGZvdW5kIGF0IDogXCIsIGNvbnRhaW5lckZpbGVQYXRoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXJEYXRhID0gYXdhaXQgRmlsZU1hbmFnZXIucmVhZEZpbGUoY29udGFpbmVyRmlsZVBhdGgpO1xuICAgIGlmIChjb250YWluZXJEYXRhKSB7XG4gICAgICBhd2FpdCB0aGlzLl9jb250YWluZXJNYW5hZ2VyLmxvYWRYbWwoY29udGFpbmVyRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciByZWFkaW5nIGNvbnRhaW5lci54bWwgZmlsZS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFBhdGggPSB0aGlzLl9jb250YWluZXJNYW5hZ2VyLnJvb3RGaWxlUGF0aDtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIE9QRiBmaWxlXG4gICAgICovXG4gICAgaWYgKHJvb3RQYXRoKSB7XG4gICAgICAvLyBpZiByb290UGF0aCBpcyBmb3VuZCBpbiB0aGUgY29udGFpbmVyLnhtbCB1c2UgdGhhdC5cbiAgICAgIHRoaXMuX29wZkZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMuX3BhdGhUb0VwdWJEaXIsIHJvb3RQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgY29udGFpbmVyWG1sIGlzIG1pc3Npbmcgb3IgaXMgbWlzc2luZyB0aGUgcm9vdEZpbGUsIGRvIGEgZmlsZSBzZWFyY2ggZm9yIHRoZSBvcGYuXG4gICAgICBjb25zdCBvcGZGaWxlUGF0aCA9IGF3YWl0IEZpbGVNYW5hZ2VyLmZpbmRGaWxlc1dpdGhFeHQoXG4gICAgICAgIHRoaXMuX3BhdGhUb0VwdWJEaXIsXG4gICAgICAgIFwib3BmXCJcbiAgICAgICk7XG4gICAgICBpZiAob3BmRmlsZVBhdGgubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJNb3JlIHRoYW4gb25lIE9QRiBmaWxlIGZvdW5kOiBcIiwgb3BmRmlsZVBhdGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fb3BmRmlsZVBhdGggPSBvcGZGaWxlUGF0aFswXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBsb2FkIHRoZSBPUEYgZmlsZVxuICAgICAqL1xuICAgIGlmICghdGhpcy5fb3BmRmlsZVBhdGgpIHtcbiAgICAgIHRoaXMuX29wZkZpbGVQYXRoID0gdW5kZWZpbmVkO1xuICAgICAgdGhyb3cgXCJPcGYgZmlsZSBub3QgZm91bmQuXCI7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9wZkRhdGEgPSBhd2FpdCBGaWxlTWFuYWdlci5yZWFkRmlsZSh0aGlzLl9vcGZGaWxlUGF0aCk7XG4gICAgICBhd2FpdCB0aGlzLl9wYWNrYWdlTWFuYWdlci5sb2FkWG1sKG9wZkRhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuX3BhY2thZ2VNYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiBuY3ggZmlsZSBleGlzdHMsIGluaXRpYWxpemUgdGhlIE5DWCBtYW5hZ2VyXG4gICAgICovXG4gICAgaWYgKHRoaXMuX3BhY2thZ2VNYW5hZ2VyKSB7XG4gICAgICBjb25zdCB0b2NQYXRoID0gdGhpcy5fcGFja2FnZU1hbmFnZXIuZmluZE5hdmlnYXRpb25GaWxlUGF0aCgpO1xuICAgICAgaWYgKHRvY1BhdGgpIHtcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbkZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgIHBhdGguZGlybmFtZSh0aGlzLl9vcGZGaWxlUGF0aCksXG4gICAgICAgICAgdG9jUGF0aFxuICAgICAgICApO1xuICAgICAgICBpZiAocGF0aC5leHRuYW1lKHRvY1BhdGgpID09PSBcIi5uY3hcIikge1xuICAgICAgICAgIHRoaXMuX25jeEZpbGVQYXRoID0gdGhpcy5fbmF2aWdhdGlvbkZpbGVQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbmN4IGlzIG5vdCBsaXN0ZWQgaW4gdGhlIFRPQyBpbiB0aGUgb3BmLiBsb29rIGZvciBuY3ggc3BlY2lmaWNhbGx5LlxuICAgIGlmICghdGhpcy5fbmN4RmlsZVBhdGgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX25jeEZpbGVQYXRoID0gdGhpcy5fcGFja2FnZU1hbmFnZXIuZmluZE5jeEZpbGVQYXRoKCk7XG4gICAgICAgIGlmICh0aGlzLl9uY3hGaWxlUGF0aCkge1xuICAgICAgICAgIHRoaXMuX25jeEZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHRoaXMuX29wZkZpbGVQYXRoKSxcbiAgICAgICAgICAgIHRoaXMuX25jeEZpbGVQYXRoXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBlcHViIG1heSBub3QgaGF2ZSBhbiBuY3ggZmlsZS5cbiAgICAgICAgdGhpcy5fbmN4RmlsZVBhdGggPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX25jeEZpbGVQYXRoKSB7XG4gICAgICBjb25zdCBuY3hEYXRhID0gYXdhaXQgRmlsZU1hbmFnZXIucmVhZFhtbEZpbGUodGhpcy5fbmN4RmlsZVBhdGgpO1xuICAgICAgaWYgKG5jeERhdGEpIHtcbiAgICAgICAgdGhpcy5fbmN4TWFuYWdlci5pbml0KG5jeERhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbmN4TWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9sb2FkZWQgPSB0cnVlO1xuICB9XG5cbiAgYXN5bmMgc2F2ZUFzKGxvY2F0aW9uKSB7XG4gICAgYXdhaXQgRmlsZU1hbmFnZXIuc2F2ZUVwdWJBcmNoaXZlKHRoaXMuX3BhdGhUb0VwdWJEaXIsIGxvY2F0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgR2V0dGVycyBhbmQgU2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogR2V0IHRoZSBlcHViIGlucHV0IHBhdGhcbiAgICovXG4gIGdldCBwYXRoVG9Tb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhdGhUb1NvdXJjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGVwdWIgd29ya2luZyBkaXJlY3RvcnkuXG4gICAqIE5vZGU6IFdoZW4gZXB1YiBpcyBhbiBhcmNoaXZlLCBpdCB3aWxsIGJlIGRlY29tcHJlc3NlZCB0byB0aGlzIHRtcCBsb2NhdGlvbi5cbiAgICogQ2xpZW50OiBXaGVuIGVwdWIgaXMgYW4gYXJjaGl2ZSwgQnJvd3NlckZTIHdpbGwgbG9hZCB0aGUgemlwIGF0IHRoaXMgdmlydHVhbCBwYXRoLlxuICAgKi9cbiAgZ2V0IHBhdGhUb0VwdWJEaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhdGhUb0VwdWJEaXI7XG4gIH1cblxuICBnZXQgbmN4KCkge1xuICAgIHJldHVybiB0aGlzLl9uY3hNYW5hZ2VyO1xuICB9XG5cbiAgZ2V0IG9wZigpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFja2FnZU1hbmFnZXI7XG4gIH1cblxuICBnZXQgb3BmRmlsZVBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wZkZpbGVQYXRoO1xuICB9XG5cbiAgZ2V0IG5jeEZpbGVQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLl9uY3hGaWxlUGF0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFcHVia2l0O1xuIl19
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _path = _interopRequireDefault(require("path"));
var _uuid = require("uuid");
var _fileManager = _interopRequireDefault(require("./file-manager"));
var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageMetadata = _interopRequireDefault(require("./package-metadata"));
var _packageManifest = _interopRequireDefault(require("./package-manifest"));
var _packageSpine = _interopRequireDefault(require("./package-spine"));
var _xml = require("./utils/xml");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _iterableToArrayLimit(arr, i) {if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}






/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Package manager to create and edit opf files.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * https://www.w3.org/publishing/epub32/epub-packages.html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */var
PackageManager = /*#__PURE__*/function (_PackageElement) {_inherits(PackageManager, _PackageElement);var _super = _createSuper(PackageManager);
  function PackageManager() {var _this;var locationInEpub = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";_classCallCheck(this, PackageManager);
    _this = _super.call(this, "package", undefined, {
      xmlns: "http://www.idpf.org/2007/opf",
      dir: undefined,
      id: undefined,
      prefix: undefined,
      "xml:lang": undefined,
      "unique-identifier": undefined,
      version: "3.0" });


    _this._location = locationInEpub; // the path relative to the epub root.
    _this.metadata = undefined;
    _this.manifest = undefined;
    _this.spine = undefined;
    _this.rawData = undefined;return _this;
  }_createClass(PackageManager, [{ key: "setUniqueIdentifier",












    /**
                                                                * Set the unique identifier of the ebook. This sets both the package
                                                                * 'unique-identifier' id value which refers to a meta tag as well as the
                                                                * meta tag value and id.
                                                                * Note that the uid has side-effects with epub font obfuscation. The UID
                                                                * is used as the obfuscation key and obfuscated fonts must be
                                                                * re-processed when changing this value.
                                                                * @param {string} value the UUID or other unique identifier
                                                                * @param {string} id - the id of the meta tag that marks it as the uid.
                                                                */value: function setUniqueIdentifier(
    value) {var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "pub-id";
      var existingId = this.attributes["unique-identifier"];
      this.attributes["unique-identifier"] = id;

      var uidMetadata = existingId ?
      this.metadata.findItemWithId("dc:identifier", existingId) :
      undefined;

      if (uidMetadata) {
        uidMetadata.value = value;
        uidMetadata.id = id;
      } else {
        this.metadata.addItem("dc:identifier", value, { id: id });
      }
    }

    /**
       * Find the epub unique-identifer value
       */ }, { key: "findUniqueIdentifier", value: function findUniqueIdentifier()
    {
      var metadataId = this.attributes["unique-identifier"];
      if (metadataId) {
        var uidMetadata = this.metadata.findItemWithId(
        "dc:identifier",
        metadataId);

        if (uidMetadata) {
          return uidMetadata.value;
        }
      }
    }

    /**
       * Legacy Epub 2.0 specification states that a spine element with the 'toc' attribute
       * identifies the idref of the NCX file in the manifest
       * TODO - handle relative and absolute urls. resolve path
       */ }, { key: "findNcxFilePath", value: function findNcxFilePath()
    {
      var tocId = this.spine.toc;
      if (tocId) {
        var ncxItem = this.manifest.findItemWithId(tocId);
        if (ncxItem) {
          return _fileManager["default"].resolveIriToEpubLocation(
          ncxItem.href,
          this.location);

        }
      }
      return;
    }

    /**
       * Find the href of the manifest item with properties="nav" attribute
       * https://www.w3.org/publishing/epub32/epub-packages.html#sec-package-nav
       * TODO - handle relative and absolute urls. resolve path
       */ }, { key: "findNavigationFilePath", value: function findNavigationFilePath()
    {
      var spineItem = this.manifest.findNav();
      if (spineItem) {
        return _fileManager["default"].resolveIriToEpubLocation(
        spineItem.href,
        this.location);

      }
      return;
    }

    /**
       * Initialize a new empty package.
       */ }, { key: "create", value: function create()
    {
      var uuid = "urn:uuid:".concat((0, _uuid.v4)());

      this.metadata = new _packageMetadata["default"]();
      this.manifest = new _packageManifest["default"]();
      this.spine = new _packageSpine["default"]();
      this.setUniqueIdentifier(uuid);
    }

    /**
       * Initialize a new package object using the provided xml.
       * @param {string | buffer} data - the xml data
       */ }, { key: "loadXml", value: function () {var _loadXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
      data) {var result, rawMetadata, formatedMetadata, rawManifest, manifestItems, rawSpine, spineItems;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                  (0, _xml.parseXml)(data));case 2:result = _context.sent;

                if (result) {
                  this.rawData = result;

                  if (this.rawData["package"].attr) {
                    this.addAttributes(this.rawData["package"].attr);
                  }

                  // construct metadata section
                  rawMetadata = result["package"].metadata[0];
                  formatedMetadata = Object.entries(rawMetadata).flatMap(
                  function (_ref) {var _ref2 = _slicedToArray(_ref, 2),key = _ref2[0],value = _ref2[1];
                    if (key === "attr") return [];
                    if (Array.isArray(value)) {
                      return value.flatMap(function (entry) {
                        return {
                          element: key,
                          value: entry === null || entry === void 0 ? void 0 : entry.val,
                          attributes: entry === null || entry === void 0 ? void 0 : entry.attr };

                      });
                    }
                  });


                  this.metadata = new _packageMetadata["default"](formatedMetadata, rawMetadata === null || rawMetadata === void 0 ? void 0 : rawMetadata.attr);

                  // construct the manifest section
                  rawManifest = result["package"].manifest[0];
                  manifestItems = Object.entries(rawManifest).flatMap(
                  function (_ref3) {var _ref4 = _slicedToArray(_ref3, 2),key = _ref4[0],value = _ref4[1];
                    if (key === "attr") return [];
                    if (Array.isArray(value)) {
                      return value.flatMap(function (entry) {
                        return entry.attr;
                      });
                    }
                  });


                  this.manifest = new _packageManifest["default"](
                  manifestItems,
                  rawManifest === null || rawManifest === void 0 ? void 0 : rawManifest.attr,
                  this._location);


                  // construct the manifest section
                  rawSpine = result["package"].spine[0];
                  spineItems = Object.entries(rawSpine).flatMap(function (_ref5) {var _ref6 = _slicedToArray(_ref5, 2),key = _ref6[0],value = _ref6[1];
                    if (key === "attr") return [];
                    if (Array.isArray(value)) {
                      return value.flatMap(function (entry) {
                        return entry.attr;
                      });
                    }
                  });

                  this.spine = new _packageSpine["default"](spineItems, rawSpine === null || rawSpine === void 0 ? void 0 : rawSpine.attr);
                } else {
                  console.error("Error parsing XML");
                }case 4:case "end":return _context.stop();}}}, _callee, this);}));function loadXml(_x) {return _loadXml.apply(this, arguments);}return loadXml;}()


    /**
                                                                                                                                                                    * Get the xml string data
                                                                                                                                                                    * @returns {string}
                                                                                                                                                                    */ }, { key: "getXml", value: function () {var _getXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var xml;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (

                  (0, _xml.generateXml)(this.getXml2JsObject()));case 2:xml = _context2.sent;return _context2.abrupt("return",
                xml);case 4:case "end":return _context2.stop();}}}, _callee2, this);}));function getXml() {return _getXml.apply(this, arguments);}return getXml;}()


    /**
                                                                                                                                                                     * Build the xml2Js object for conversion to raw xml
                                                                                                                                                                     * @returns {object}
                                                                                                                                                                     */ }, { key: "getXml2JsObject", value: function getXml2JsObject()
    {
      var filterAttributes = function filterAttributes(attributes) {
        if (Object.keys(attributes).length) {
          var attr = Object.entries(attributes).
          filter(function (_ref7) {var _ref8 = _slicedToArray(_ref7, 2),key = _ref8[0],value = _ref8[1];
            return value !== undefined;
          }).
          reduce(function (obj, _ref9) {var _ref10 = _slicedToArray(_ref9, 2),key = _ref10[0],value = _ref10[1];
            obj[key] = attributes[key];
            return obj;
          }, {});

          if (Object.keys(attr).length) {
            return attr;
          }
        }
        return undefined;
      };

      var prepareChildrenForXml = function prepareChildrenForXml(items) {
        var dataList = {};
        items.forEach(function (item) {
          var data = {};
          if (item.attributes) {
            var attr = filterAttributes(item.attributes);
            if (attr) {
              data.attr = attr;
            }
          }
          if (item.value) {
            data.val = item.value;
          }
          if (Array.isArray(dataList[item.element])) {
            dataList[item.element].push(data);
          } else {
            dataList[item.element] = [data];
          }
        });
        return dataList;
      };

      /* Metadata */
      var xmlJsMetadata = prepareChildrenForXml(this.metadata.items);
      var metadataAttr = filterAttributes(this.metadata.attributes);

      if (metadataAttr) {
        xmlJsMetadata.attr = metadataAttr;
      }

      /* Manifest */
      var xmlJsManifest = prepareChildrenForXml(this.manifest.items);
      var manifestAttr = filterAttributes(this.manifest.attributes);

      if (manifestAttr) {
        xmlJsManifest.attr = manifestAttr;
      }

      /* Spine */
      var xmlJsSpine = prepareChildrenForXml(this.spine.items);
      var spineAttr = filterAttributes(this.manifest.attributes);

      if (spineAttr) {
        xmlJsSpine.attr = spineAttr;
      }

      return {
        "package": {
          attr: filterAttributes(this.attributes),
          metadata: [xmlJsMetadata],
          manifest: [xmlJsManifest],
          spine: [xmlJsSpine] } };


    } }, { key: "location", set: function set(locationInEpub) {this._location = locationInEpub; // the path relative to the epub root.
      if (this.manifest) {this.manifest.location = locationInEpub;}}, get: function get() {return this._location;} }]);return PackageManager;}(_packageElement["default"]);exports["default"] = PackageManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiUGFja2FnZU1hbmFnZXIiLCJsb2NhdGlvbkluRXB1YiIsInVuZGVmaW5lZCIsInhtbG5zIiwiZGlyIiwiaWQiLCJwcmVmaXgiLCJ2ZXJzaW9uIiwiX2xvY2F0aW9uIiwibWV0YWRhdGEiLCJtYW5pZmVzdCIsInNwaW5lIiwicmF3RGF0YSIsInZhbHVlIiwiZXhpc3RpbmdJZCIsImF0dHJpYnV0ZXMiLCJ1aWRNZXRhZGF0YSIsImZpbmRJdGVtV2l0aElkIiwiYWRkSXRlbSIsIm1ldGFkYXRhSWQiLCJ0b2NJZCIsInRvYyIsIm5jeEl0ZW0iLCJGaWxlTWFuYWdlciIsInJlc29sdmVJcmlUb0VwdWJMb2NhdGlvbiIsImhyZWYiLCJsb2NhdGlvbiIsInNwaW5lSXRlbSIsImZpbmROYXYiLCJ1dWlkIiwiUGFja2FnZU1ldGFkYXRhIiwiUGFja2FnZU1hbmlmZXN0IiwiUGFja2FnZVNwaW5lIiwic2V0VW5pcXVlSWRlbnRpZmllciIsImRhdGEiLCJyZXN1bHQiLCJhdHRyIiwiYWRkQXR0cmlidXRlcyIsInJhd01ldGFkYXRhIiwiZm9ybWF0ZWRNZXRhZGF0YSIsIk9iamVjdCIsImVudHJpZXMiLCJmbGF0TWFwIiwia2V5IiwiQXJyYXkiLCJpc0FycmF5IiwiZW50cnkiLCJlbGVtZW50IiwidmFsIiwicmF3TWFuaWZlc3QiLCJtYW5pZmVzdEl0ZW1zIiwicmF3U3BpbmUiLCJzcGluZUl0ZW1zIiwiY29uc29sZSIsImVycm9yIiwiZ2V0WG1sMkpzT2JqZWN0IiwieG1sIiwiZmlsdGVyQXR0cmlidXRlcyIsImtleXMiLCJsZW5ndGgiLCJmaWx0ZXIiLCJyZWR1Y2UiLCJvYmoiLCJwcmVwYXJlQ2hpbGRyZW5Gb3JYbWwiLCJpdGVtcyIsImRhdGFMaXN0IiwiZm9yRWFjaCIsIml0ZW0iLCJwdXNoIiwieG1sSnNNZXRhZGF0YSIsIm1ldGFkYXRhQXR0ciIsInhtbEpzTWFuaWZlc3QiLCJtYW5pZmVzdEF0dHIiLCJ4bWxKc1NwaW5lIiwic3BpbmVBdHRyIiwiUGFja2FnZUVsZW1lbnQiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDOzs7Ozs7O0FBT0E7Ozs7QUFJcUJBLGM7QUFDbkIsNEJBQWlDLGVBQXJCQyxjQUFxQix1RUFBSixFQUFJO0FBQy9CLDhCQUFNLFNBQU4sRUFBaUJDLFNBQWpCLEVBQTRCO0FBQzFCQyxNQUFBQSxLQUFLLEVBQUUsOEJBRG1CO0FBRTFCQyxNQUFBQSxHQUFHLEVBQUVGLFNBRnFCO0FBRzFCRyxNQUFBQSxFQUFFLEVBQUVILFNBSHNCO0FBSTFCSSxNQUFBQSxNQUFNLEVBQUVKLFNBSmtCO0FBSzFCLGtCQUFZQSxTQUxjO0FBTTFCLDJCQUFxQkEsU0FOSztBQU8xQkssTUFBQUEsT0FBTyxFQUFFLEtBUGlCLEVBQTVCOzs7QUFVQSxVQUFLQyxTQUFMLEdBQWlCUCxjQUFqQixDQVgrQixDQVdFO0FBQ2pDLFVBQUtRLFFBQUwsR0FBZ0JQLFNBQWhCO0FBQ0EsVUFBS1EsUUFBTCxHQUFnQlIsU0FBaEI7QUFDQSxVQUFLUyxLQUFMLEdBQWFULFNBQWI7QUFDQSxVQUFLVSxPQUFMLEdBQWVWLFNBQWYsQ0FmK0I7QUFnQmhDLEc7Ozs7Ozs7Ozs7Ozs7QUFhRDs7Ozs7Ozs7OztBQVVvQlcsSUFBQUEsSyxFQUFzQixLQUFmUixFQUFlLHVFQUFWLFFBQVU7QUFDeEMsVUFBTVMsVUFBVSxHQUFHLEtBQUtDLFVBQUwsQ0FBZ0IsbUJBQWhCLENBQW5CO0FBQ0EsV0FBS0EsVUFBTCxDQUFnQixtQkFBaEIsSUFBdUNWLEVBQXZDOztBQUVBLFVBQU1XLFdBQVcsR0FBR0YsVUFBVTtBQUMxQixXQUFLTCxRQUFMLENBQWNRLGNBQWQsQ0FBNkIsZUFBN0IsRUFBOENILFVBQTlDLENBRDBCO0FBRTFCWixNQUFBQSxTQUZKOztBQUlBLFVBQUljLFdBQUosRUFBaUI7QUFDZkEsUUFBQUEsV0FBVyxDQUFDSCxLQUFaLEdBQW9CQSxLQUFwQjtBQUNBRyxRQUFBQSxXQUFXLENBQUNYLEVBQVosR0FBaUJBLEVBQWpCO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBS0ksUUFBTCxDQUFjUyxPQUFkLENBQXNCLGVBQXRCLEVBQXVDTCxLQUF2QyxFQUE4QyxFQUFFUixFQUFFLEVBQUVBLEVBQU4sRUFBOUM7QUFDRDtBQUNGOztBQUVEOzs7QUFHdUI7QUFDckIsVUFBTWMsVUFBVSxHQUFHLEtBQUtKLFVBQUwsQ0FBZ0IsbUJBQWhCLENBQW5CO0FBQ0EsVUFBSUksVUFBSixFQUFnQjtBQUNkLFlBQU1ILFdBQVcsR0FBRyxLQUFLUCxRQUFMLENBQWNRLGNBQWQ7QUFDbEIsdUJBRGtCO0FBRWxCRSxRQUFBQSxVQUZrQixDQUFwQjs7QUFJQSxZQUFJSCxXQUFKLEVBQWlCO0FBQ2YsaUJBQU9BLFdBQVcsQ0FBQ0gsS0FBbkI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7Ozs7O0FBS2tCO0FBQ2hCLFVBQU1PLEtBQUssR0FBRyxLQUFLVCxLQUFMLENBQVdVLEdBQXpCO0FBQ0EsVUFBSUQsS0FBSixFQUFXO0FBQ1QsWUFBTUUsT0FBTyxHQUFHLEtBQUtaLFFBQUwsQ0FBY08sY0FBZCxDQUE2QkcsS0FBN0IsQ0FBaEI7QUFDQSxZQUFJRSxPQUFKLEVBQWE7QUFDWCxpQkFBT0Msd0JBQVlDLHdCQUFaO0FBQ0xGLFVBQUFBLE9BQU8sQ0FBQ0csSUFESDtBQUVMLGVBQUtDLFFBRkEsQ0FBUDs7QUFJRDtBQUNGO0FBQ0Q7QUFDRDs7QUFFRDs7Ozs7QUFLeUI7QUFDdkIsVUFBTUMsU0FBUyxHQUFHLEtBQUtqQixRQUFMLENBQWNrQixPQUFkLEVBQWxCO0FBQ0EsVUFBSUQsU0FBSixFQUFlO0FBQ2IsZUFBT0osd0JBQVlDLHdCQUFaO0FBQ0xHLFFBQUFBLFNBQVMsQ0FBQ0YsSUFETDtBQUVMLGFBQUtDLFFBRkEsQ0FBUDs7QUFJRDtBQUNEO0FBQ0Q7O0FBRUQ7OztBQUdTO0FBQ1AsVUFBTUcsSUFBSSxzQkFBZSxlQUFmLENBQVY7O0FBRUEsV0FBS3BCLFFBQUwsR0FBZ0IsSUFBSXFCLDJCQUFKLEVBQWhCO0FBQ0EsV0FBS3BCLFFBQUwsR0FBZ0IsSUFBSXFCLDJCQUFKLEVBQWhCO0FBQ0EsV0FBS3BCLEtBQUwsR0FBYSxJQUFJcUIsd0JBQUosRUFBYjtBQUNBLFdBQUtDLG1CQUFMLENBQXlCSixJQUF6QjtBQUNEOztBQUVEOzs7O0FBSWNLLE1BQUFBLEk7QUFDUyxxQ0FBU0EsSUFBVCxDLFNBQWZDLE07O0FBRU4sb0JBQUlBLE1BQUosRUFBWTtBQUNWLHVCQUFLdkIsT0FBTCxHQUFldUIsTUFBZjs7QUFFQSxzQkFBSSxLQUFLdkIsT0FBTCxZQUFxQndCLElBQXpCLEVBQStCO0FBQzdCLHlCQUFLQyxhQUFMLENBQW1CLEtBQUt6QixPQUFMLFlBQXFCd0IsSUFBeEM7QUFDRDs7QUFFRDtBQUNNRSxrQkFBQUEsV0FSSSxHQVFVSCxNQUFNLFdBQU4sQ0FBZTFCLFFBQWYsQ0FBd0IsQ0FBeEIsQ0FSVjtBQVNKOEIsa0JBQUFBLGdCQVRJLEdBU2VDLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlSCxXQUFmLEVBQTRCSSxPQUE1QjtBQUN2QixrQ0FBa0IscUNBQWhCQyxHQUFnQixZQUFYOUIsS0FBVztBQUNoQix3QkFBSThCLEdBQUcsS0FBSyxNQUFaLEVBQW9CLE9BQU8sRUFBUDtBQUNwQix3QkFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNoQyxLQUFkLENBQUosRUFBMEI7QUFDeEIsNkJBQU9BLEtBQUssQ0FBQzZCLE9BQU4sQ0FBYyxVQUFDSSxLQUFELEVBQVc7QUFDOUIsK0JBQU87QUFDTEMsMEJBQUFBLE9BQU8sRUFBRUosR0FESjtBQUVMOUIsMEJBQUFBLEtBQUssRUFBRWlDLEtBQUYsYUFBRUEsS0FBRix1QkFBRUEsS0FBSyxDQUFFRSxHQUZUO0FBR0xqQywwQkFBQUEsVUFBVSxFQUFFK0IsS0FBRixhQUFFQSxLQUFGLHVCQUFFQSxLQUFLLENBQUVWLElBSGQsRUFBUDs7QUFLRCx1QkFOTSxDQUFQO0FBT0Q7QUFDRixtQkFac0IsQ0FUZjs7O0FBd0JWLHVCQUFLM0IsUUFBTCxHQUFnQixJQUFJcUIsMkJBQUosQ0FBb0JTLGdCQUFwQixFQUFzQ0QsV0FBdEMsYUFBc0NBLFdBQXRDLHVCQUFzQ0EsV0FBVyxDQUFFRixJQUFuRCxDQUFoQjs7QUFFQTtBQUNNYSxrQkFBQUEsV0EzQkksR0EyQlVkLE1BQU0sV0FBTixDQUFlekIsUUFBZixDQUF3QixDQUF4QixDQTNCVjtBQTRCSndDLGtCQUFBQSxhQTVCSSxHQTRCWVYsTUFBTSxDQUFDQyxPQUFQLENBQWVRLFdBQWYsRUFBNEJQLE9BQTVCO0FBQ3BCLG1DQUFrQixzQ0FBaEJDLEdBQWdCLFlBQVg5QixLQUFXO0FBQ2hCLHdCQUFJOEIsR0FBRyxLQUFLLE1BQVosRUFBb0IsT0FBTyxFQUFQO0FBQ3BCLHdCQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY2hDLEtBQWQsQ0FBSixFQUEwQjtBQUN4Qiw2QkFBT0EsS0FBSyxDQUFDNkIsT0FBTixDQUFjLFVBQUNJLEtBQUQsRUFBVztBQUM5QiwrQkFBT0EsS0FBSyxDQUFDVixJQUFiO0FBQ0QsdUJBRk0sQ0FBUDtBQUdEO0FBQ0YsbUJBUm1CLENBNUJaOzs7QUF1Q1YsdUJBQUsxQixRQUFMLEdBQWdCLElBQUlxQiwyQkFBSjtBQUNkbUIsa0JBQUFBLGFBRGM7QUFFZEQsa0JBQUFBLFdBRmMsYUFFZEEsV0FGYyx1QkFFZEEsV0FBVyxDQUFFYixJQUZDO0FBR2QsdUJBQUs1QixTQUhTLENBQWhCOzs7QUFNQTtBQUNNMkMsa0JBQUFBLFFBOUNJLEdBOENPaEIsTUFBTSxXQUFOLENBQWV4QixLQUFmLENBQXFCLENBQXJCLENBOUNQO0FBK0NKeUMsa0JBQUFBLFVBL0NJLEdBK0NTWixNQUFNLENBQUNDLE9BQVAsQ0FBZVUsUUFBZixFQUF5QlQsT0FBekIsQ0FBaUMsaUJBQWtCLHNDQUFoQkMsR0FBZ0IsWUFBWDlCLEtBQVc7QUFDcEUsd0JBQUk4QixHQUFHLEtBQUssTUFBWixFQUFvQixPQUFPLEVBQVA7QUFDcEIsd0JBQUlDLEtBQUssQ0FBQ0MsT0FBTixDQUFjaEMsS0FBZCxDQUFKLEVBQTBCO0FBQ3hCLDZCQUFPQSxLQUFLLENBQUM2QixPQUFOLENBQWMsVUFBQ0ksS0FBRCxFQUFXO0FBQzlCLCtCQUFPQSxLQUFLLENBQUNWLElBQWI7QUFDRCx1QkFGTSxDQUFQO0FBR0Q7QUFDRixtQkFQa0IsQ0EvQ1Q7O0FBd0RWLHVCQUFLekIsS0FBTCxHQUFhLElBQUlxQix3QkFBSixDQUFpQm9CLFVBQWpCLEVBQTZCRCxRQUE3QixhQUE2QkEsUUFBN0IsdUJBQTZCQSxRQUFRLENBQUVmLElBQXZDLENBQWI7QUFDRCxpQkF6REQsTUF5RE87QUFDTGlCLGtCQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxtQkFBZDtBQUNELGlCOzs7QUFHSDs7Ozs7QUFLb0Isd0NBQVksS0FBS0MsZUFBTCxFQUFaLEMsU0FBWkMsRztBQUNDQSxnQkFBQUEsRzs7O0FBR1Q7Ozs7QUFJa0I7QUFDaEIsVUFBTUMsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQixDQUFDMUMsVUFBRCxFQUFnQjtBQUN2QyxZQUFJeUIsTUFBTSxDQUFDa0IsSUFBUCxDQUFZM0MsVUFBWixFQUF3QjRDLE1BQTVCLEVBQW9DO0FBQ2xDLGNBQU12QixJQUFJLEdBQUdJLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlMUIsVUFBZjtBQUNWNkMsVUFBQUEsTUFEVSxDQUNILGlCQUFrQixzQ0FBaEJqQixHQUFnQixZQUFYOUIsS0FBVztBQUN4QixtQkFBT0EsS0FBSyxLQUFLWCxTQUFqQjtBQUNELFdBSFU7QUFJVjJELFVBQUFBLE1BSlUsQ0FJSCxVQUFDQyxHQUFELFNBQXVCLHVDQUFoQm5CLEdBQWdCLGFBQVg5QixLQUFXO0FBQzdCaUQsWUFBQUEsR0FBRyxDQUFDbkIsR0FBRCxDQUFILEdBQVc1QixVQUFVLENBQUM0QixHQUFELENBQXJCO0FBQ0EsbUJBQU9tQixHQUFQO0FBQ0QsV0FQVSxFQU9SLEVBUFEsQ0FBYjs7QUFTQSxjQUFJdEIsTUFBTSxDQUFDa0IsSUFBUCxDQUFZdEIsSUFBWixFQUFrQnVCLE1BQXRCLEVBQThCO0FBQzVCLG1CQUFPdkIsSUFBUDtBQUNEO0FBQ0Y7QUFDRCxlQUFPbEMsU0FBUDtBQUNELE9BaEJEOztBQWtCQSxVQUFNNkQscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixDQUFDQyxLQUFELEVBQVc7QUFDdkMsWUFBTUMsUUFBUSxHQUFHLEVBQWpCO0FBQ0FELFFBQUFBLEtBQUssQ0FBQ0UsT0FBTixDQUFjLFVBQUNDLElBQUQsRUFBVTtBQUN0QixjQUFNakMsSUFBSSxHQUFHLEVBQWI7QUFDQSxjQUFJaUMsSUFBSSxDQUFDcEQsVUFBVCxFQUFxQjtBQUNuQixnQkFBTXFCLElBQUksR0FBR3FCLGdCQUFnQixDQUFDVSxJQUFJLENBQUNwRCxVQUFOLENBQTdCO0FBQ0EsZ0JBQUlxQixJQUFKLEVBQVU7QUFDUkYsY0FBQUEsSUFBSSxDQUFDRSxJQUFMLEdBQVlBLElBQVo7QUFDRDtBQUNGO0FBQ0QsY0FBSStCLElBQUksQ0FBQ3RELEtBQVQsRUFBZ0I7QUFDZHFCLFlBQUFBLElBQUksQ0FBQ2MsR0FBTCxHQUFXbUIsSUFBSSxDQUFDdEQsS0FBaEI7QUFDRDtBQUNELGNBQUkrQixLQUFLLENBQUNDLE9BQU4sQ0FBY29CLFFBQVEsQ0FBQ0UsSUFBSSxDQUFDcEIsT0FBTixDQUF0QixDQUFKLEVBQTJDO0FBQ3pDa0IsWUFBQUEsUUFBUSxDQUFDRSxJQUFJLENBQUNwQixPQUFOLENBQVIsQ0FBdUJxQixJQUF2QixDQUE0QmxDLElBQTVCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wrQixZQUFBQSxRQUFRLENBQUNFLElBQUksQ0FBQ3BCLE9BQU4sQ0FBUixHQUF5QixDQUFDYixJQUFELENBQXpCO0FBQ0Q7QUFDRixTQWhCRDtBQWlCQSxlQUFPK0IsUUFBUDtBQUNELE9BcEJEOztBQXNCQTtBQUNBLFVBQUlJLGFBQWEsR0FBR04scUJBQXFCLENBQUMsS0FBS3RELFFBQUwsQ0FBY3VELEtBQWYsQ0FBekM7QUFDQSxVQUFNTSxZQUFZLEdBQUdiLGdCQUFnQixDQUFDLEtBQUtoRCxRQUFMLENBQWNNLFVBQWYsQ0FBckM7O0FBRUEsVUFBSXVELFlBQUosRUFBa0I7QUFDaEJELFFBQUFBLGFBQWEsQ0FBQ2pDLElBQWQsR0FBcUJrQyxZQUFyQjtBQUNEOztBQUVEO0FBQ0EsVUFBSUMsYUFBYSxHQUFHUixxQkFBcUIsQ0FBQyxLQUFLckQsUUFBTCxDQUFjc0QsS0FBZixDQUF6QztBQUNBLFVBQU1RLFlBQVksR0FBR2YsZ0JBQWdCLENBQUMsS0FBSy9DLFFBQUwsQ0FBY0ssVUFBZixDQUFyQzs7QUFFQSxVQUFJeUQsWUFBSixFQUFrQjtBQUNoQkQsUUFBQUEsYUFBYSxDQUFDbkMsSUFBZCxHQUFxQm9DLFlBQXJCO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJQyxVQUFVLEdBQUdWLHFCQUFxQixDQUFDLEtBQUtwRCxLQUFMLENBQVdxRCxLQUFaLENBQXRDO0FBQ0EsVUFBTVUsU0FBUyxHQUFHakIsZ0JBQWdCLENBQUMsS0FBSy9DLFFBQUwsQ0FBY0ssVUFBZixDQUFsQzs7QUFFQSxVQUFJMkQsU0FBSixFQUFlO0FBQ2JELFFBQUFBLFVBQVUsQ0FBQ3JDLElBQVgsR0FBa0JzQyxTQUFsQjtBQUNEOztBQUVELGFBQU87QUFDTCxtQkFBUztBQUNQdEMsVUFBQUEsSUFBSSxFQUFFcUIsZ0JBQWdCLENBQUMsS0FBSzFDLFVBQU4sQ0FEZjtBQUVQTixVQUFBQSxRQUFRLEVBQUUsQ0FBQzRELGFBQUQsQ0FGSDtBQUdQM0QsVUFBQUEsUUFBUSxFQUFFLENBQUM2RCxhQUFELENBSEg7QUFJUDVELFVBQUFBLEtBQUssRUFBRSxDQUFDOEQsVUFBRCxDQUpBLEVBREosRUFBUDs7O0FBUUQsSyx5Q0EvUFl4RSxjLEVBQWdCLENBQzNCLEtBQUtPLFNBQUwsR0FBaUJQLGNBQWpCLENBRDJCLENBQ007QUFDakMsVUFBSSxLQUFLUyxRQUFULEVBQW1CLENBQ2pCLEtBQUtBLFFBQUwsQ0FBY2dCLFFBQWQsR0FBeUJ6QixjQUF6QixDQUNELENBQ0YsQyxzQkFFYyxDQUNiLE9BQU8sS0FBS08sU0FBWixDQUNELEMsNkJBNUJ5Q21FLDBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XG5pbXBvcnQgRmlsZU1hbmFnZXIgZnJvbSBcIi4vZmlsZS1tYW5hZ2VyXCI7XG5pbXBvcnQgUGFja2FnZUVsZW1lbnQgZnJvbSBcIi4vcGFja2FnZS1lbGVtZW50XCI7XG5pbXBvcnQgUGFja2FnZU1ldGFkYXRhIGZyb20gXCIuL3BhY2thZ2UtbWV0YWRhdGFcIjtcbmltcG9ydCBQYWNrYWdlTWFuaWZlc3QgZnJvbSBcIi4vcGFja2FnZS1tYW5pZmVzdFwiO1xuaW1wb3J0IFBhY2thZ2VTcGluZSBmcm9tIFwiLi9wYWNrYWdlLXNwaW5lXCI7XG5pbXBvcnQge1xuICBwYXJzZVhtbCxcbiAgZ2VuZXJhdGVYbWwsXG4gIGZpbHRlckF0dHJpYnV0ZXMsXG4gIHByZXBhcmVJdGVtc0ZvclhtbCxcbn0gZnJvbSBcIi4vdXRpbHMveG1sXCI7XG5cbi8qKlxuICogUGFja2FnZSBtYW5hZ2VyIHRvIGNyZWF0ZSBhbmQgZWRpdCBvcGYgZmlsZXMuXG4gKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VNYW5hZ2VyIGV4dGVuZHMgUGFja2FnZUVsZW1lbnQge1xuICBjb25zdHJ1Y3Rvcihsb2NhdGlvbkluRXB1YiA9IFwiXCIpIHtcbiAgICBzdXBlcihcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB7XG4gICAgICB4bWxuczogXCJodHRwOi8vd3d3LmlkcGYub3JnLzIwMDcvb3BmXCIsXG4gICAgICBkaXI6IHVuZGVmaW5lZCxcbiAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgICBwcmVmaXg6IHVuZGVmaW5lZCxcbiAgICAgIFwieG1sOmxhbmdcIjogdW5kZWZpbmVkLFxuICAgICAgXCJ1bmlxdWUtaWRlbnRpZmllclwiOiB1bmRlZmluZWQsXG4gICAgICB2ZXJzaW9uOiBcIjMuMFwiLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fbG9jYXRpb24gPSBsb2NhdGlvbkluRXB1YjsgLy8gdGhlIHBhdGggcmVsYXRpdmUgdG8gdGhlIGVwdWIgcm9vdC5cbiAgICB0aGlzLm1ldGFkYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubWFuaWZlc3QgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zcGluZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJhd0RhdGEgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQgbG9jYXRpb24obG9jYXRpb25JbkVwdWIpIHtcbiAgICB0aGlzLl9sb2NhdGlvbiA9IGxvY2F0aW9uSW5FcHViOyAvLyB0aGUgcGF0aCByZWxhdGl2ZSB0byB0aGUgZXB1YiByb290LlxuICAgIGlmICh0aGlzLm1hbmlmZXN0KSB7XG4gICAgICB0aGlzLm1hbmlmZXN0LmxvY2F0aW9uID0gbG9jYXRpb25JbkVwdWI7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBlYm9vay4gVGhpcyBzZXRzIGJvdGggdGhlIHBhY2thZ2VcbiAgICogJ3VuaXF1ZS1pZGVudGlmaWVyJyBpZCB2YWx1ZSB3aGljaCByZWZlcnMgdG8gYSBtZXRhIHRhZyBhcyB3ZWxsIGFzIHRoZVxuICAgKiBtZXRhIHRhZyB2YWx1ZSBhbmQgaWQuXG4gICAqIE5vdGUgdGhhdCB0aGUgdWlkIGhhcyBzaWRlLWVmZmVjdHMgd2l0aCBlcHViIGZvbnQgb2JmdXNjYXRpb24uIFRoZSBVSURcbiAgICogaXMgdXNlZCBhcyB0aGUgb2JmdXNjYXRpb24ga2V5IGFuZCBvYmZ1c2NhdGVkIGZvbnRzIG11c3QgYmVcbiAgICogcmUtcHJvY2Vzc2VkIHdoZW4gY2hhbmdpbmcgdGhpcyB2YWx1ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIHRoZSBVVUlEIG9yIG90aGVyIHVuaXF1ZSBpZGVudGlmaWVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHRoZSBpZCBvZiB0aGUgbWV0YSB0YWcgdGhhdCBtYXJrcyBpdCBhcyB0aGUgdWlkLlxuICAgKi9cbiAgc2V0VW5pcXVlSWRlbnRpZmllcih2YWx1ZSwgaWQgPSBcInB1Yi1pZFwiKSB7XG4gICAgY29uc3QgZXhpc3RpbmdJZCA9IHRoaXMuYXR0cmlidXRlc1tcInVuaXF1ZS1pZGVudGlmaWVyXCJdO1xuICAgIHRoaXMuYXR0cmlidXRlc1tcInVuaXF1ZS1pZGVudGlmaWVyXCJdID0gaWQ7XG5cbiAgICBjb25zdCB1aWRNZXRhZGF0YSA9IGV4aXN0aW5nSWRcbiAgICAgID8gdGhpcy5tZXRhZGF0YS5maW5kSXRlbVdpdGhJZChcImRjOmlkZW50aWZpZXJcIiwgZXhpc3RpbmdJZClcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKHVpZE1ldGFkYXRhKSB7XG4gICAgICB1aWRNZXRhZGF0YS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdWlkTWV0YWRhdGEuaWQgPSBpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXRhZGF0YS5hZGRJdGVtKFwiZGM6aWRlbnRpZmllclwiLCB2YWx1ZSwgeyBpZDogaWQgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIGVwdWIgdW5pcXVlLWlkZW50aWZlciB2YWx1ZVxuICAgKi9cbiAgZmluZFVuaXF1ZUlkZW50aWZpZXIoKSB7XG4gICAgY29uc3QgbWV0YWRhdGFJZCA9IHRoaXMuYXR0cmlidXRlc1tcInVuaXF1ZS1pZGVudGlmaWVyXCJdO1xuICAgIGlmIChtZXRhZGF0YUlkKSB7XG4gICAgICBjb25zdCB1aWRNZXRhZGF0YSA9IHRoaXMubWV0YWRhdGEuZmluZEl0ZW1XaXRoSWQoXG4gICAgICAgIFwiZGM6aWRlbnRpZmllclwiLFxuICAgICAgICBtZXRhZGF0YUlkXG4gICAgICApO1xuICAgICAgaWYgKHVpZE1ldGFkYXRhKSB7XG4gICAgICAgIHJldHVybiB1aWRNZXRhZGF0YS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGVnYWN5IEVwdWIgMi4wIHNwZWNpZmljYXRpb24gc3RhdGVzIHRoYXQgYSBzcGluZSBlbGVtZW50IHdpdGggdGhlICd0b2MnIGF0dHJpYnV0ZVxuICAgKiBpZGVudGlmaWVzIHRoZSBpZHJlZiBvZiB0aGUgTkNYIGZpbGUgaW4gdGhlIG1hbmlmZXN0XG4gICAqIFRPRE8gLSBoYW5kbGUgcmVsYXRpdmUgYW5kIGFic29sdXRlIHVybHMuIHJlc29sdmUgcGF0aFxuICAgKi9cbiAgZmluZE5jeEZpbGVQYXRoKCkge1xuICAgIGNvbnN0IHRvY0lkID0gdGhpcy5zcGluZS50b2M7XG4gICAgaWYgKHRvY0lkKSB7XG4gICAgICBjb25zdCBuY3hJdGVtID0gdGhpcy5tYW5pZmVzdC5maW5kSXRlbVdpdGhJZCh0b2NJZCk7XG4gICAgICBpZiAobmN4SXRlbSkge1xuICAgICAgICByZXR1cm4gRmlsZU1hbmFnZXIucmVzb2x2ZUlyaVRvRXB1YkxvY2F0aW9uKFxuICAgICAgICAgIG5jeEl0ZW0uaHJlZixcbiAgICAgICAgICB0aGlzLmxvY2F0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBocmVmIG9mIHRoZSBtYW5pZmVzdCBpdGVtIHdpdGggcHJvcGVydGllcz1cIm5hdlwiIGF0dHJpYnV0ZVxuICAgKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sI3NlYy1wYWNrYWdlLW5hdlxuICAgKiBUT0RPIC0gaGFuZGxlIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSB1cmxzLiByZXNvbHZlIHBhdGhcbiAgICovXG4gIGZpbmROYXZpZ2F0aW9uRmlsZVBhdGgoKSB7XG4gICAgY29uc3Qgc3BpbmVJdGVtID0gdGhpcy5tYW5pZmVzdC5maW5kTmF2KCk7XG4gICAgaWYgKHNwaW5lSXRlbSkge1xuICAgICAgcmV0dXJuIEZpbGVNYW5hZ2VyLnJlc29sdmVJcmlUb0VwdWJMb2NhdGlvbihcbiAgICAgICAgc3BpbmVJdGVtLmhyZWYsXG4gICAgICAgIHRoaXMubG9jYXRpb25cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmV3IGVtcHR5IHBhY2thZ2UuXG4gICAqL1xuICBjcmVhdGUoKSB7XG4gICAgY29uc3QgdXVpZCA9IGB1cm46dXVpZDoke3V1aWR2NCgpfWA7XG5cbiAgICB0aGlzLm1ldGFkYXRhID0gbmV3IFBhY2thZ2VNZXRhZGF0YSgpO1xuICAgIHRoaXMubWFuaWZlc3QgPSBuZXcgUGFja2FnZU1hbmlmZXN0KCk7XG4gICAgdGhpcy5zcGluZSA9IG5ldyBQYWNrYWdlU3BpbmUoKTtcbiAgICB0aGlzLnNldFVuaXF1ZUlkZW50aWZpZXIodXVpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBwYWNrYWdlIG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQgeG1sLlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IGJ1ZmZlcn0gZGF0YSAtIHRoZSB4bWwgZGF0YVxuICAgKi9cbiAgYXN5bmMgbG9hZFhtbChkYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcGFyc2VYbWwoZGF0YSk7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICB0aGlzLnJhd0RhdGEgPSByZXN1bHQ7XG5cbiAgICAgIGlmICh0aGlzLnJhd0RhdGEucGFja2FnZS5hdHRyKSB7XG4gICAgICAgIHRoaXMuYWRkQXR0cmlidXRlcyh0aGlzLnJhd0RhdGEucGFja2FnZS5hdHRyKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3RydWN0IG1ldGFkYXRhIHNlY3Rpb25cbiAgICAgIGNvbnN0IHJhd01ldGFkYXRhID0gcmVzdWx0LnBhY2thZ2UubWV0YWRhdGFbMF07XG4gICAgICBjb25zdCBmb3JtYXRlZE1ldGFkYXRhID0gT2JqZWN0LmVudHJpZXMocmF3TWV0YWRhdGEpLmZsYXRNYXAoXG4gICAgICAgIChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSBcImF0dHJcIikgcmV0dXJuIFtdO1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZsYXRNYXAoKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDoga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBlbnRyeT8udmFsLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGVudHJ5Py5hdHRyLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICB0aGlzLm1ldGFkYXRhID0gbmV3IFBhY2thZ2VNZXRhZGF0YShmb3JtYXRlZE1ldGFkYXRhLCByYXdNZXRhZGF0YT8uYXR0cik7XG5cbiAgICAgIC8vIGNvbnN0cnVjdCB0aGUgbWFuaWZlc3Qgc2VjdGlvblxuICAgICAgY29uc3QgcmF3TWFuaWZlc3QgPSByZXN1bHQucGFja2FnZS5tYW5pZmVzdFswXTtcbiAgICAgIGNvbnN0IG1hbmlmZXN0SXRlbXMgPSBPYmplY3QuZW50cmllcyhyYXdNYW5pZmVzdCkuZmxhdE1hcChcbiAgICAgICAgKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGlmIChrZXkgPT09IFwiYXR0clwiKSByZXR1cm4gW107XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuZmxhdE1hcCgoZW50cnkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmF0dHI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIHRoaXMubWFuaWZlc3QgPSBuZXcgUGFja2FnZU1hbmlmZXN0KFxuICAgICAgICBtYW5pZmVzdEl0ZW1zLFxuICAgICAgICByYXdNYW5pZmVzdD8uYXR0cixcbiAgICAgICAgdGhpcy5fbG9jYXRpb25cbiAgICAgICk7XG5cbiAgICAgIC8vIGNvbnN0cnVjdCB0aGUgbWFuaWZlc3Qgc2VjdGlvblxuICAgICAgY29uc3QgcmF3U3BpbmUgPSByZXN1bHQucGFja2FnZS5zcGluZVswXTtcbiAgICAgIGNvbnN0IHNwaW5lSXRlbXMgPSBPYmplY3QuZW50cmllcyhyYXdTcGluZSkuZmxhdE1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09IFwiYXR0clwiKSByZXR1cm4gW107XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5mbGF0TWFwKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmF0dHI7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNwaW5lID0gbmV3IFBhY2thZ2VTcGluZShzcGluZUl0ZW1zLCByYXdTcGluZT8uYXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXJzaW5nIFhNTFwiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB4bWwgc3RyaW5nIGRhdGFcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGFzeW5jIGdldFhtbCgpIHtcbiAgICBjb25zdCB4bWwgPSBhd2FpdCBnZW5lcmF0ZVhtbCh0aGlzLmdldFhtbDJKc09iamVjdCgpKTtcbiAgICByZXR1cm4geG1sO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIHRoZSB4bWwySnMgb2JqZWN0IGZvciBjb252ZXJzaW9uIHRvIHJhdyB4bWxcbiAgICogQHJldHVybnMge29iamVjdH1cbiAgICovXG4gIGdldFhtbDJKc09iamVjdCgpIHtcbiAgICBjb25zdCBmaWx0ZXJBdHRyaWJ1dGVzID0gKGF0dHJpYnV0ZXMpID0+IHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpXG4gICAgICAgICAgLmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5yZWR1Y2UoKG9iaiwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICBvYmpba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgfSwge30pO1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhhdHRyKS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gYXR0cjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAgY29uc3QgcHJlcGFyZUNoaWxkcmVuRm9yWG1sID0gKGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCBkYXRhTGlzdCA9IHt9O1xuICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGlmIChpdGVtLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBjb25zdCBhdHRyID0gZmlsdGVyQXR0cmlidXRlcyhpdGVtLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICBkYXRhLmF0dHIgPSBhdHRyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS52YWx1ZSkge1xuICAgICAgICAgIGRhdGEudmFsID0gaXRlbS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhTGlzdFtpdGVtLmVsZW1lbnRdKSkge1xuICAgICAgICAgIGRhdGFMaXN0W2l0ZW0uZWxlbWVudF0ucHVzaChkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhTGlzdFtpdGVtLmVsZW1lbnRdID0gW2RhdGFdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkYXRhTGlzdDtcbiAgICB9O1xuXG4gICAgLyogTWV0YWRhdGEgKi9cbiAgICBsZXQgeG1sSnNNZXRhZGF0YSA9IHByZXBhcmVDaGlsZHJlbkZvclhtbCh0aGlzLm1ldGFkYXRhLml0ZW1zKTtcbiAgICBjb25zdCBtZXRhZGF0YUF0dHIgPSBmaWx0ZXJBdHRyaWJ1dGVzKHRoaXMubWV0YWRhdGEuYXR0cmlidXRlcyk7XG5cbiAgICBpZiAobWV0YWRhdGFBdHRyKSB7XG4gICAgICB4bWxKc01ldGFkYXRhLmF0dHIgPSBtZXRhZGF0YUF0dHI7XG4gICAgfVxuXG4gICAgLyogTWFuaWZlc3QgKi9cbiAgICBsZXQgeG1sSnNNYW5pZmVzdCA9IHByZXBhcmVDaGlsZHJlbkZvclhtbCh0aGlzLm1hbmlmZXN0Lml0ZW1zKTtcbiAgICBjb25zdCBtYW5pZmVzdEF0dHIgPSBmaWx0ZXJBdHRyaWJ1dGVzKHRoaXMubWFuaWZlc3QuYXR0cmlidXRlcyk7XG5cbiAgICBpZiAobWFuaWZlc3RBdHRyKSB7XG4gICAgICB4bWxKc01hbmlmZXN0LmF0dHIgPSBtYW5pZmVzdEF0dHI7XG4gICAgfVxuXG4gICAgLyogU3BpbmUgKi9cbiAgICBsZXQgeG1sSnNTcGluZSA9IHByZXBhcmVDaGlsZHJlbkZvclhtbCh0aGlzLnNwaW5lLml0ZW1zKTtcbiAgICBjb25zdCBzcGluZUF0dHIgPSBmaWx0ZXJBdHRyaWJ1dGVzKHRoaXMubWFuaWZlc3QuYXR0cmlidXRlcyk7XG5cbiAgICBpZiAoc3BpbmVBdHRyKSB7XG4gICAgICB4bWxKc1NwaW5lLmF0dHIgPSBzcGluZUF0dHI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhY2thZ2U6IHtcbiAgICAgICAgYXR0cjogZmlsdGVyQXR0cmlidXRlcyh0aGlzLmF0dHJpYnV0ZXMpLFxuICAgICAgICBtZXRhZGF0YTogW3htbEpzTWV0YWRhdGFdLFxuICAgICAgICBtYW5pZmVzdDogW3htbEpzTWFuaWZlc3RdLFxuICAgICAgICBzcGluZTogW3htbEpzU3BpbmVdLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=
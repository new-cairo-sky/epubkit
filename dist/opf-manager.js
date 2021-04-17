"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _path = _interopRequireDefault(require("path"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _iterableToArrayLimit(arr, i) {if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Manager for the opf file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * https://www.w3.org/publishing/epub32/epub-packages.html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */var
OpfManager = /*#__PURE__*/function () {
  function OpfManager() {_classCallCheck(this, OpfManager);
    this._content = undefined;
    this._loaded = false;
  }

  /**
     * Initialize the opf with provided data.
     * @param {object} data
     */_createClass(OpfManager, [{ key: "init", value: function init(
    data) {
      this._content = data;
      this._loaded = true;
      return data;
    }

    /**
       * Public API Getters and Setters
       */

    /**
           * Get the full opf content as an object
           */ }, { key: "addMetadata",























































































































































    /**
                                        *
                                        * @param {string} key - key of the metadata
                                        * @param {string} value - the value of the metadata
                                        * @param {array} attributes - list of attribute objects: [{key: value}]
                                        */value: function addMetadata(
    key, value) {var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      if (!this._content["package"].metadata[0][key]) {
        this._content["package"].metadata[0][key] = [];
      }
      if (attributes.length > 0) {
        var item = {
          val: value,
          attr: attributes };

        this._content["package"].metadata[0][key].push(item);
      } else {
        this._content["package"].metadata[0][key].push(value);
      }
    } }, { key: "removeMetadata", value: function removeMetadata(

    key) {var _this$_content$packag;var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      if ((_this$_content$packag = this._content["package"].metadata[0]) === null || _this$_content$packag === void 0 ? void 0 : _this$_content$packag[key]) {
        if (
        id &&
        this._content["package"].metadata[0][key].attributes.find(function (attr) {
          return (attr === null || attr === void 0 ? void 0 : attr.id) === id;
        }))
        {
          delete this._content["package"].metadata[0][key];
        }
      } else {
        delete this._content["package"].metadata[0][key];
      }
    }

    /**
       * Find a metadata entry with the specified key.
       *
       * @param {string} key the metadata key to retrieve
       * @returns {array} an array of objects in the shape of:
       *   [{
       *    attributes: {array},
       *    value: string
       *    },
       *    ...
       *   ]
       */ }, { key: "findMetadataValue", value: function findMetadataValue(
    key) {
      var metadata = [];

      if (this._content["package"].metadata[0][key]) {
        var value = this._content["package"].metadata[0][key];
        if (Array.isArray(value)) {
          value.forEach(function (item) {
            if (_typeof(item) === "object" && item !== null) {
              var newMetadata = {};
              for (var _i = 0, _Object$entries = Object.entries(item); _i < _Object$entries.length; _i++) {var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),itemKey = _Object$entries$_i[0],itemValue = _Object$entries$_i[1];
                if (item.hasOwnProperty(itemKey)) {
                  if (itemKey === "val") {
                    newMetadata["value"] = itemValue;
                  } else if (itemKey === "attr") {
                    newMetadata["attributes"] = itemValue;
                  }
                  if (!newMetadata["value"]) {
                    newMetadata["value"] = undefined;
                  }
                  if (!newMetadata["attributes"]) {
                    newMetadata["attributes"] = undefined;
                  }
                }
              }
              metadata.push(newMetadata);
            } else {
              metadata.push({ value: item, attributes: undefined });
            }
          });
        }
      }
      return metadata;
    } }, { key: "findMetadataValueWithAttribute", value: function findMetadataValueWithAttribute(

    attrKey) {var attrValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var foundMetadata = [];
      Object.entries(this.metadata).forEach(function (_ref) {var _ref2 = _slicedToArray(_ref, 2),key = _ref2[0],value = _ref2[1];
        if (Array.isArray(value)) {
          value.forEach(function (meta) {var _meta$attributes;
            if (meta === null || meta === void 0 ? void 0 : (_meta$attributes = meta.attributes) === null || _meta$attributes === void 0 ? void 0 : _meta$attributes[attrKey]) {
              if (attrValue) {var _meta$attributes2;
                if ((meta === null || meta === void 0 ? void 0 : (_meta$attributes2 = meta.attributes) === null || _meta$attributes2 === void 0 ? void 0 : _meta$attributes2[attrKey]) === attrValue) {
                  foundMetadata.push(_defineProperty({}, key, meta));
                }
              } else {
                foundMetadata.push(_defineProperty({}, key, meta));
              }
            }
          });
        }
      });
      return foundMetadata;
    }

    /**
       * Find the title metadate entries, if any
       * @returns {array}
       */ }, { key: "findMetadataTitles", value: function findMetadataTitles()
    {
      var titles = this.findMetadataValue["dc:title"];
      if (titles) {
        return titles;
      }
      return [];
    } }, { key: "findMetadataCreators", value: function findMetadataCreators()

    {
      var creators = this.findMetadataValue["dc:creator"];
      if (creators) {
        return creators;
      }
      return [];
    }

    /**
       * Get's the toc attribute of the spine tag
       * The toc attribute value is the id of the toc item in the manifest
       */ }, { key: "findTocHref",
















    /**
                                    * Try to find the href of the nav file.
                                    * Looks for nav attribute and matches that to item id in the manifest.
                                    * Order of search is: OPF Spine toc, manifest item with nav "properties", ncx path
                                    */value: function findTocHref()
    {
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }

      var tocId = this.spineToc;

      if (tocId) {
        var manifestItem = this.findManifestItemWithId(tocId);
        if (manifestItem) {
          var href = manifestItem.href;
          if (!!href) {
            throw "Malformed OPF: Spine does not contain toc with id ".concat(tocId);
          }
          return href;
        }
      } else {
        // the spine's toc attribute is not defined.
        // look for a manifest item with the nav property
        var item = this.findManifestItemWithProperties("nav");
        if (item) {
          if (!(item === null || item === void 0 ? void 0 : item.href)) {
            throw "Malformed OPF: Manifest contains item with property \"nav\" but href is empty.";
          }
          return item.href;
        } else {var _ncxItems$;
          // no nav item found - look for an ncx file
          var ncxItems = this.findManifestItemsWithMediaType(
          "application/x-dtbncx+xml");


          if (ncxItems.length < 1) {
            throw "Ncx not found in manifest.";
          }

          var _href = (_ncxItems$ = ncxItems[0]) === null || _ncxItems$ === void 0 ? void 0 : _ncxItems$.href;

          if (!_href) {
            throw "Malformed OPF: Manifest contains ncx but href is empty.";
          }

          return ncxItems[0].href;
        }
      }

      return;
    }

    /**
       * Find the relative TOC file path.
       * @param {string} relativeTo - return path relative to this directory
       */ }, { key: "findTocPath", value: function findTocPath()
    {var relativeTo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }
      var href = this.findTocHref();
      if (href) {
        var tocPath = _path["default"].resolve(_path["default"].dirname(relativeTo), href);
        return tocPath;
      }
      return;
    }

    /**
       * Find the path to the ncx file, if any.
       */ }, { key: "findNcxPath", value: function findNcxPath(
    relativeTo) {
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }

      var ncxItems = this.findManifestItemsWithMediaType(
      "application/x-dtbncx+xml");

      if (ncxItems.length > 0) {
        var href = ncxItems[0].href;
        if (!!href) {
          throw "Ncx found in manifest, but href is empty.";
        }
        var ncxPath = _path["default"].resolve(_path["default"].dirname(relativeTo), href);
        return ncxPath;
      } else {
        throw "No ncx found in manifest.";
      }
    }

    /**
       * Manifest Methods
       */ }, { key: "addManifestItem", value: function addManifestItem(

    href, id, mediaType) {
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }

      this._content["package"].manifest[0].item.push({
        attr: {
          href: href,
          id: id,
          "media-type": mediaType } });


      this.sortManifest();
      return this._content["package"].manifest;
    } }, { key: "sortManifest", value: function sortManifest()

    {var _this$_content, _this$_content$packag2;
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }
      // sort by type and then by ID.
      var sortedManifest = (_this$_content = this._content) === null || _this$_content === void 0 ? void 0 : (_this$_content$packag2 = _this$_content["package"]) === null || _this$_content$packag2 === void 0 ? void 0 : _this$_content$packag2.manifest[0].item.sort(
      function (a, b) {
        var mediaTypeA = a.attr["media-type"].toUpperCase();
        var mediaTypeB = b.attr["media-type"].toUpperCase();
        if (mediaTypeA < mediaTypeB) {
          return -1;
        }
        if (mediaTypeA > mediaTypeB) {
          return 1;
        }

        var idA = a.attr.id.toUpperCase();
        var idB = b.attr.id.toUpperCase();

        if (idA < idB) {
          return -1;
        }
        if (idA > idB) {
          return 1;
        }

        return 0;
      });

      return sortedManifest;
    }

    /**
       * Find the first manifest item with the given "properties" attribute value
       * @param {string} prop
       */ }, { key: "findManifestItemWithProperties", value: function findManifestItemWithProperties(
    prop) {
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }
      var item = this._content["package"].manifest[0].item.find(function (item) {var _item$attr;
        return (item === null || item === void 0 ? void 0 : (_item$attr = item.attr) === null || _item$attr === void 0 ? void 0 : _item$attr.properties) === prop;
      });

      if (item) {var _item$attr2;
        return {
          id: item.attr.id,
          href: item.attr.href,
          mediaType: item.attr["media-type"],
          properties: (_item$attr2 = item.attr) === null || _item$attr2 === void 0 ? void 0 : _item$attr2.properties };

      }
    }

    /**
       * Find the manifest items with the given media-type attribute
       * @param {string} mediaType
       */ }, { key: "findManifestItemsWithMediaType", value: function findManifestItemsWithMediaType(
    mediaType) {
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }
      var items = this._content["package"].manifest[0].item.
      filter(function (item) {
        return (item === null || item === void 0 ? void 0 : item.attr["media-type"]) === mediaType;
      }).
      map(function (item) {var _item$attr3;
        return {
          id: item.attr.id,
          href: item.attr.href,
          mediaType: item.attr["media-type"],
          properties: (_item$attr3 = item.attr) === null || _item$attr3 === void 0 ? void 0 : _item$attr3.properties };

      });

      return items;
    }

    /**
       * Find a manifest item with the given id value
       * @param {string} id
       */ }, { key: "findManifestItemWithId", value: function findManifestItemWithId(
    id) {
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }
      var item = this._content["package"].manifest[0].item.find(function (item) {
        return item.attr.id === id;
      });

      if (item) {var _item$attr4;
        return {
          id: item.attr.id,
          href: item.attr.href,
          mediaType: item.attr["media-type"],
          properties: (_item$attr4 = item.attr) === null || _item$attr4 === void 0 ? void 0 : _item$attr4.properties };

      }
    }

    /**
       * Get the position of a manifest item with id
       * @param {string} id
       */ }, { key: "findManifestItemIdSpinePosition", value: function findManifestItemIdSpinePosition(
    id) {
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }

      var index = this._content["package"].spine[0].itemref.findIndex(
      function (itemref) {
        return itemref.attr.idref === id;
      });


      return index;
    }

    /**
       * Spine Methods
       */

    /**
           * Get the spine's array of itemref elements. Each itemref has an idref attribute.
           * The idref references a manifest item id.
           * The order of this array determines the order of repesentation of the manifest items.
           * the linear attribute indicates if the itemref is in linear representation order
           * or is auxiliary content.
           * see: http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4
           */ }, { key: "addSpineItemrefAtPosition",















    /**
                                                      * Add an itemref item to the spine
                                                      * @param {int} position
                                                      * @param {string} idref
                                                      * @param {bool} linear
                                                      */value: function addSpineItemrefAtPosition(
    position, idref) {var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }

      this._content["package"].spine[0].itemref.splice(position, 0, {
        attr: {
          idref: idref,
          linear: linear ? "yes" : "no" } });


      return this._content["package"].spine;
    } }, { key: "addSpineItemrefAfterIdref", value: function addSpineItemrefAfterIdref(

    positionIdref, idref) {var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!this._loaded) {
        console.error("Opf not loaded.");
        throw "Opf not loaded.";
      }
      var position = this.findManifestItemIdSpinePosition(positionIdref);
      if (position !== -1) {
        this.addSpineItemrefAtPosition(position, idref, linear);
      } else {
        console.error("Id \"".concat(positionIdref, "\" not found in manifest."));
        throw "Id \"".concat(positionIdref, "\" not found in manifest.");
      }
    } }, { key: "content", get: function get() {return this._content;} /**
                                                                        * Public properties of the root Package element.
                                                                        */ /**
                                                                            * Get the package's optional language direction attribute
                                                                            * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
                                                                            */ }, { key: "dir", get: function get() {var _this$_content$packag3;return (_this$_content$packag3 = this._content["package"].attr) === null || _this$_content$packag3 === void 0 ? void 0 : _this$_content$packag3["dir"];} /**
                                                                                                                                                                                                                                                                                                          * Set the package's optional language direction attribute
                                                                                                                                                                                                                                                                                                          * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
                                                                                                                                                                                                                                                                                                          */, set: function set(dir) {this._content["package"].attr["dir"] = dir;} /**
                                                                                                                                                                                                                                                                                                                                                                                    * Get the package's optional id attribute
                                                                                                                                                                                                                                                                                                                                                                                    * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
                                                                                                                                                                                                                                                                                                                                                                                    * @returns {string}
                                                                                                                                                                                                                                                                                                                                                                                    */ }, { key: "id", get: function get() {var _this$_content$packag4;return (_this$_content$packag4 = this._content["package"].attr) === null || _this$_content$packag4 === void 0 ? void 0 : _this$_content$packag4["id"];} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Set the package's optional id attribute
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {string} id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */, set: function set(id) {this._content["package"].attr["id"] = id;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Get the root Package unique-identifier attribute.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Note: this is NOT the UID, but the id of the metadata dc:identifier that holds the value.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * https://www.w3.org/publishing/epub32/epub-packages.html#attrdef-package-unique-identifier
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @returns {string}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */ }, { key: "uniqueIdentifier", get: function get() {var _this$_content$packag5;return (_this$_content$packag5 = this._content["package"].attr) === null || _this$_content$packag5 === void 0 ? void 0 : _this$_content$packag5["unique-identifier"];} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Set the root Package unique-identifier attribute
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Note: this is NOT the UID, but the id of the metadata dc:identifier that holds the value.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://www.w3.org/publishing/epub32/epub-packages.html#attrdef-package-unique-identifier
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {string} id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */, set: function set(id) {this._content["package"].attr["unique-identifier"] = id;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Get the actual unique identifier value using the id provided by "unique-identifier"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * package element attribute
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://www.w3.org/publishing/epub32/epub-packages.html#sec-opf-dcidentifier
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */ }, { key: "uniqueDCIdentifier", get: function get() {var _metadata$, _metadata$$metaKey;var metadataId = this._content["package"].attr["unique-identifier"];var metadata = this.findMetadataValueWithAttribute("id", metadataId);if (!metadata.length) {return;}var metaKey = Object.keys(metadata[0])[0];var uid = metadata === null || metadata === void 0 ? void 0 : (_metadata$ = metadata[0]) === null || _metadata$ === void 0 ? void 0 : (_metadata$$metaKey = _metadata$[metaKey]) === null || _metadata$$metaKey === void 0 ? void 0 : _metadata$$metaKey.value;return uid;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Set the unique identifier value using the id provided by "unique-identifier"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * package element attribute
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://www.w3.org/publishing/epub32/epub-packages.html#sec-opf-dcidentifier
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */, set: function set(uid) {var metadataId = this._content["package"].attr["unique-identifier"];var metadata = this.findMetadataValueWithAttribute("id", metadataId);if (metadata.length > 0) {// unique id is already set - need to remove it
        this.removeMetadata("dc:identifier", metadataId);if (metadata[0]["dc:identifier"] !== uid) {// If the old value is different from the new one, it is still a valid piece of metadata.
          // Add it back without the 'id' attr that marks it as the 'unique-identifier'
          this.addMetadata("dc:identifier", metadata[0]["dc:identifier"]);}}this.addMetadata("dc:identifier", uid, [{ id: metadataId }]);} /**
                                                                                                                                            * Get array of manifest objects
                                                                                                                                            * @returns {array} - an array of objects in the shape of
                                                                                                                                            * [{
                                                                                                                                            *  id: string,
                                                                                                                                            *  href: string,
                                                                                                                                            *  mediaType: string
                                                                                                                                            * }]
                                                                                                                                            */ }, { key: "manifestItems", get: function get() {var items = this._content["package"].manifest[0].item.map(function (item) {return { id: item.attr.id, href: item.attr.href, mediaType: item.attr["media-type"] };});return items;} /**
                                                                                                                                                                                                                                                                                                                                                                                   * Metadata
                                                                                                                                                                                                                                                                                                                                                                                   * http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.2
                                                                                                                                                                                                                                                                                                                                                                                   */ /**
                                                                                                                                                                                                                                                                                                                                                                                       * Get the opf metadata as an object with keys for each entry.
                                                                                                                                                                                                                                                                                                                                                                                       * The metadata tags attributes are added to the key 'attributes'
                                                                                                                                                                                                                                                                                                                                                                                       * @returns {object} - an object of keyed metadata
                                                                                                                                                                                                                                                                                                                                                                                       */ }, { key: "metadata", get: function get() {//const metadata = this._content.package.metadata[0].;
      var metadata = {};for (var _i2 = 0, _Object$entries2 = Object.entries(this._content["package"].metadata[0]); _i2 < _Object$entries2.length; _i2++) {var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),key = _Object$entries2$_i[0],value = _Object$entries2$_i[1];if (key === "attr") {metadata["attributes"] = value;} else if (this._content["package"].metadata[0].hasOwnProperty(key)) {metadata[key] = this.findMetadataValue(key);}}return metadata;} }, { key: "rawMetadata", get: function get() {return this._content["package"].metadata[0];} }, { key: "spineToc", get: function get() {var _this$_content2, _this$_content2$packa, _this$_content2$packa2, _this$_content2$packa3;return this === null || this === void 0 ? void 0 : (_this$_content2 = this._content) === null || _this$_content2 === void 0 ? void 0 : (_this$_content2$packa = _this$_content2["package"]) === null || _this$_content2$packa === void 0 ? void 0 : (_this$_content2$packa2 = _this$_content2$packa.spine) === null || _this$_content2$packa2 === void 0 ? void 0 : (_this$_content2$packa3 = _this$_content2$packa2.attr) === null || _this$_content2$packa3 === void 0 ? void 0 : _this$_content2$packa3.toc;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Set the spine's TOC attribute
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {string} toc
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */, set: function set(toc) {if (!this._content["package"].spine.attr) {this._content["package"].spine.attr = { toc: toc };} else {this._content["package"].spine.attr.toc = toc;}} }, { key: "spineItemrefs", get: function get() {if (!this._loaded) {console.error("Opf not loaded.");throw "Opf not loaded.";}var items = this._content["package"].spine[0].item.map(function (item) {return { idref: item.attr.idref, linear: item.attr.linear || true };});return items;} }]);return OpfManager;}();var _default = OpfManager;exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vcGYtbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJPcGZNYW5hZ2VyIiwiX2NvbnRlbnQiLCJ1bmRlZmluZWQiLCJfbG9hZGVkIiwiZGF0YSIsImtleSIsInZhbHVlIiwiYXR0cmlidXRlcyIsIm1ldGFkYXRhIiwibGVuZ3RoIiwiaXRlbSIsInZhbCIsImF0dHIiLCJwdXNoIiwiaWQiLCJmaW5kIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsIm5ld01ldGFkYXRhIiwiT2JqZWN0IiwiZW50cmllcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJoYXNPd25Qcm9wZXJ0eSIsImF0dHJLZXkiLCJhdHRyVmFsdWUiLCJmb3VuZE1ldGFkYXRhIiwibWV0YSIsInRpdGxlcyIsImZpbmRNZXRhZGF0YVZhbHVlIiwiY3JlYXRvcnMiLCJjb25zb2xlIiwiZXJyb3IiLCJ0b2NJZCIsInNwaW5lVG9jIiwibWFuaWZlc3RJdGVtIiwiZmluZE1hbmlmZXN0SXRlbVdpdGhJZCIsImhyZWYiLCJmaW5kTWFuaWZlc3RJdGVtV2l0aFByb3BlcnRpZXMiLCJuY3hJdGVtcyIsImZpbmRNYW5pZmVzdEl0ZW1zV2l0aE1lZGlhVHlwZSIsInJlbGF0aXZlVG8iLCJmaW5kVG9jSHJlZiIsInRvY1BhdGgiLCJwYXRoIiwicmVzb2x2ZSIsImRpcm5hbWUiLCJuY3hQYXRoIiwibWVkaWFUeXBlIiwibWFuaWZlc3QiLCJzb3J0TWFuaWZlc3QiLCJzb3J0ZWRNYW5pZmVzdCIsInNvcnQiLCJhIiwiYiIsIm1lZGlhVHlwZUEiLCJ0b1VwcGVyQ2FzZSIsIm1lZGlhVHlwZUIiLCJpZEEiLCJpZEIiLCJwcm9wIiwicHJvcGVydGllcyIsIml0ZW1zIiwiZmlsdGVyIiwibWFwIiwiaW5kZXgiLCJzcGluZSIsIml0ZW1yZWYiLCJmaW5kSW5kZXgiLCJpZHJlZiIsInBvc2l0aW9uIiwibGluZWFyIiwic3BsaWNlIiwicG9zaXRpb25JZHJlZiIsImZpbmRNYW5pZmVzdEl0ZW1JZFNwaW5lUG9zaXRpb24iLCJhZGRTcGluZUl0ZW1yZWZBdFBvc2l0aW9uIiwiZGlyIiwibWV0YWRhdGFJZCIsImZpbmRNZXRhZGF0YVZhbHVlV2l0aEF0dHJpYnV0ZSIsIm1ldGFLZXkiLCJrZXlzIiwidWlkIiwicmVtb3ZlTWV0YWRhdGEiLCJhZGRNZXRhZGF0YSIsInRvYyJdLCJtYXBwaW5ncyI6InVHQUFBLG9EOztBQUVBOzs7O0FBSU1BLFU7QUFDSix3QkFBYztBQUNaLFNBQUtDLFFBQUwsR0FBZ0JDLFNBQWhCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLEtBQWY7QUFDRDs7QUFFRDs7OztBQUlLQyxJQUFBQSxJLEVBQU07QUFDVCxXQUFLSCxRQUFMLEdBQWdCRyxJQUFoQjtBQUNBLFdBQUtELE9BQUwsR0FBZSxJQUFmO0FBQ0EsYUFBT0MsSUFBUDtBQUNEOztBQUVEOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwSkE7Ozs7OztBQU1ZQyxJQUFBQSxHLEVBQUtDLEssRUFBd0IsS0FBakJDLFVBQWlCLHVFQUFKLEVBQUk7QUFDdkMsVUFBSSxDQUFDLEtBQUtOLFFBQUwsWUFBc0JPLFFBQXRCLENBQStCLENBQS9CLEVBQWtDSCxHQUFsQyxDQUFMLEVBQTZDO0FBQzNDLGFBQUtKLFFBQUwsWUFBc0JPLFFBQXRCLENBQStCLENBQS9CLEVBQWtDSCxHQUFsQyxJQUF5QyxFQUF6QztBQUNEO0FBQ0QsVUFBSUUsVUFBVSxDQUFDRSxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLFlBQU1DLElBQUksR0FBRztBQUNYQyxVQUFBQSxHQUFHLEVBQUVMLEtBRE07QUFFWE0sVUFBQUEsSUFBSSxFQUFFTCxVQUZLLEVBQWI7O0FBSUEsYUFBS04sUUFBTCxZQUFzQk8sUUFBdEIsQ0FB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ciB0aGUgb3BmIGZpbGVcbiAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWxcbiAqL1xuY2xhc3MgT3BmTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NvbnRlbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgb3BmIHdpdGggcHJvdmlkZWQgZGF0YS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAgICovXG4gIGluaXQoZGF0YSkge1xuICAgIHRoaXMuX2NvbnRlbnQgPSBkYXRhO1xuICAgIHRoaXMuX2xvYWRlZCA9IHRydWU7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIEFQSSBHZXR0ZXJzIGFuZCBTZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZ1bGwgb3BmIGNvbnRlbnQgYXMgYW4gb2JqZWN0XG4gICAqL1xuICBnZXQgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgcHJvcGVydGllcyBvZiB0aGUgcm9vdCBQYWNrYWdlIGVsZW1lbnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHBhY2thZ2UncyBvcHRpb25hbCBsYW5ndWFnZSBkaXJlY3Rpb24gYXR0cmlidXRlXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjc2VjLXNoYXJlZC1hdHRyc1xuICAgKi9cbiAgZ2V0IGRpcigpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudC5wYWNrYWdlLmF0dHI/LltcImRpclwiXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhY2thZ2UncyBvcHRpb25hbCBsYW5ndWFnZSBkaXJlY3Rpb24gYXR0cmlidXRlXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjc2VjLXNoYXJlZC1hdHRyc1xuICAgKi9cbiAgc2V0IGRpcihkaXIpIHtcbiAgICB0aGlzLl9jb250ZW50LnBhY2thZ2UuYXR0cltcImRpclwiXSA9IGRpcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHBhY2thZ2UncyBvcHRpb25hbCBpZCBhdHRyaWJ1dGVcbiAgICogaHR0cHM6Ly93d3cudzMub3JnL3B1Ymxpc2hpbmcvZXB1YjMyL2VwdWItcGFja2FnZXMuaHRtbCNzZWMtc2hhcmVkLWF0dHJzXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQucGFja2FnZS5hdHRyPy5bXCJpZFwiXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhY2thZ2UncyBvcHRpb25hbCBpZCBhdHRyaWJ1dGVcbiAgICogaHR0cHM6Ly93d3cudzMub3JnL3B1Ymxpc2hpbmcvZXB1YjMyL2VwdWItcGFja2FnZXMuaHRtbCNzZWMtc2hhcmVkLWF0dHJzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgdGhpcy5fY29udGVudC5wYWNrYWdlLmF0dHJbXCJpZFwiXSA9IGlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcm9vdCBQYWNrYWdlIHVuaXF1ZS1pZGVudGlmaWVyIGF0dHJpYnV0ZS5cbiAgICogTm90ZTogdGhpcyBpcyBOT1QgdGhlIFVJRCwgYnV0IHRoZSBpZCBvZiB0aGUgbWV0YWRhdGEgZGM6aWRlbnRpZmllciB0aGF0IGhvbGRzIHRoZSB2YWx1ZS5cbiAgICogaHR0cHM6Ly93d3cudzMub3JnL3B1Ymxpc2hpbmcvZXB1YjMyL2VwdWItcGFja2FnZXMuaHRtbCNhdHRyZGVmLXBhY2thZ2UtdW5pcXVlLWlkZW50aWZpZXJcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGdldCB1bmlxdWVJZGVudGlmaWVyKCkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50LnBhY2thZ2UuYXR0cj8uW1widW5pcXVlLWlkZW50aWZpZXJcIl07XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSByb290IFBhY2thZ2UgdW5pcXVlLWlkZW50aWZpZXIgYXR0cmlidXRlXG4gICAqIE5vdGU6IHRoaXMgaXMgTk9UIHRoZSBVSUQsIGJ1dCB0aGUgaWQgb2YgdGhlIG1ldGFkYXRhIGRjOmlkZW50aWZpZXIgdGhhdCBob2xkcyB0aGUgdmFsdWUuXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjYXR0cmRlZi1wYWNrYWdlLXVuaXF1ZS1pZGVudGlmaWVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IHVuaXF1ZUlkZW50aWZpZXIoaWQpIHtcbiAgICB0aGlzLl9jb250ZW50LnBhY2thZ2UuYXR0cltcInVuaXF1ZS1pZGVudGlmaWVyXCJdID0gaWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBhY3R1YWwgdW5pcXVlIGlkZW50aWZpZXIgdmFsdWUgdXNpbmcgdGhlIGlkIHByb3ZpZGVkIGJ5IFwidW5pcXVlLWlkZW50aWZpZXJcIlxuICAgKiBwYWNrYWdlIGVsZW1lbnQgYXR0cmlidXRlXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjc2VjLW9wZi1kY2lkZW50aWZpZXJcbiAgICovXG4gIGdldCB1bmlxdWVEQ0lkZW50aWZpZXIoKSB7XG4gICAgY29uc3QgbWV0YWRhdGFJZCA9IHRoaXMuX2NvbnRlbnQucGFja2FnZS5hdHRyW1widW5pcXVlLWlkZW50aWZpZXJcIl07XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmZpbmRNZXRhZGF0YVZhbHVlV2l0aEF0dHJpYnV0ZShcImlkXCIsIG1ldGFkYXRhSWQpO1xuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFLZXkgPSBPYmplY3Qua2V5cyhtZXRhZGF0YVswXSlbMF07XG4gICAgY29uc3QgdWlkID0gbWV0YWRhdGE/LlswXT8uW21ldGFLZXldPy52YWx1ZTtcbiAgICByZXR1cm4gdWlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdW5pcXVlIGlkZW50aWZpZXIgdmFsdWUgdXNpbmcgdGhlIGlkIHByb3ZpZGVkIGJ5IFwidW5pcXVlLWlkZW50aWZpZXJcIlxuICAgKiBwYWNrYWdlIGVsZW1lbnQgYXR0cmlidXRlXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjc2VjLW9wZi1kY2lkZW50aWZpZXJcbiAgICovXG4gIHNldCB1bmlxdWVEQ0lkZW50aWZpZXIodWlkKSB7XG4gICAgY29uc3QgbWV0YWRhdGFJZCA9IHRoaXMuX2NvbnRlbnQucGFja2FnZS5hdHRyW1widW5pcXVlLWlkZW50aWZpZXJcIl07XG5cbiAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZmluZE1ldGFkYXRhVmFsdWVXaXRoQXR0cmlidXRlKFwiaWRcIiwgbWV0YWRhdGFJZCk7XG4gICAgaWYgKG1ldGFkYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIHVuaXF1ZSBpZCBpcyBhbHJlYWR5IHNldCAtIG5lZWQgdG8gcmVtb3ZlIGl0XG4gICAgICB0aGlzLnJlbW92ZU1ldGFkYXRhKFwiZGM6aWRlbnRpZmllclwiLCBtZXRhZGF0YUlkKTtcbiAgICAgIGlmIChtZXRhZGF0YVswXVtcImRjOmlkZW50aWZpZXJcIl0gIT09IHVpZCkge1xuICAgICAgICAvLyBJZiB0aGUgb2xkIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBuZXcgb25lLCBpdCBpcyBzdGlsbCBhIHZhbGlkIHBpZWNlIG9mIG1ldGFkYXRhLlxuICAgICAgICAvLyBBZGQgaXQgYmFjayB3aXRob3V0IHRoZSAnaWQnIGF0dHIgdGhhdCBtYXJrcyBpdCBhcyB0aGUgJ3VuaXF1ZS1pZGVudGlmaWVyJ1xuICAgICAgICB0aGlzLmFkZE1ldGFkYXRhKFwiZGM6aWRlbnRpZmllclwiLCBtZXRhZGF0YVswXVtcImRjOmlkZW50aWZpZXJcIl0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWRkTWV0YWRhdGEoXCJkYzppZGVudGlmaWVyXCIsIHVpZCwgW3sgaWQ6IG1ldGFkYXRhSWQgfV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhcnJheSBvZiBtYW5pZmVzdCBvYmplY3RzXG4gICAqIEByZXR1cm5zIHthcnJheX0gLSBhbiBhcnJheSBvZiBvYmplY3RzIGluIHRoZSBzaGFwZSBvZlxuICAgKiBbe1xuICAgKiAgaWQ6IHN0cmluZyxcbiAgICogIGhyZWY6IHN0cmluZyxcbiAgICogIG1lZGlhVHlwZTogc3RyaW5nXG4gICAqIH1dXG4gICAqL1xuICBnZXQgbWFuaWZlc3RJdGVtcygpIHtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2NvbnRlbnQucGFja2FnZS5tYW5pZmVzdFswXS5pdGVtLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGl0ZW0uYXR0ci5pZCxcbiAgICAgICAgaHJlZjogaXRlbS5hdHRyLmhyZWYsXG4gICAgICAgIG1lZGlhVHlwZTogaXRlbS5hdHRyW1wibWVkaWEtdHlwZVwiXSxcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGFkYXRhXG4gICAqIGh0dHA6Ly9pZHBmLm9yZy9lcHViLzIwL3NwZWMvT1BGXzIuMC4xX2RyYWZ0Lmh0bSNTZWN0aW9uMi4yXG4gICAqL1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG9wZiBtZXRhZGF0YSBhcyBhbiBvYmplY3Qgd2l0aCBrZXlzIGZvciBlYWNoIGVudHJ5LlxuICAgKiBUaGUgbWV0YWRhdGEgdGFncyBhdHRyaWJ1dGVzIGFyZSBhZGRlZCB0byB0aGUga2V5ICdhdHRyaWJ1dGVzJ1xuICAgKiBAcmV0dXJucyB7b2JqZWN0fSAtIGFuIG9iamVjdCBvZiBrZXllZCBtZXRhZGF0YVxuICAgKi9cbiAgZ2V0IG1ldGFkYXRhKCkge1xuICAgIC8vY29uc3QgbWV0YWRhdGEgPSB0aGlzLl9jb250ZW50LnBhY2thZ2UubWV0YWRhdGFbMF0uO1xuICAgIGxldCBtZXRhZGF0YSA9IHt9O1xuXG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKFxuICAgICAgdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdXG4gICAgKSkge1xuICAgICAgaWYgKGtleSA9PT0gXCJhdHRyXCIpIHtcbiAgICAgICAgbWV0YWRhdGFbXCJhdHRyaWJ1dGVzXCJdID0gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIG1ldGFkYXRhW2tleV0gPSB0aGlzLmZpbmRNZXRhZGF0YVZhbHVlKGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9XG5cbiAgZ2V0IHJhd01ldGFkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50LnBhY2thZ2UubWV0YWRhdGFbMF07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIGtleSBvZiB0aGUgbWV0YWRhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdGhlIHZhbHVlIG9mIHRoZSBtZXRhZGF0YVxuICAgKiBAcGFyYW0ge2FycmF5fSBhdHRyaWJ1dGVzIC0gbGlzdCBvZiBhdHRyaWJ1dGUgb2JqZWN0czogW3trZXk6IHZhbHVlfV1cbiAgICovXG4gIGFkZE1ldGFkYXRhKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMgPSBbXSkge1xuICAgIGlmICghdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdW2tleV0pIHtcbiAgICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldID0gW107XG4gICAgfVxuICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAgIHZhbDogdmFsdWUsXG4gICAgICAgIGF0dHI6IGF0dHJpYnV0ZXMsXG4gICAgICB9O1xuICAgICAgdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdW2tleV0ucHVzaChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTWV0YWRhdGEoa2V5LCBpZCA9IHVuZGVmaW5lZCkge1xuICAgIGlmICh0aGlzLl9jb250ZW50LnBhY2thZ2UubWV0YWRhdGFbMF0/LltrZXldKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGlkICYmXG4gICAgICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT4ge1xuICAgICAgICAgIHJldHVybiBhdHRyPy5pZCA9PT0gaWQ7XG4gICAgICAgIH0pXG4gICAgICApIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdW2tleV07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgYSBtZXRhZGF0YSBlbnRyeSB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRoZSBtZXRhZGF0YSBrZXkgdG8gcmV0cmlldmVcbiAgICogQHJldHVybnMge2FycmF5fSBhbiBhcnJheSBvZiBvYmplY3RzIGluIHRoZSBzaGFwZSBvZjpcbiAgICogICBbe1xuICAgKiAgICBhdHRyaWJ1dGVzOiB7YXJyYXl9LFxuICAgKiAgICB2YWx1ZTogc3RyaW5nXG4gICAqICAgIH0sXG4gICAqICAgIC4uLlxuICAgKiAgIF1cbiAgICovXG4gIGZpbmRNZXRhZGF0YVZhbHVlKGtleSkge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gW107XG5cbiAgICBpZiAodGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdW2tleV0pIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdW2tleV07XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIiAmJiBpdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdNZXRhZGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgW2l0ZW1LZXksIGl0ZW1WYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoaXRlbSkpIHtcbiAgICAgICAgICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoaXRlbUtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbUtleSA9PT0gXCJ2YWxcIikge1xuICAgICAgICAgICAgICAgICAgbmV3TWV0YWRhdGFbXCJ2YWx1ZVwiXSA9IGl0ZW1WYWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1LZXkgPT09IFwiYXR0clwiKSB7XG4gICAgICAgICAgICAgICAgICBuZXdNZXRhZGF0YVtcImF0dHJpYnV0ZXNcIl0gPSBpdGVtVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbmV3TWV0YWRhdGFbXCJ2YWx1ZVwiXSkge1xuICAgICAgICAgICAgICAgICAgbmV3TWV0YWRhdGFbXCJ2YWx1ZVwiXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFuZXdNZXRhZGF0YVtcImF0dHJpYnV0ZXNcIl0pIHtcbiAgICAgICAgICAgICAgICAgIG5ld01ldGFkYXRhW1wiYXR0cmlidXRlc1wiXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1ldGFkYXRhLnB1c2gobmV3TWV0YWRhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5wdXNoKHsgdmFsdWU6IGl0ZW0sIGF0dHJpYnV0ZXM6IHVuZGVmaW5lZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH1cblxuICBmaW5kTWV0YWRhdGFWYWx1ZVdpdGhBdHRyaWJ1dGUoYXR0cktleSwgYXR0clZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgbGV0IGZvdW5kTWV0YWRhdGEgPSBbXTtcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLm1ldGFkYXRhKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZS5mb3JFYWNoKChtZXRhKSA9PiB7XG4gICAgICAgICAgaWYgKG1ldGE/LmF0dHJpYnV0ZXM/LlthdHRyS2V5XSkge1xuICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICBpZiAobWV0YT8uYXR0cmlidXRlcz8uW2F0dHJLZXldID09PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmb3VuZE1ldGFkYXRhLnB1c2goeyBba2V5XTogbWV0YSB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZm91bmRNZXRhZGF0YS5wdXNoKHsgW2tleV06IG1ldGEgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRNZXRhZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSB0aXRsZSBtZXRhZGF0ZSBlbnRyaWVzLCBpZiBhbnlcbiAgICogQHJldHVybnMge2FycmF5fVxuICAgKi9cbiAgZmluZE1ldGFkYXRhVGl0bGVzKCkge1xuICAgIGNvbnN0IHRpdGxlcyA9IHRoaXMuZmluZE1ldGFkYXRhVmFsdWVbXCJkYzp0aXRsZVwiXTtcbiAgICBpZiAodGl0bGVzKSB7XG4gICAgICByZXR1cm4gdGl0bGVzO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBmaW5kTWV0YWRhdGFDcmVhdG9ycygpIHtcbiAgICBjb25zdCBjcmVhdG9ycyA9IHRoaXMuZmluZE1ldGFkYXRhVmFsdWVbXCJkYzpjcmVhdG9yXCJdO1xuICAgIGlmIChjcmVhdG9ycykge1xuICAgICAgcmV0dXJuIGNyZWF0b3JzO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogR2V0J3MgdGhlIHRvYyBhdHRyaWJ1dGUgb2YgdGhlIHNwaW5lIHRhZ1xuICAgKiBUaGUgdG9jIGF0dHJpYnV0ZSB2YWx1ZSBpcyB0aGUgaWQgb2YgdGhlIHRvYyBpdGVtIGluIHRoZSBtYW5pZmVzdFxuICAgKi9cbiAgZ2V0IHNwaW5lVG9jKCkge1xuICAgIHJldHVybiB0aGlzPy5fY29udGVudD8ucGFja2FnZT8uc3BpbmU/LmF0dHI/LnRvYztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHNwaW5lJ3MgVE9DIGF0dHJpYnV0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9jXG4gICAqL1xuICBzZXQgc3BpbmVUb2ModG9jKSB7XG4gICAgaWYgKCF0aGlzLl9jb250ZW50LnBhY2thZ2Uuc3BpbmUuYXR0cikge1xuICAgICAgdGhpcy5fY29udGVudC5wYWNrYWdlLnNwaW5lLmF0dHIgPSB7IHRvYzogdG9jIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5zcGluZS5hdHRyLnRvYyA9IHRvYztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJ5IHRvIGZpbmQgdGhlIGhyZWYgb2YgdGhlIG5hdiBmaWxlLlxuICAgKiBMb29rcyBmb3IgbmF2IGF0dHJpYnV0ZSBhbmQgbWF0Y2hlcyB0aGF0IHRvIGl0ZW0gaWQgaW4gdGhlIG1hbmlmZXN0LlxuICAgKiBPcmRlciBvZiBzZWFyY2ggaXM6IE9QRiBTcGluZSB0b2MsIG1hbmlmZXN0IGl0ZW0gd2l0aCBuYXYgXCJwcm9wZXJ0aWVzXCIsIG5jeCBwYXRoXG4gICAqL1xuICBmaW5kVG9jSHJlZigpIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuXG4gICAgY29uc3QgdG9jSWQgPSB0aGlzLnNwaW5lVG9jO1xuXG4gICAgaWYgKHRvY0lkKSB7XG4gICAgICBjb25zdCBtYW5pZmVzdEl0ZW0gPSB0aGlzLmZpbmRNYW5pZmVzdEl0ZW1XaXRoSWQodG9jSWQpO1xuICAgICAgaWYgKG1hbmlmZXN0SXRlbSkge1xuICAgICAgICBjb25zdCBocmVmID0gbWFuaWZlc3RJdGVtLmhyZWY7XG4gICAgICAgIGlmICghIWhyZWYpIHtcbiAgICAgICAgICB0aHJvdyBgTWFsZm9ybWVkIE9QRjogU3BpbmUgZG9lcyBub3QgY29udGFpbiB0b2Mgd2l0aCBpZCAke3RvY0lkfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhyZWY7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZSBzcGluZSdzIHRvYyBhdHRyaWJ1dGUgaXMgbm90IGRlZmluZWQuXG4gICAgICAvLyBsb29rIGZvciBhIG1hbmlmZXN0IGl0ZW0gd2l0aCB0aGUgbmF2IHByb3BlcnR5XG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5maW5kTWFuaWZlc3RJdGVtV2l0aFByb3BlcnRpZXMoXCJuYXZcIik7XG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICBpZiAoIWl0ZW0/LmhyZWYpIHtcbiAgICAgICAgICB0aHJvdyBgTWFsZm9ybWVkIE9QRjogTWFuaWZlc3QgY29udGFpbnMgaXRlbSB3aXRoIHByb3BlcnR5IFwibmF2XCIgYnV0IGhyZWYgaXMgZW1wdHkuYDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbS5ocmVmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbm8gbmF2IGl0ZW0gZm91bmQgLSBsb29rIGZvciBhbiBuY3ggZmlsZVxuICAgICAgICBjb25zdCBuY3hJdGVtcyA9IHRoaXMuZmluZE1hbmlmZXN0SXRlbXNXaXRoTWVkaWFUeXBlKFxuICAgICAgICAgIFwiYXBwbGljYXRpb24veC1kdGJuY3greG1sXCJcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAobmN4SXRlbXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIHRocm93IGBOY3ggbm90IGZvdW5kIGluIG1hbmlmZXN0LmA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBocmVmID0gbmN4SXRlbXNbMF0/LmhyZWY7XG5cbiAgICAgICAgaWYgKCFocmVmKSB7XG4gICAgICAgICAgdGhyb3cgYE1hbGZvcm1lZCBPUEY6IE1hbmlmZXN0IGNvbnRhaW5zIG5jeCBidXQgaHJlZiBpcyBlbXB0eS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5jeEl0ZW1zWzBdLmhyZWY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIHJlbGF0aXZlIFRPQyBmaWxlIHBhdGguXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVRvIC0gcmV0dXJuIHBhdGggcmVsYXRpdmUgdG8gdGhpcyBkaXJlY3RvcnlcbiAgICovXG4gIGZpbmRUb2NQYXRoKHJlbGF0aXZlVG8gPSBcIi9cIikge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG4gICAgY29uc3QgaHJlZiA9IHRoaXMuZmluZFRvY0hyZWYoKTtcbiAgICBpZiAoaHJlZikge1xuICAgICAgY29uc3QgdG9jUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUocmVsYXRpdmVUbyksIGhyZWYpO1xuICAgICAgcmV0dXJuIHRvY1BhdGg7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBwYXRoIHRvIHRoZSBuY3ggZmlsZSwgaWYgYW55LlxuICAgKi9cbiAgZmluZE5jeFBhdGgocmVsYXRpdmVUbykge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG5cbiAgICBjb25zdCBuY3hJdGVtcyA9IHRoaXMuZmluZE1hbmlmZXN0SXRlbXNXaXRoTWVkaWFUeXBlKFxuICAgICAgXCJhcHBsaWNhdGlvbi94LWR0Ym5jeCt4bWxcIlxuICAgICk7XG4gICAgaWYgKG5jeEl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGhyZWYgPSBuY3hJdGVtc1swXS5ocmVmO1xuICAgICAgaWYgKCEhaHJlZikge1xuICAgICAgICB0aHJvdyBcIk5jeCBmb3VuZCBpbiBtYW5pZmVzdCwgYnV0IGhyZWYgaXMgZW1wdHkuXCI7XG4gICAgICB9XG4gICAgICBjb25zdCBuY3hQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShyZWxhdGl2ZVRvKSwgaHJlZik7XG4gICAgICByZXR1cm4gbmN4UGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgXCJObyBuY3ggZm91bmQgaW4gbWFuaWZlc3QuXCI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hbmlmZXN0IE1ldGhvZHNcbiAgICovXG5cbiAgYWRkTWFuaWZlc3RJdGVtKGhyZWYsIGlkLCBtZWRpYVR5cGUpIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGVudC5wYWNrYWdlLm1hbmlmZXN0WzBdLml0ZW0ucHVzaCh7XG4gICAgICBhdHRyOiB7XG4gICAgICAgIGhyZWY6IGhyZWYsXG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgXCJtZWRpYS10eXBlXCI6IG1lZGlhVHlwZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5zb3J0TWFuaWZlc3QoKTtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudC5wYWNrYWdlLm1hbmlmZXN0O1xuICB9XG5cbiAgc29ydE1hbmlmZXN0KCkge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG4gICAgLy8gc29ydCBieSB0eXBlIGFuZCB0aGVuIGJ5IElELlxuICAgIGNvbnN0IHNvcnRlZE1hbmlmZXN0ID0gdGhpcy5fY29udGVudD8ucGFja2FnZT8ubWFuaWZlc3RbMF0uaXRlbS5zb3J0KFxuICAgICAgKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgbWVkaWFUeXBlQSA9IGEuYXR0cltcIm1lZGlhLXR5cGVcIl0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgY29uc3QgbWVkaWFUeXBlQiA9IGIuYXR0cltcIm1lZGlhLXR5cGVcIl0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgaWYgKG1lZGlhVHlwZUEgPCBtZWRpYVR5cGVCKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWRpYVR5cGVBID4gbWVkaWFUeXBlQikge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaWRBID0gYS5hdHRyLmlkLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGlkQiA9IGIuYXR0ci5pZC50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChpZEEgPCBpZEIpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkQSA+IGlkQikge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gc29ydGVkTWFuaWZlc3Q7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgZmlyc3QgbWFuaWZlc3QgaXRlbSB3aXRoIHRoZSBnaXZlbiBcInByb3BlcnRpZXNcIiBhdHRyaWJ1dGUgdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BcbiAgICovXG4gIGZpbmRNYW5pZmVzdEl0ZW1XaXRoUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cbiAgICBjb25zdCBpdGVtID0gdGhpcy5fY29udGVudC5wYWNrYWdlLm1hbmlmZXN0WzBdLml0ZW0uZmluZCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0/LmF0dHI/LnByb3BlcnRpZXMgPT09IHByb3A7XG4gICAgfSk7XG5cbiAgICBpZiAoaXRlbSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGl0ZW0uYXR0ci5pZCxcbiAgICAgICAgaHJlZjogaXRlbS5hdHRyLmhyZWYsXG4gICAgICAgIG1lZGlhVHlwZTogaXRlbS5hdHRyW1wibWVkaWEtdHlwZVwiXSxcbiAgICAgICAgcHJvcGVydGllczogaXRlbS5hdHRyPy5wcm9wZXJ0aWVzLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgbWFuaWZlc3QgaXRlbXMgd2l0aCB0aGUgZ2l2ZW4gbWVkaWEtdHlwZSBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lZGlhVHlwZVxuICAgKi9cbiAgZmluZE1hbmlmZXN0SXRlbXNXaXRoTWVkaWFUeXBlKG1lZGlhVHlwZSkge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9jb250ZW50LnBhY2thZ2UubWFuaWZlc3RbMF0uaXRlbVxuICAgICAgLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbT8uYXR0cltcIm1lZGlhLXR5cGVcIl0gPT09IG1lZGlhVHlwZTtcbiAgICAgIH0pXG4gICAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGl0ZW0uYXR0ci5pZCxcbiAgICAgICAgICBocmVmOiBpdGVtLmF0dHIuaHJlZixcbiAgICAgICAgICBtZWRpYVR5cGU6IGl0ZW0uYXR0cltcIm1lZGlhLXR5cGVcIl0sXG4gICAgICAgICAgcHJvcGVydGllczogaXRlbS5hdHRyPy5wcm9wZXJ0aWVzLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXM7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBhIG1hbmlmZXN0IGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gaWQgdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBmaW5kTWFuaWZlc3RJdGVtV2l0aElkKGlkKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cbiAgICBjb25zdCBpdGVtID0gdGhpcy5fY29udGVudC5wYWNrYWdlLm1hbmlmZXN0WzBdLml0ZW0uZmluZCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uYXR0ci5pZCA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgICBpZiAoaXRlbSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGl0ZW0uYXR0ci5pZCxcbiAgICAgICAgaHJlZjogaXRlbS5hdHRyLmhyZWYsXG4gICAgICAgIG1lZGlhVHlwZTogaXRlbS5hdHRyW1wibWVkaWEtdHlwZVwiXSxcbiAgICAgICAgcHJvcGVydGllczogaXRlbS5hdHRyPy5wcm9wZXJ0aWVzLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwb3NpdGlvbiBvZiBhIG1hbmlmZXN0IGl0ZW0gd2l0aCBpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIGZpbmRNYW5pZmVzdEl0ZW1JZFNwaW5lUG9zaXRpb24oaWQpIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9jb250ZW50LnBhY2thZ2Uuc3BpbmVbMF0uaXRlbXJlZi5maW5kSW5kZXgoXG4gICAgICAoaXRlbXJlZikgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbXJlZi5hdHRyLmlkcmVmID09PSBpZDtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFNwaW5lIE1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc3BpbmUncyBhcnJheSBvZiBpdGVtcmVmIGVsZW1lbnRzLiBFYWNoIGl0ZW1yZWYgaGFzIGFuIGlkcmVmIGF0dHJpYnV0ZS5cbiAgICogVGhlIGlkcmVmIHJlZmVyZW5jZXMgYSBtYW5pZmVzdCBpdGVtIGlkLlxuICAgKiBUaGUgb3JkZXIgb2YgdGhpcyBhcnJheSBkZXRlcm1pbmVzIHRoZSBvcmRlciBvZiByZXBlc2VudGF0aW9uIG9mIHRoZSBtYW5pZmVzdCBpdGVtcy5cbiAgICogdGhlIGxpbmVhciBhdHRyaWJ1dGUgaW5kaWNhdGVzIGlmIHRoZSBpdGVtcmVmIGlzIGluIGxpbmVhciByZXByZXNlbnRhdGlvbiBvcmRlclxuICAgKiBvciBpcyBhdXhpbGlhcnkgY29udGVudC5cbiAgICogc2VlOiBodHRwOi8vaWRwZi5vcmcvZXB1Yi8yMC9zcGVjL09QRl8yLjAuMV9kcmFmdC5odG0jU2VjdGlvbjIuNFxuICAgKi9cbiAgZ2V0IHNwaW5lSXRlbXJlZnMoKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fY29udGVudC5wYWNrYWdlLnNwaW5lWzBdLml0ZW0ubWFwKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZHJlZjogaXRlbS5hdHRyLmlkcmVmLFxuICAgICAgICBsaW5lYXI6IGl0ZW0uYXR0ci5saW5lYXIgfHwgdHJ1ZSxcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBpdGVtcmVmIGl0ZW0gdG8gdGhlIHNwaW5lXG4gICAqIEBwYXJhbSB7aW50fSBwb3NpdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRyZWZcbiAgICogQHBhcmFtIHtib29sfSBsaW5lYXJcbiAgICovXG4gIGFkZFNwaW5lSXRlbXJlZkF0UG9zaXRpb24ocG9zaXRpb24sIGlkcmVmLCBsaW5lYXIgPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5zcGluZVswXS5pdGVtcmVmLnNwbGljZShwb3NpdGlvbiwgMCwge1xuICAgICAgYXR0cjoge1xuICAgICAgICBpZHJlZjogaWRyZWYsXG4gICAgICAgIGxpbmVhcjogbGluZWFyID8gXCJ5ZXNcIiA6IFwibm9cIixcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQucGFja2FnZS5zcGluZTtcbiAgfVxuXG4gIGFkZFNwaW5lSXRlbXJlZkFmdGVySWRyZWYocG9zaXRpb25JZHJlZiwgaWRyZWYsIGxpbmVhciA9IHRydWUpIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5maW5kTWFuaWZlc3RJdGVtSWRTcGluZVBvc2l0aW9uKHBvc2l0aW9uSWRyZWYpO1xuICAgIGlmIChwb3NpdGlvbiAhPT0gLTEpIHtcbiAgICAgIHRoaXMuYWRkU3BpbmVJdGVtcmVmQXRQb3NpdGlvbihwb3NpdGlvbiwgaWRyZWYsIGxpbmVhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYElkIFwiJHtwb3NpdGlvbklkcmVmfVwiIG5vdCBmb3VuZCBpbiBtYW5pZmVzdC5gKTtcbiAgICAgIHRocm93IGBJZCBcIiR7cG9zaXRpb25JZHJlZn1cIiBub3QgZm91bmQgaW4gbWFuaWZlc3QuYDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT3BmTWFuYWdlcjtcbiJdfQ==
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _uuid = require("uuid");
var _fileManager = _interopRequireDefault(require("./file-manager"));
var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageMetadata = _interopRequireDefault(require("./package-metadata"));
var _packageManifest = _interopRequireDefault(require("./package-manifest"));
var _packageSpine = _interopRequireDefault(require("./package-spine"));
var _xml = require("./utils/xml");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}






/**
 * Package manager to create and edit opf files.
 * https://www.w3.org/publishing/epub32/epub-packages.html
 */
class PackageManager extends _packageElement.default {
  constructor(locationInEpub = "") {
    super("package", undefined, {
      xmlns: "http://www.idpf.org/2007/opf",
      dir: undefined,
      id: undefined,
      prefix: undefined,
      "xml:lang": undefined,
      "unique-identifier": undefined,
      version: "3.0" });


    this._location = locationInEpub; // the path relative to the epub root.
    this.metadata = undefined;
    this.manifest = undefined;
    this.spine = undefined;
    this.rawData = undefined;
  }

  set location(locationInEpub) {
    this._location = locationInEpub; // the path relative to the epub root.
    if (this.manifest) {
      this.manifest.location = locationInEpub;
    }
  }

  get location() {
    return this._location;
  }

  /**
   * Set the unique identifier of the ebook. This sets both the package
   * 'unique-identifier' id value which refers to a meta tag as well as the
   * meta tag value and id.
   * Note that the uid has side-effects with epub font obfuscation. The UID
   * is used as the obfuscation key and obfuscated fonts must be
   * re-processed when changing this value.
   * @param {string} value the UUID or other unique identifier
   * @param {string} id - the id of the meta tag that marks it as the uid.
   */
  setUniqueIdentifier(value, id = "pub-id") {
    const existingId = this.attributes["unique-identifier"];
    this.attributes["unique-identifier"] = id;

    const uidMetadata = existingId ?
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
   */
  findUniqueIdentifier() {
    const metadataId = this.attributes["unique-identifier"];
    if (metadataId) {
      const uidMetadata = this.metadata.findItemWithId(
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
   */
  findNcxFilePath() {
    const tocId = this.spine.toc;
    if (tocId) {
      const ncxItem = this.manifest.findItemWithId(tocId);
      if (ncxItem) {
        return _fileManager.default.resolveIriToEpubLocation(
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
   */
  findNavigationFilePath() {
    const spineItem = this.manifest.findNav();
    if (spineItem) {
      return _fileManager.default.resolveIriToEpubLocation(
      spineItem.href,
      this.location);

    }
    return;
  }

  /**
   * Initialize a new empty package.
   */
  create() {
    const uuid = `urn:uuid:${(0, _uuid.v4)()}`;

    this.metadata = new _packageMetadata.default();
    this.manifest = new _packageManifest.default();
    this.spine = new _packageSpine.default();
    this.setUniqueIdentifier(uuid);
  }

  /**
   * Initialize a new package object using the provided xml.
   * @param {string | buffer} data - the xml data
   */
  async loadXml(data) {
    const result = await (0, _xml.parseXml)(data);

    if (result) {
      this.rawData = result;

      if (this.rawData.package.attr) {
        this.addAttributes(this.rawData.package.attr);
      }

      // construct metadata section
      const rawMetadata = result.package.metadata[0];
      const formatedMetadata = Object.entries(rawMetadata).flatMap(
      ([key, value]) => {
        if (key === "attr") return [];
        if (Array.isArray(value)) {
          return value.flatMap(entry => {
            return {
              element: key,
              value: entry === null || entry === void 0 ? void 0 : entry.val,
              attributes: entry === null || entry === void 0 ? void 0 : entry.attr };

          });
        }
      });


      this.metadata = new _packageMetadata.default(formatedMetadata, rawMetadata === null || rawMetadata === void 0 ? void 0 : rawMetadata.attr);

      // construct the manifest section
      const rawManifest = result.package.manifest[0];
      const manifestItems = Object.entries(rawManifest).flatMap(
      ([key, value]) => {
        if (key === "attr") return [];
        if (Array.isArray(value)) {
          return value.flatMap(entry => {
            return entry.attr;
          });
        }
      });


      this.manifest = new _packageManifest.default(
      manifestItems,
      rawManifest === null || rawManifest === void 0 ? void 0 : rawManifest.attr,
      this._location);


      // construct the manifest section
      const rawSpine = result.package.spine[0];
      const spineItems = Object.entries(rawSpine).flatMap(([key, value]) => {
        if (key === "attr") return [];
        if (Array.isArray(value)) {
          return value.flatMap(entry => {
            return entry.attr;
          });
        }
      });

      this.spine = new _packageSpine.default(spineItems, rawSpine === null || rawSpine === void 0 ? void 0 : rawSpine.attr);
    } else {
      console.error("Error parsing XML");
    }
  }

  /**
   * Get the xml string data
   * @returns {string}
   */
  async getXml() {
    const xml = await (0, _xml.generateXml)(this.getXml2JsObject());
    return xml;
  }

  /**
   * Build the xml2Js object for conversion to raw xml
   * @returns {object}
   */
  getXml2JsObject() {
    const filterAttributes = attributes => {
      if (Object.keys(attributes).length) {
        const attr = Object.entries(attributes).
        filter(([key, value]) => {
          return value !== undefined;
        }).
        reduce((obj, [key, value]) => {
          obj[key] = attributes[key];
          return obj;
        }, {});

        if (Object.keys(attr).length) {
          return attr;
        }
      }
      return undefined;
    };

    const prepareChildrenForXml = items => {
      const dataList = {};
      items.forEach(item => {
        const data = {};
        if (item.attributes) {
          const attr = filterAttributes(item.attributes);
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
    let xmlJsMetadata = prepareChildrenForXml(this.metadata.items);
    const metadataAttr = filterAttributes(this.metadata.attributes);

    if (metadataAttr) {
      xmlJsMetadata.attr = metadataAttr;
    }

    /* Manifest */
    let xmlJsManifest = prepareChildrenForXml(this.manifest.items);
    const manifestAttr = filterAttributes(this.manifest.attributes);

    if (manifestAttr) {
      xmlJsManifest.attr = manifestAttr;
    }

    /* Spine */
    let xmlJsSpine = prepareChildrenForXml(this.spine.items);
    const spineAttr = filterAttributes(this.manifest.attributes);

    if (spineAttr) {
      xmlJsSpine.attr = spineAttr;
    }

    return {
      package: {
        attr: filterAttributes(this.attributes),
        metadata: [xmlJsMetadata],
        manifest: [xmlJsManifest],
        spine: [xmlJsSpine] } };


  }}exports.default = PackageManager;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiUGFja2FnZU1hbmFnZXIiLCJQYWNrYWdlRWxlbWVudCIsImNvbnN0cnVjdG9yIiwibG9jYXRpb25JbkVwdWIiLCJ1bmRlZmluZWQiLCJ4bWxucyIsImRpciIsImlkIiwicHJlZml4IiwidmVyc2lvbiIsIl9sb2NhdGlvbiIsIm1ldGFkYXRhIiwibWFuaWZlc3QiLCJzcGluZSIsInJhd0RhdGEiLCJsb2NhdGlvbiIsInNldFVuaXF1ZUlkZW50aWZpZXIiLCJ2YWx1ZSIsImV4aXN0aW5nSWQiLCJhdHRyaWJ1dGVzIiwidWlkTWV0YWRhdGEiLCJmaW5kSXRlbVdpdGhJZCIsImFkZEl0ZW0iLCJmaW5kVW5pcXVlSWRlbnRpZmllciIsIm1ldGFkYXRhSWQiLCJmaW5kTmN4RmlsZVBhdGgiLCJ0b2NJZCIsInRvYyIsIm5jeEl0ZW0iLCJGaWxlTWFuYWdlciIsInJlc29sdmVJcmlUb0VwdWJMb2NhdGlvbiIsImhyZWYiLCJmaW5kTmF2aWdhdGlvbkZpbGVQYXRoIiwic3BpbmVJdGVtIiwiZmluZE5hdiIsImNyZWF0ZSIsInV1aWQiLCJQYWNrYWdlTWV0YWRhdGEiLCJQYWNrYWdlTWFuaWZlc3QiLCJQYWNrYWdlU3BpbmUiLCJsb2FkWG1sIiwiZGF0YSIsInJlc3VsdCIsInBhY2thZ2UiLCJhdHRyIiwiYWRkQXR0cmlidXRlcyIsInJhd01ldGFkYXRhIiwiZm9ybWF0ZWRNZXRhZGF0YSIsIk9iamVjdCIsImVudHJpZXMiLCJmbGF0TWFwIiwia2V5IiwiQXJyYXkiLCJpc0FycmF5IiwiZW50cnkiLCJlbGVtZW50IiwidmFsIiwicmF3TWFuaWZlc3QiLCJtYW5pZmVzdEl0ZW1zIiwicmF3U3BpbmUiLCJzcGluZUl0ZW1zIiwiY29uc29sZSIsImVycm9yIiwiZ2V0WG1sIiwieG1sIiwiZ2V0WG1sMkpzT2JqZWN0IiwiZmlsdGVyQXR0cmlidXRlcyIsImtleXMiLCJsZW5ndGgiLCJmaWx0ZXIiLCJyZWR1Y2UiLCJvYmoiLCJwcmVwYXJlQ2hpbGRyZW5Gb3JYbWwiLCJpdGVtcyIsImRhdGFMaXN0IiwiZm9yRWFjaCIsIml0ZW0iLCJwdXNoIiwieG1sSnNNZXRhZGF0YSIsIm1ldGFkYXRhQXR0ciIsInhtbEpzTWFuaWZlc3QiLCJtYW5pZmVzdEF0dHIiLCJ4bWxKc1NwaW5lIiwic3BpbmVBdHRyIl0sIm1hcHBpbmdzIjoib0dBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQzs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsY0FBTixTQUE2QkMsdUJBQTdCLENBQTRDO0FBQ3pEQyxFQUFBQSxXQUFXLENBQUNDLGNBQWMsR0FBRyxFQUFsQixFQUFzQjtBQUMvQixVQUFNLFNBQU4sRUFBaUJDLFNBQWpCLEVBQTRCO0FBQzFCQyxNQUFBQSxLQUFLLEVBQUUsOEJBRG1CO0FBRTFCQyxNQUFBQSxHQUFHLEVBQUVGLFNBRnFCO0FBRzFCRyxNQUFBQSxFQUFFLEVBQUVILFNBSHNCO0FBSTFCSSxNQUFBQSxNQUFNLEVBQUVKLFNBSmtCO0FBSzFCLGtCQUFZQSxTQUxjO0FBTTFCLDJCQUFxQkEsU0FOSztBQU8xQkssTUFBQUEsT0FBTyxFQUFFLEtBUGlCLEVBQTVCOzs7QUFVQSxTQUFLQyxTQUFMLEdBQWlCUCxjQUFqQixDQVgrQixDQVdFO0FBQ2pDLFNBQUtRLFFBQUwsR0FBZ0JQLFNBQWhCO0FBQ0EsU0FBS1EsUUFBTCxHQUFnQlIsU0FBaEI7QUFDQSxTQUFLUyxLQUFMLEdBQWFULFNBQWI7QUFDQSxTQUFLVSxPQUFMLEdBQWVWLFNBQWY7QUFDRDs7QUFFVyxNQUFSVyxRQUFRLENBQUNaLGNBQUQsRUFBaUI7QUFDM0IsU0FBS08sU0FBTCxHQUFpQlAsY0FBakIsQ0FEMkIsQ0FDTTtBQUNqQyxRQUFJLEtBQUtTLFFBQVQsRUFBbUI7QUFDakIsV0FBS0EsUUFBTCxDQUFjRyxRQUFkLEdBQXlCWixjQUF6QjtBQUNEO0FBQ0Y7O0FBRVcsTUFBUlksUUFBUSxHQUFHO0FBQ2IsV0FB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QUszRCxLQUFMLENBQVc0RCxLQUFaLENBQXRDO0FBQ0EsVUFBTVUsU0FBUyxHQUFHakIsZ0JBQWdCLENBQUMsS0FBS3RELFFBQUwsQ0FBY08sVUFBZixDQUFsQzs7QUFFQSxRQUFJZ0UsU0FBSixFQUFlO0FBQ2JELE1BQUFBLFVBQVUsQ0FBQ3RDLElBQVgsR0FBa0J1QyxTQUFsQjtBQUNEOztBQUVELFdBQU87QUFDTHhDLE1BQUFBLE9BQU8sRUFBRTtBQUNQQyxRQUFBQSxJQUFJLEVBQUVzQixnQkFBZ0IsQ0FBQyxLQUFLL0MsVUFBTixDQURmO0FBRVBSLFFBQUFBLFFBQVEsRUFBRSxDQUFDbUUsYUFBRCxDQUZIO0FBR1BsRSxRQUFBQSxRQUFRLEVBQUUsQ0FBQ29FLGFBQUQsQ0FISDtBQUlQbkUsUUFBQUEsS0FBSyxFQUFFLENBQUNxRSxVQUFELENBSkEsRUFESixFQUFQOzs7QUFRRCxHQWxSd0QsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tIFwidXVpZFwiO1xuaW1wb3J0IEZpbGVNYW5hZ2VyIGZyb20gXCIuL2ZpbGUtbWFuYWdlclwiO1xuaW1wb3J0IFBhY2thZ2VFbGVtZW50IGZyb20gXCIuL3BhY2thZ2UtZWxlbWVudFwiO1xuaW1wb3J0IFBhY2thZ2VNZXRhZGF0YSBmcm9tIFwiLi9wYWNrYWdlLW1ldGFkYXRhXCI7XG5pbXBvcnQgUGFja2FnZU1hbmlmZXN0IGZyb20gXCIuL3BhY2thZ2UtbWFuaWZlc3RcIjtcbmltcG9ydCBQYWNrYWdlU3BpbmUgZnJvbSBcIi4vcGFja2FnZS1zcGluZVwiO1xuaW1wb3J0IHtcbiAgcGFyc2VYbWwsXG4gIGdlbmVyYXRlWG1sLFxuICBmaWx0ZXJBdHRyaWJ1dGVzLFxuICBwcmVwYXJlSXRlbXNGb3JYbWwsXG59IGZyb20gXCIuL3V0aWxzL3htbFwiO1xuXG4vKipcbiAqIFBhY2thZ2UgbWFuYWdlciB0byBjcmVhdGUgYW5kIGVkaXQgb3BmIGZpbGVzLlxuICogaHR0cHM6Ly93d3cudzMub3JnL3B1Ymxpc2hpbmcvZXB1YjMyL2VwdWItcGFja2FnZXMuaHRtbFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlTWFuYWdlciBleHRlbmRzIFBhY2thZ2VFbGVtZW50IHtcbiAgY29uc3RydWN0b3IobG9jYXRpb25JbkVwdWIgPSBcIlwiKSB7XG4gICAgc3VwZXIoXCJwYWNrYWdlXCIsIHVuZGVmaW5lZCwge1xuICAgICAgeG1sbnM6IFwiaHR0cDovL3d3dy5pZHBmLm9yZy8yMDA3L29wZlwiLFxuICAgICAgZGlyOiB1bmRlZmluZWQsXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgcHJlZml4OiB1bmRlZmluZWQsXG4gICAgICBcInhtbDpsYW5nXCI6IHVuZGVmaW5lZCxcbiAgICAgIFwidW5pcXVlLWlkZW50aWZpZXJcIjogdW5kZWZpbmVkLFxuICAgICAgdmVyc2lvbjogXCIzLjBcIixcbiAgICB9KTtcblxuICAgIHRoaXMuX2xvY2F0aW9uID0gbG9jYXRpb25JbkVwdWI7IC8vIHRoZSBwYXRoIHJlbGF0aXZlIHRvIHRoZSBlcHViIHJvb3QuXG4gICAgdGhpcy5tZXRhZGF0YSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm1hbmlmZXN0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3BpbmUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yYXdEYXRhID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uSW5FcHViKSB7XG4gICAgdGhpcy5fbG9jYXRpb24gPSBsb2NhdGlvbkluRXB1YjsgLy8gdGhlIHBhdGggcmVsYXRpdmUgdG8gdGhlIGVwdWIgcm9vdC5cbiAgICBpZiAodGhpcy5tYW5pZmVzdCkge1xuICAgICAgdGhpcy5tYW5pZmVzdC5sb2NhdGlvbiA9IGxvY2F0aW9uSW5FcHViO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgZWJvb2suIFRoaXMgc2V0cyBib3RoIHRoZSBwYWNrYWdlXG4gICAqICd1bmlxdWUtaWRlbnRpZmllcicgaWQgdmFsdWUgd2hpY2ggcmVmZXJzIHRvIGEgbWV0YSB0YWcgYXMgd2VsbCBhcyB0aGVcbiAgICogbWV0YSB0YWcgdmFsdWUgYW5kIGlkLlxuICAgKiBOb3RlIHRoYXQgdGhlIHVpZCBoYXMgc2lkZS1lZmZlY3RzIHdpdGggZXB1YiBmb250IG9iZnVzY2F0aW9uLiBUaGUgVUlEXG4gICAqIGlzIHVzZWQgYXMgdGhlIG9iZnVzY2F0aW9uIGtleSBhbmQgb2JmdXNjYXRlZCBmb250cyBtdXN0IGJlXG4gICAqIHJlLXByb2Nlc3NlZCB3aGVuIGNoYW5naW5nIHRoaXMgdmFsdWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSB0aGUgVVVJRCBvciBvdGhlciB1bmlxdWUgaWRlbnRpZmllclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgaWQgb2YgdGhlIG1ldGEgdGFnIHRoYXQgbWFya3MgaXQgYXMgdGhlIHVpZC5cbiAgICovXG4gIHNldFVuaXF1ZUlkZW50aWZpZXIodmFsdWUsIGlkID0gXCJwdWItaWRcIikge1xuICAgIGNvbnN0IGV4aXN0aW5nSWQgPSB0aGlzLmF0dHJpYnV0ZXNbXCJ1bmlxdWUtaWRlbnRpZmllclwiXTtcbiAgICB0aGlzLmF0dHJpYnV0ZXNbXCJ1bmlxdWUtaWRlbnRpZmllclwiXSA9IGlkO1xuXG4gICAgY29uc3QgdWlkTWV0YWRhdGEgPSBleGlzdGluZ0lkXG4gICAgICA/IHRoaXMubWV0YWRhdGEuZmluZEl0ZW1XaXRoSWQoXCJkYzppZGVudGlmaWVyXCIsIGV4aXN0aW5nSWQpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmICh1aWRNZXRhZGF0YSkge1xuICAgICAgdWlkTWV0YWRhdGEudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHVpZE1ldGFkYXRhLmlkID0gaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWV0YWRhdGEuYWRkSXRlbShcImRjOmlkZW50aWZpZXJcIiwgdmFsdWUsIHsgaWQ6IGlkIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBlcHViIHVuaXF1ZS1pZGVudGlmZXIgdmFsdWVcbiAgICovXG4gIGZpbmRVbmlxdWVJZGVudGlmaWVyKCkge1xuICAgIGNvbnN0IG1ldGFkYXRhSWQgPSB0aGlzLmF0dHJpYnV0ZXNbXCJ1bmlxdWUtaWRlbnRpZmllclwiXTtcbiAgICBpZiAobWV0YWRhdGFJZCkge1xuICAgICAgY29uc3QgdWlkTWV0YWRhdGEgPSB0aGlzLm1ldGFkYXRhLmZpbmRJdGVtV2l0aElkKFxuICAgICAgICBcImRjOmlkZW50aWZpZXJcIixcbiAgICAgICAgbWV0YWRhdGFJZFxuICAgICAgKTtcbiAgICAgIGlmICh1aWRNZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gdWlkTWV0YWRhdGEudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExlZ2FjeSBFcHViIDIuMCBzcGVjaWZpY2F0aW9uIHN0YXRlcyB0aGF0IGEgc3BpbmUgZWxlbWVudCB3aXRoIHRoZSAndG9jJyBhdHRyaWJ1dGVcbiAgICogaWRlbnRpZmllcyB0aGUgaWRyZWYgb2YgdGhlIE5DWCBmaWxlIGluIHRoZSBtYW5pZmVzdFxuICAgKiBUT0RPIC0gaGFuZGxlIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSB1cmxzLiByZXNvbHZlIHBhdGhcbiAgICovXG4gIGZpbmROY3hGaWxlUGF0aCgpIHtcbiAgICBjb25zdCB0b2NJZCA9IHRoaXMuc3BpbmUudG9jO1xuICAgIGlmICh0b2NJZCkge1xuICAgICAgY29uc3QgbmN4SXRlbSA9IHRoaXMubWFuaWZlc3QuZmluZEl0ZW1XaXRoSWQodG9jSWQpO1xuICAgICAgaWYgKG5jeEl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIEZpbGVNYW5hZ2VyLnJlc29sdmVJcmlUb0VwdWJMb2NhdGlvbihcbiAgICAgICAgICBuY3hJdGVtLmhyZWYsXG4gICAgICAgICAgdGhpcy5sb2NhdGlvblxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgaHJlZiBvZiB0aGUgbWFuaWZlc3QgaXRlbSB3aXRoIHByb3BlcnRpZXM9XCJuYXZcIiBhdHRyaWJ1dGVcbiAgICogaHR0cHM6Ly93d3cudzMub3JnL3B1Ymxpc2hpbmcvZXB1YjMyL2VwdWItcGFja2FnZXMuaHRtbCNzZWMtcGFja2FnZS1uYXZcbiAgICogVE9ETyAtIGhhbmRsZSByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgdXJscy4gcmVzb2x2ZSBwYXRoXG4gICAqL1xuICBmaW5kTmF2aWdhdGlvbkZpbGVQYXRoKCkge1xuICAgIGNvbnN0IHNwaW5lSXRlbSA9IHRoaXMubWFuaWZlc3QuZmluZE5hdigpO1xuICAgIGlmIChzcGluZUl0ZW0pIHtcbiAgICAgIHJldHVybiBGaWxlTWFuYWdlci5yZXNvbHZlSXJpVG9FcHViTG9jYXRpb24oXG4gICAgICAgIHNwaW5lSXRlbS5ocmVmLFxuICAgICAgICB0aGlzLmxvY2F0aW9uXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBlbXB0eSBwYWNrYWdlLlxuICAgKi9cbiAgY3JlYXRlKCkge1xuICAgIGNvbnN0IHV1aWQgPSBgdXJuOnV1aWQ6JHt1dWlkdjQoKX1gO1xuXG4gICAgdGhpcy5tZXRhZGF0YSA9IG5ldyBQYWNrYWdlTWV0YWRhdGEoKTtcbiAgICB0aGlzLm1hbmlmZXN0ID0gbmV3IFBhY2thZ2VNYW5pZmVzdCgpO1xuICAgIHRoaXMuc3BpbmUgPSBuZXcgUGFja2FnZVNwaW5lKCk7XG4gICAgdGhpcy5zZXRVbmlxdWVJZGVudGlmaWVyKHV1aWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgcGFja2FnZSBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIHhtbC5cbiAgICogQHBhcmFtIHtzdHJpbmcgfCBidWZmZXJ9IGRhdGEgLSB0aGUgeG1sIGRhdGFcbiAgICovXG4gIGFzeW5jIGxvYWRYbWwoZGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBhcnNlWG1sKGRhdGEpO1xuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgdGhpcy5yYXdEYXRhID0gcmVzdWx0O1xuXG4gICAgICBpZiAodGhpcy5yYXdEYXRhLnBhY2thZ2UuYXR0cikge1xuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZXModGhpcy5yYXdEYXRhLnBhY2thZ2UuYXR0cik7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnN0cnVjdCBtZXRhZGF0YSBzZWN0aW9uXG4gICAgICBjb25zdCByYXdNZXRhZGF0YSA9IHJlc3VsdC5wYWNrYWdlLm1ldGFkYXRhWzBdO1xuICAgICAgY29uc3QgZm9ybWF0ZWRNZXRhZGF0YSA9IE9iamVjdC5lbnRyaWVzKHJhd01ldGFkYXRhKS5mbGF0TWFwKFxuICAgICAgICAoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gXCJhdHRyXCIpIHJldHVybiBbXTtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mbGF0TWFwKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZW50cnk/LnZhbCxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBlbnRyeT8uYXR0cixcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgdGhpcy5tZXRhZGF0YSA9IG5ldyBQYWNrYWdlTWV0YWRhdGEoZm9ybWF0ZWRNZXRhZGF0YSwgcmF3TWV0YWRhdGE/LmF0dHIpO1xuXG4gICAgICAvLyBjb25zdHJ1Y3QgdGhlIG1hbmlmZXN0IHNlY3Rpb25cbiAgICAgIGNvbnN0IHJhd01hbmlmZXN0ID0gcmVzdWx0LnBhY2thZ2UubWFuaWZlc3RbMF07XG4gICAgICBjb25zdCBtYW5pZmVzdEl0ZW1zID0gT2JqZWN0LmVudHJpZXMocmF3TWFuaWZlc3QpLmZsYXRNYXAoXG4gICAgICAgIChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSBcImF0dHJcIikgcmV0dXJuIFtdO1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZsYXRNYXAoKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBlbnRyeS5hdHRyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICB0aGlzLm1hbmlmZXN0ID0gbmV3IFBhY2thZ2VNYW5pZmVzdChcbiAgICAgICAgbWFuaWZlc3RJdGVtcyxcbiAgICAgICAgcmF3TWFuaWZlc3Q/LmF0dHIsXG4gICAgICAgIHRoaXMuX2xvY2F0aW9uXG4gICAgICApO1xuXG4gICAgICAvLyBjb25zdHJ1Y3QgdGhlIG1hbmlmZXN0IHNlY3Rpb25cbiAgICAgIGNvbnN0IHJhd1NwaW5lID0gcmVzdWx0LnBhY2thZ2Uuc3BpbmVbMF07XG4gICAgICBjb25zdCBzcGluZUl0ZW1zID0gT2JqZWN0LmVudHJpZXMocmF3U3BpbmUpLmZsYXRNYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBcImF0dHJcIikgcmV0dXJuIFtdO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUuZmxhdE1hcCgoZW50cnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbnRyeS5hdHRyO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zcGluZSA9IG5ldyBQYWNrYWdlU3BpbmUoc3BpbmVJdGVtcywgcmF3U3BpbmU/LmF0dHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBYTUxcIik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgeG1sIHN0cmluZyBkYXRhXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBhc3luYyBnZXRYbWwoKSB7XG4gICAgY29uc3QgeG1sID0gYXdhaXQgZ2VuZXJhdGVYbWwodGhpcy5nZXRYbWwySnNPYmplY3QoKSk7XG4gICAgcmV0dXJuIHhtbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZCB0aGUgeG1sMkpzIG9iamVjdCBmb3IgY29udmVyc2lvbiB0byByYXcgeG1sXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAqL1xuICBnZXRYbWwySnNPYmplY3QoKSB7XG4gICAgY29uc3QgZmlsdGVyQXR0cmlidXRlcyA9IChhdHRyaWJ1dGVzKSA9PiB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKVxuICAgICAgICAgIC5maWx0ZXIoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAucmVkdWNlKChvYmosIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgb2JqW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMoYXR0cikubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcblxuICAgIGNvbnN0IHByZXBhcmVDaGlsZHJlbkZvclhtbCA9IChpdGVtcykgPT4ge1xuICAgICAgY29uc3QgZGF0YUxpc3QgPSB7fTtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICBpZiAoaXRlbS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgYXR0ciA9IGZpbHRlckF0dHJpYnV0ZXMoaXRlbS5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgZGF0YS5hdHRyID0gYXR0cjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0udmFsdWUpIHtcbiAgICAgICAgICBkYXRhLnZhbCA9IGl0ZW0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YUxpc3RbaXRlbS5lbGVtZW50XSkpIHtcbiAgICAgICAgICBkYXRhTGlzdFtpdGVtLmVsZW1lbnRdLnB1c2goZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YUxpc3RbaXRlbS5lbGVtZW50XSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGF0YUxpc3Q7XG4gICAgfTtcblxuICAgIC8qIE1ldGFkYXRhICovXG4gICAgbGV0IHhtbEpzTWV0YWRhdGEgPSBwcmVwYXJlQ2hpbGRyZW5Gb3JYbWwodGhpcy5tZXRhZGF0YS5pdGVtcyk7XG4gICAgY29uc3QgbWV0YWRhdGFBdHRyID0gZmlsdGVyQXR0cmlidXRlcyh0aGlzLm1ldGFkYXRhLmF0dHJpYnV0ZXMpO1xuXG4gICAgaWYgKG1ldGFkYXRhQXR0cikge1xuICAgICAgeG1sSnNNZXRhZGF0YS5hdHRyID0gbWV0YWRhdGFBdHRyO1xuICAgIH1cblxuICAgIC8qIE1hbmlmZXN0ICovXG4gICAgbGV0IHhtbEpzTWFuaWZlc3QgPSBwcmVwYXJlQ2hpbGRyZW5Gb3JYbWwodGhpcy5tYW5pZmVzdC5pdGVtcyk7XG4gICAgY29uc3QgbWFuaWZlc3RBdHRyID0gZmlsdGVyQXR0cmlidXRlcyh0aGlzLm1hbmlmZXN0LmF0dHJpYnV0ZXMpO1xuXG4gICAgaWYgKG1hbmlmZXN0QXR0cikge1xuICAgICAgeG1sSnNNYW5pZmVzdC5hdHRyID0gbWFuaWZlc3RBdHRyO1xuICAgIH1cblxuICAgIC8qIFNwaW5lICovXG4gICAgbGV0IHhtbEpzU3BpbmUgPSBwcmVwYXJlQ2hpbGRyZW5Gb3JYbWwodGhpcy5zcGluZS5pdGVtcyk7XG4gICAgY29uc3Qgc3BpbmVBdHRyID0gZmlsdGVyQXR0cmlidXRlcyh0aGlzLm1hbmlmZXN0LmF0dHJpYnV0ZXMpO1xuXG4gICAgaWYgKHNwaW5lQXR0cikge1xuICAgICAgeG1sSnNTcGluZS5hdHRyID0gc3BpbmVBdHRyO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwYWNrYWdlOiB7XG4gICAgICAgIGF0dHI6IGZpbHRlckF0dHJpYnV0ZXModGhpcy5hdHRyaWJ1dGVzKSxcbiAgICAgICAgbWV0YWRhdGE6IFt4bWxKc01ldGFkYXRhXSxcbiAgICAgICAgbWFuaWZlc3Q6IFt4bWxKc01hbmlmZXN0XSxcbiAgICAgICAgc3BpbmU6IFt4bWxKc1NwaW5lXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIl19
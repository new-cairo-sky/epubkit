"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
 * Manager for the opf file
 * https://www.w3.org/publishing/epub32/epub-packages.html
 */
class OpfManager {
  constructor() {
    this._content = undefined;
    this._loaded = false;
  }

  /**
   * Initialize the opf with provided data.
   * @param {object} data
   */
  init(data) {
    this._content = data;
    this._loaded = true;
    return data;
  }

  /**
   * Public API Getters and Setters
   */

  /**
   * Get the full opf content as an object
   */
  get content() {
    return this._content;
  }

  /**
   * Public properties of the root Package element.
   */

  /**
   * Get the package's optional language direction attribute
   * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
   */
  get dir() {var _this$_content$packag;
    return (_this$_content$packag = this._content.package.attr) === null || _this$_content$packag === void 0 ? void 0 : _this$_content$packag["dir"];
  }

  /**
   * Set the package's optional language direction attribute
   * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
   */
  set dir(dir) {
    this._content.package.attr["dir"] = dir;
  }

  /**
   * Get the package's optional id attribute
   * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
   * @returns {string}
   */
  get id() {var _this$_content$packag2;
    return (_this$_content$packag2 = this._content.package.attr) === null || _this$_content$packag2 === void 0 ? void 0 : _this$_content$packag2["id"];
  }

  /**
   * Set the package's optional id attribute
   * https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs
   * @param {string} id
   */
  set id(id) {
    this._content.package.attr["id"] = id;
  }

  /**
   * Get the root Package unique-identifier attribute.
   * Note: this is NOT the UID, but the id of the metadata dc:identifier that holds the value.
   * https://www.w3.org/publishing/epub32/epub-packages.html#attrdef-package-unique-identifier
   * @returns {string}
   */
  get uniqueIdentifier() {var _this$_content$packag3;
    return (_this$_content$packag3 = this._content.package.attr) === null || _this$_content$packag3 === void 0 ? void 0 : _this$_content$packag3["unique-identifier"];
  }

  /**
   * Set the root Package unique-identifier attribute
   * Note: this is NOT the UID, but the id of the metadata dc:identifier that holds the value.
   * https://www.w3.org/publishing/epub32/epub-packages.html#attrdef-package-unique-identifier
   * @param {string} id
   */
  set uniqueIdentifier(id) {
    this._content.package.attr["unique-identifier"] = id;
  }

  /**
   * Get the actual unique identifier value using the id provided by "unique-identifier"
   * package element attribute
   * https://www.w3.org/publishing/epub32/epub-packages.html#sec-opf-dcidentifier
   */
  get uniqueDCIdentifier() {var _metadata$, _metadata$$metaKey;
    const metadataId = this._content.package.attr["unique-identifier"];
    const metadata = this.findMetadataValueWithAttribute("id", metadataId);
    if (!metadata.length) {
      return;
    }
    const metaKey = Object.keys(metadata[0])[0];
    const uid = metadata === null || metadata === void 0 ? void 0 : (_metadata$ = metadata[0]) === null || _metadata$ === void 0 ? void 0 : (_metadata$$metaKey = _metadata$[metaKey]) === null || _metadata$$metaKey === void 0 ? void 0 : _metadata$$metaKey.value;
    return uid;
  }

  /**
   * Set the unique identifier value using the id provided by "unique-identifier"
   * package element attribute
   * https://www.w3.org/publishing/epub32/epub-packages.html#sec-opf-dcidentifier
   */
  set uniqueDCIdentifier(uid) {
    const metadataId = this._content.package.attr["unique-identifier"];

    const metadata = this.findMetadataValueWithAttribute("id", metadataId);
    if (metadata.length > 0) {
      // unique id is already set - need to remove it
      this.removeMetadata("dc:identifier", metadataId);
      if (metadata[0]["dc:identifier"] !== uid) {
        // If the old value is different from the new one, it is still a valid piece of metadata.
        // Add it back without the 'id' attr that marks it as the 'unique-identifier'
        this.addMetadata("dc:identifier", metadata[0]["dc:identifier"]);
      }
    }

    this.addMetadata("dc:identifier", uid, [{ id: metadataId }]);
  }

  /**
   * Get array of manifest objects
   * @returns {array} - an array of objects in the shape of
   * [{
   *  id: string,
   *  href: string,
   *  mediaType: string
   * }]
   */
  get manifestItems() {
    const items = this._content.package.manifest[0].item.map(item => {
      return {
        id: item.attr.id,
        href: item.attr.href,
        mediaType: item.attr["media-type"] };

    });
    return items;
  }

  /**
   * Metadata
   * http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.2
   */

  /**
   * Get the opf metadata as an object with keys for each entry.
   * The metadata tags attributes are added to the key 'attributes'
   * @returns {object} - an object of keyed metadata
   */
  get metadata() {
    //const metadata = this._content.package.metadata[0].;
    let metadata = {};

    for (let [key, value] of Object.entries(
    this._content.package.metadata[0]))
    {
      if (key === "attr") {
        metadata["attributes"] = value;
      } else if (this._content.package.metadata[0].hasOwnProperty(key)) {
        metadata[key] = this.findMetadataValue(key);
      }
    }

    return metadata;
  }

  get rawMetadata() {
    return this._content.package.metadata[0];
  }

  /**
   *
   * @param {string} key - key of the metadata
   * @param {string} value - the value of the metadata
   * @param {array} attributes - list of attribute objects: [{key: value}]
   */
  addMetadata(key, value, attributes = []) {
    if (!this._content.package.metadata[0][key]) {
      this._content.package.metadata[0][key] = [];
    }
    if (attributes.length > 0) {
      const item = {
        val: value,
        attr: attributes };

      this._content.package.metadata[0][key].push(item);
    } else {
      this._content.package.metadata[0][key].push(value);
    }
  }

  removeMetadata(key, id = undefined) {var _this$_content$packag4;
    if ((_this$_content$packag4 = this._content.package.metadata[0]) !== null && _this$_content$packag4 !== void 0 && _this$_content$packag4[key]) {
      if (
      id &&
      this._content.package.metadata[0][key].attributes.find(attr => {
        return (attr === null || attr === void 0 ? void 0 : attr.id) === id;
      }))
      {
        delete this._content.package.metadata[0][key];
      }
    } else {
      delete this._content.package.metadata[0][key];
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
   */
  findMetadataValue(key) {
    const metadata = [];

    if (this._content.package.metadata[0][key]) {
      const value = this._content.package.metadata[0][key];
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === "object" && item !== null) {
            const newMetadata = {};
            for (let [itemKey, itemValue] of Object.entries(item)) {
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
  }

  findMetadataValueWithAttribute(attrKey, attrValue = undefined) {
    let foundMetadata = [];
    Object.entries(this.metadata).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(meta => {var _meta$attributes;
          if (meta !== null && meta !== void 0 && (_meta$attributes = meta.attributes) !== null && _meta$attributes !== void 0 && _meta$attributes[attrKey]) {
            if (attrValue) {var _meta$attributes2;
              if ((meta === null || meta === void 0 ? void 0 : (_meta$attributes2 = meta.attributes) === null || _meta$attributes2 === void 0 ? void 0 : _meta$attributes2[attrKey]) === attrValue) {
                foundMetadata.push({ [key]: meta });
              }
            } else {
              foundMetadata.push({ [key]: meta });
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
   */
  findMetadataTitles() {
    const titles = this.findMetadataValue["dc:title"];
    if (titles) {
      return titles;
    }
    return [];
  }

  findMetadataCreators() {
    const creators = this.findMetadataValue["dc:creator"];
    if (creators) {
      return creators;
    }
    return [];
  }

  /**
   * Get's the toc attribute of the spine tag
   * The toc attribute value is the id of the toc item in the manifest
   */
  get spineToc() {var _this$_content, _this$_content$packag5, _this$_content$packag6, _this$_content$packag7;
    return this === null || this === void 0 ? void 0 : (_this$_content = this._content) === null || _this$_content === void 0 ? void 0 : (_this$_content$packag5 = _this$_content.package) === null || _this$_content$packag5 === void 0 ? void 0 : (_this$_content$packag6 = _this$_content$packag5.spine) === null || _this$_content$packag6 === void 0 ? void 0 : (_this$_content$packag7 = _this$_content$packag6.attr) === null || _this$_content$packag7 === void 0 ? void 0 : _this$_content$packag7.toc;
  }

  /**
   * Set the spine's TOC attribute
   * @param {string} toc
   */
  set spineToc(toc) {
    if (!this._content.package.spine.attr) {
      this._content.package.spine.attr = { toc: toc };
    } else {
      this._content.package.spine.attr.toc = toc;
    }
  }

  /**
   * Try to find the href of the nav file.
   * Looks for nav attribute and matches that to item id in the manifest.
   * Order of search is: OPF Spine toc, manifest item with nav "properties", ncx path
   */
  findTocHref() {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const tocId = this.spineToc;

    if (tocId) {
      const manifestItem = this.findManifestItemWithId(tocId);
      if (manifestItem) {
        const href = manifestItem.href;
        if (!!href) {
          throw `Malformed OPF: Spine does not contain toc with id ${tocId}`;
        }
        return href;
      }
    } else {
      // the spine's toc attribute is not defined.
      // look for a manifest item with the nav property
      const item = this.findManifestItemWithProperties("nav");
      if (item) {
        if (!(item !== null && item !== void 0 && item.href)) {
          throw `Malformed OPF: Manifest contains item with property "nav" but href is empty.`;
        }
        return item.href;
      } else {var _ncxItems$;
        // no nav item found - look for an ncx file
        const ncxItems = this.findManifestItemsWithMediaType(
        "application/x-dtbncx+xml");


        if (ncxItems.length < 1) {
          throw `Ncx not found in manifest.`;
        }

        const href = (_ncxItems$ = ncxItems[0]) === null || _ncxItems$ === void 0 ? void 0 : _ncxItems$.href;

        if (!href) {
          throw `Malformed OPF: Manifest contains ncx but href is empty.`;
        }

        return ncxItems[0].href;
      }
    }

    return;
  }

  /**
   * Find the relative TOC file path.
   * @param {string} relativeTo - return path relative to this directory
   */
  findTocPath(relativeTo = "/") {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const href = this.findTocHref();
    if (href) {
      const tocPath = _path.default.resolve(_path.default.dirname(relativeTo), href);
      return tocPath;
    }
    return;
  }

  /**
   * Find the path to the ncx file, if any.
   */
  findNcxPath(relativeTo) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const ncxItems = this.findManifestItemsWithMediaType(
    "application/x-dtbncx+xml");

    if (ncxItems.length > 0) {
      const href = ncxItems[0].href;
      if (!!href) {
        throw "Ncx found in manifest, but href is empty.";
      }
      const ncxPath = _path.default.resolve(_path.default.dirname(relativeTo), href);
      return ncxPath;
    } else {
      throw "No ncx found in manifest.";
    }
  }

  /**
   * Manifest Methods
   */

  addManifestItem(href, id, mediaType) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    this._content.package.manifest[0].item.push({
      attr: {
        href: href,
        id: id,
        "media-type": mediaType } });


    this.sortManifest();
    return this._content.package.manifest;
  }

  sortManifest() {var _this$_content2, _this$_content2$packa;
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    // sort by type and then by ID.
    const sortedManifest = (_this$_content2 = this._content) === null || _this$_content2 === void 0 ? void 0 : (_this$_content2$packa = _this$_content2.package) === null || _this$_content2$packa === void 0 ? void 0 : _this$_content2$packa.manifest[0].item.sort(
    (a, b) => {
      const mediaTypeA = a.attr["media-type"].toUpperCase();
      const mediaTypeB = b.attr["media-type"].toUpperCase();
      if (mediaTypeA < mediaTypeB) {
        return -1;
      }
      if (mediaTypeA > mediaTypeB) {
        return 1;
      }

      const idA = a.attr.id.toUpperCase();
      const idB = b.attr.id.toUpperCase();

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
   */
  findManifestItemWithProperties(prop) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const item = this._content.package.manifest[0].item.find(item => {var _item$attr;
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
   */
  findManifestItemsWithMediaType(mediaType) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const items = this._content.package.manifest[0].item.
    filter(item => {
      return (item === null || item === void 0 ? void 0 : item.attr["media-type"]) === mediaType;
    }).
    map(item => {var _item$attr3;
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
   */
  findManifestItemWithId(id) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const item = this._content.package.manifest[0].item.find(item => {
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
   */
  findManifestItemIdSpinePosition(id) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const index = this._content.package.spine[0].itemref.findIndex(
    itemref => {
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
   */
  get spineItemrefs() {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    const items = this._content.package.spine[0].item.map(item => {
      return {
        idref: item.attr.idref,
        linear: item.attr.linear || true };

    });
    return items;
  }

  /**
   * Add an itemref item to the spine
   * @param {int} position
   * @param {string} idref
   * @param {bool} linear
   */
  addSpineItemrefAtPosition(position, idref, linear = true) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }

    this._content.package.spine[0].itemref.splice(position, 0, {
      attr: {
        idref: idref,
        linear: linear ? "yes" : "no" } });


    return this._content.package.spine;
  }

  addSpineItemrefAfterIdref(positionIdref, idref, linear = true) {
    if (!this._loaded) {
      console.error("Opf not loaded.");
      throw "Opf not loaded.";
    }
    const position = this.findManifestItemIdSpinePosition(positionIdref);
    if (position !== -1) {
      this.addSpineItemrefAtPosition(position, idref, linear);
    } else {
      console.error(`Id "${positionIdref}" not found in manifest.`);
      throw `Id "${positionIdref}" not found in manifest.`;
    }
  }}var _default =


OpfManager;exports.default = _default;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vcGYtbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJPcGZNYW5hZ2VyIiwiY29uc3RydWN0b3IiLCJfY29udGVudCIsInVuZGVmaW5lZCIsIl9sb2FkZWQiLCJpbml0IiwiZGF0YSIsImNvbnRlbnQiLCJkaXIiLCJwYWNrYWdlIiwiYXR0ciIsImlkIiwidW5pcXVlSWRlbnRpZmllciIsInVuaXF1ZURDSWRlbnRpZmllciIsIm1ldGFkYXRhSWQiLCJtZXRhZGF0YSIsImZpbmRNZXRhZGF0YVZhbHVlV2l0aEF0dHJpYnV0ZSIsImxlbmd0aCIsIm1ldGFLZXkiLCJPYmplY3QiLCJrZXlzIiwidWlkIiwidmFsdWUiLCJyZW1vdmVNZXRhZGF0YSIsImFkZE1ldGFkYXRhIiwibWFuaWZlc3RJdGVtcyIsIml0ZW1zIiwibWFuaWZlc3QiLCJpdGVtIiwibWFwIiwiaHJlZiIsIm1lZGlhVHlwZSIsImtleSIsImVudHJpZXMiLCJoYXNPd25Qcm9wZXJ0eSIsImZpbmRNZXRhZGF0YVZhbHVlIiwicmF3TWV0YWRhdGEiLCJhdHRyaWJ1dGVzIiwidmFsIiwicHVzaCIsImZpbmQiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwibmV3TWV0YWRhdGEiLCJpdGVtS2V5IiwiaXRlbVZhbHVlIiwiYXR0cktleSIsImF0dHJWYWx1ZSIsImZvdW5kTWV0YWRhdGEiLCJtZXRhIiwiZmluZE1ldGFkYXRhVGl0bGVzIiwidGl0bGVzIiwiZmluZE1ldGFkYXRhQ3JlYXRvcnMiLCJjcmVhdG9ycyIsInNwaW5lVG9jIiwic3BpbmUiLCJ0b2MiLCJmaW5kVG9jSHJlZiIsImNvbnNvbGUiLCJlcnJvciIsInRvY0lkIiwibWFuaWZlc3RJdGVtIiwiZmluZE1hbmlmZXN0SXRlbVdpdGhJZCIsImZpbmRNYW5pZmVzdEl0ZW1XaXRoUHJvcGVydGllcyIsIm5jeEl0ZW1zIiwiZmluZE1hbmlmZXN0SXRlbXNXaXRoTWVkaWFUeXBlIiwiZmluZFRvY1BhdGgiLCJyZWxhdGl2ZVRvIiwidG9jUGF0aCIsInBhdGgiLCJyZXNvbHZlIiwiZGlybmFtZSIsImZpbmROY3hQYXRoIiwibmN4UGF0aCIsImFkZE1hbmlmZXN0SXRlbSIsInNvcnRNYW5pZmVzdCIsInNvcnRlZE1hbmlmZXN0Iiwic29ydCIsImEiLCJiIiwibWVkaWFUeXBlQSIsInRvVXBwZXJDYXNlIiwibWVkaWFUeXBlQiIsImlkQSIsImlkQiIsInByb3AiLCJwcm9wZXJ0aWVzIiwiZmlsdGVyIiwiZmluZE1hbmlmZXN0SXRlbUlkU3BpbmVQb3NpdGlvbiIsImluZGV4IiwiaXRlbXJlZiIsImZpbmRJbmRleCIsImlkcmVmIiwic3BpbmVJdGVtcmVmcyIsImxpbmVhciIsImFkZFNwaW5lSXRlbXJlZkF0UG9zaXRpb24iLCJwb3NpdGlvbiIsInNwbGljZSIsImFkZFNwaW5lSXRlbXJlZkFmdGVySWRyZWYiLCJwb3NpdGlvbklkcmVmIl0sIm1hcHBpbmdzIjoib0dBQUEsb0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxVQUFOLENBQWlCO0FBQ2ZDLEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtDLFFBQUwsR0FBZ0JDLFNBQWhCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLEtBQWY7QUFDRDs7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNFQyxFQUFBQSxJQUFJLENBQUNDLElBQUQsRUFBTztBQUNULFNBQUtKLFFBQUwsR0FBZ0JJLElBQWhCO0FBQ0EsU0FBS0YsT0FBTCxHQUFlLElBQWY7QUFDQSxXQUFPRSxJQUFQO0FBQ0Q7O0FBRUQ7QUFDRjtBQUNBOztBQUVFO0FBQ0Y7QUFDQTtBQUNhLE1BQVBDLE9BQU8sR0FBRztBQUNaLFdBQU8sS0FBS0wsUUFBWjtBQUNEOztBQUVEO0FBQ0Y7QUFDQTs7QUFFRTtBQUNGO0FBQ0E7QUFDQTtBQUNTLE1BQUhNLEdBQUcsR0FBRztBQUNSLG9DQUFPLEtBQUtOLFFBQUwsQ0FBY08sT0FBZCxDQUFzQkMsSUFBN0IsMERBQU8sc0JBQTZCLEtBQTdCLENBQVA7QUFDRDs7QUFFRDtBQUNGO0FBQ0E7QUFD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QUErQm1DLE9BQS9CLENBQXVDTyxNQUF2QyxDQUE4Q0QsUUFBOUMsRUFBd0QsQ0FBeEQsRUFBMkQ7QUFDekR2RixNQUFBQSxJQUFJLEVBQUU7QUFDSm1GLFFBQUFBLEtBQUssRUFBRUEsS0FESDtBQUVKRSxRQUFBQSxNQUFNLEVBQUVBLE1BQU0sR0FBRyxLQUFILEdBQVcsSUFGckIsRUFEbUQsRUFBM0Q7OztBQU1BLFdBQU8sS0FBSzdGLFFBQUwsQ0FBY08sT0FBZCxDQUFzQitDLEtBQTdCO0FBQ0Q7O0FBRUQyQyxFQUFBQSx5QkFBeUIsQ0FBQ0MsYUFBRCxFQUFnQlAsS0FBaEIsRUFBdUJFLE1BQU0sR0FBRyxJQUFoQyxFQUFzQztBQUM3RCxRQUFJLENBQUMsS0FBSzNGLE9BQVYsRUFBbUI7QUFDakJ1RCxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxpQkFBZDtBQUNBLFlBQU0saUJBQU47QUFDRDtBQUNELFVBQU1xQyxRQUFRLEdBQUcsS0FBS1IsK0JBQUwsQ0FBcUNXLGFBQXJDLENBQWpCO0FBQ0EsUUFBSUgsUUFBUSxLQUFLLENBQUMsQ0FBbEIsRUFBcUI7QUFDbkIsV0FBS0QseUJBQUwsQ0FBK0JDLFFBQS9CLEVBQXlDSixLQUF6QyxFQUFnREUsTUFBaEQ7QUFDRCxLQUZELE1BRU87QUFDTHBDLE1BQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFlLE9BQU13QyxhQUFjLDBCQUFuQztBQUNBLFlBQU8sT0FBTUEsYUFBYywwQkFBM0I7QUFDRDtBQUNGLEdBdm1CYyxDOzs7QUEwbUJGcEcsVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8qKlxuICogTWFuYWdlciBmb3IgdGhlIG9wZiBmaWxlXG4gKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sXG4gKi9cbmNsYXNzIE9wZk1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIG9wZiB3aXRoIHByb3ZpZGVkIGRhdGEuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gICAqL1xuICBpbml0KGRhdGEpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gZGF0YTtcbiAgICB0aGlzLl9sb2FkZWQgPSB0cnVlO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBBUEkgR2V0dGVycyBhbmQgU2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogR2V0IHRoZSBmdWxsIG9wZiBjb250ZW50IGFzIGFuIG9iamVjdFxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIHByb3BlcnRpZXMgb2YgdGhlIHJvb3QgUGFja2FnZSBlbGVtZW50LlxuICAgKi9cblxuICAvKipcbiAgICogR2V0IHRoZSBwYWNrYWdlJ3Mgb3B0aW9uYWwgbGFuZ3VhZ2UgZGlyZWN0aW9uIGF0dHJpYnV0ZVxuICAgKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sI3NlYy1zaGFyZWQtYXR0cnNcbiAgICovXG4gIGdldCBkaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQucGFja2FnZS5hdHRyPy5bXCJkaXJcIl07XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwYWNrYWdlJ3Mgb3B0aW9uYWwgbGFuZ3VhZ2UgZGlyZWN0aW9uIGF0dHJpYnV0ZVxuICAgKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sI3NlYy1zaGFyZWQtYXR0cnNcbiAgICovXG4gIHNldCBkaXIoZGlyKSB7XG4gICAgdGhpcy5fY29udGVudC5wYWNrYWdlLmF0dHJbXCJkaXJcIl0gPSBkaXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwYWNrYWdlJ3Mgb3B0aW9uYWwgaWQgYXR0cmlidXRlXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjc2VjLXNoYXJlZC1hdHRyc1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50LnBhY2thZ2UuYXR0cj8uW1wiaWRcIl07XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwYWNrYWdlJ3Mgb3B0aW9uYWwgaWQgYXR0cmlidXRlXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjc2VjLXNoYXJlZC1hdHRyc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5hdHRyW1wiaWRcIl0gPSBpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJvb3QgUGFja2FnZSB1bmlxdWUtaWRlbnRpZmllciBhdHRyaWJ1dGUuXG4gICAqIE5vdGU6IHRoaXMgaXMgTk9UIHRoZSBVSUQsIGJ1dCB0aGUgaWQgb2YgdGhlIG1ldGFkYXRhIGRjOmlkZW50aWZpZXIgdGhhdCBob2xkcyB0aGUgdmFsdWUuXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjYXR0cmRlZi1wYWNrYWdlLXVuaXF1ZS1pZGVudGlmaWVyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdW5pcXVlSWRlbnRpZmllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudC5wYWNrYWdlLmF0dHI/LltcInVuaXF1ZS1pZGVudGlmaWVyXCJdO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcm9vdCBQYWNrYWdlIHVuaXF1ZS1pZGVudGlmaWVyIGF0dHJpYnV0ZVxuICAgKiBOb3RlOiB0aGlzIGlzIE5PVCB0aGUgVUlELCBidXQgdGhlIGlkIG9mIHRoZSBtZXRhZGF0YSBkYzppZGVudGlmaWVyIHRoYXQgaG9sZHMgdGhlIHZhbHVlLlxuICAgKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sI2F0dHJkZWYtcGFja2FnZS11bmlxdWUtaWRlbnRpZmllclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCB1bmlxdWVJZGVudGlmaWVyKGlkKSB7XG4gICAgdGhpcy5fY29udGVudC5wYWNrYWdlLmF0dHJbXCJ1bmlxdWUtaWRlbnRpZmllclwiXSA9IGlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYWN0dWFsIHVuaXF1ZSBpZGVudGlmaWVyIHZhbHVlIHVzaW5nIHRoZSBpZCBwcm92aWRlZCBieSBcInVuaXF1ZS1pZGVudGlmaWVyXCJcbiAgICogcGFja2FnZSBlbGVtZW50IGF0dHJpYnV0ZVxuICAgKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sI3NlYy1vcGYtZGNpZGVudGlmaWVyXG4gICAqL1xuICBnZXQgdW5pcXVlRENJZGVudGlmaWVyKCkge1xuICAgIGNvbnN0IG1ldGFkYXRhSWQgPSB0aGlzLl9jb250ZW50LnBhY2thZ2UuYXR0cltcInVuaXF1ZS1pZGVudGlmaWVyXCJdO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5maW5kTWV0YWRhdGFWYWx1ZVdpdGhBdHRyaWJ1dGUoXCJpZFwiLCBtZXRhZGF0YUlkKTtcbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXRhS2V5ID0gT2JqZWN0LmtleXMobWV0YWRhdGFbMF0pWzBdO1xuICAgIGNvbnN0IHVpZCA9IG1ldGFkYXRhPy5bMF0/LlttZXRhS2V5XT8udmFsdWU7XG4gICAgcmV0dXJuIHVpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHVuaXF1ZSBpZGVudGlmaWVyIHZhbHVlIHVzaW5nIHRoZSBpZCBwcm92aWRlZCBieSBcInVuaXF1ZS1pZGVudGlmaWVyXCJcbiAgICogcGFja2FnZSBlbGVtZW50IGF0dHJpYnV0ZVxuICAgKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1wYWNrYWdlcy5odG1sI3NlYy1vcGYtZGNpZGVudGlmaWVyXG4gICAqL1xuICBzZXQgdW5pcXVlRENJZGVudGlmaWVyKHVpZCkge1xuICAgIGNvbnN0IG1ldGFkYXRhSWQgPSB0aGlzLl9jb250ZW50LnBhY2thZ2UuYXR0cltcInVuaXF1ZS1pZGVudGlmaWVyXCJdO1xuXG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmZpbmRNZXRhZGF0YVZhbHVlV2l0aEF0dHJpYnV0ZShcImlkXCIsIG1ldGFkYXRhSWQpO1xuICAgIGlmIChtZXRhZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAvLyB1bmlxdWUgaWQgaXMgYWxyZWFkeSBzZXQgLSBuZWVkIHRvIHJlbW92ZSBpdFxuICAgICAgdGhpcy5yZW1vdmVNZXRhZGF0YShcImRjOmlkZW50aWZpZXJcIiwgbWV0YWRhdGFJZCk7XG4gICAgICBpZiAobWV0YWRhdGFbMF1bXCJkYzppZGVudGlmaWVyXCJdICE9PSB1aWQpIHtcbiAgICAgICAgLy8gSWYgdGhlIG9sZCB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbmV3IG9uZSwgaXQgaXMgc3RpbGwgYSB2YWxpZCBwaWVjZSBvZiBtZXRhZGF0YS5cbiAgICAgICAgLy8gQWRkIGl0IGJhY2sgd2l0aG91dCB0aGUgJ2lkJyBhdHRyIHRoYXQgbWFya3MgaXQgYXMgdGhlICd1bmlxdWUtaWRlbnRpZmllcidcbiAgICAgICAgdGhpcy5hZGRNZXRhZGF0YShcImRjOmlkZW50aWZpZXJcIiwgbWV0YWRhdGFbMF1bXCJkYzppZGVudGlmaWVyXCJdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFkZE1ldGFkYXRhKFwiZGM6aWRlbnRpZmllclwiLCB1aWQsIFt7IGlkOiBtZXRhZGF0YUlkIH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXJyYXkgb2YgbWFuaWZlc3Qgb2JqZWN0c1xuICAgKiBAcmV0dXJucyB7YXJyYXl9IC0gYW4gYXJyYXkgb2Ygb2JqZWN0cyBpbiB0aGUgc2hhcGUgb2ZcbiAgICogW3tcbiAgICogIGlkOiBzdHJpbmcsXG4gICAqICBocmVmOiBzdHJpbmcsXG4gICAqICBtZWRpYVR5cGU6IHN0cmluZ1xuICAgKiB9XVxuICAgKi9cbiAgZ2V0IG1hbmlmZXN0SXRlbXMoKSB7XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9jb250ZW50LnBhY2thZ2UubWFuaWZlc3RbMF0uaXRlbS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBpdGVtLmF0dHIuaWQsXG4gICAgICAgIGhyZWY6IGl0ZW0uYXR0ci5ocmVmLFxuICAgICAgICBtZWRpYVR5cGU6IGl0ZW0uYXR0cltcIm1lZGlhLXR5cGVcIl0sXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRhZGF0YVxuICAgKiBodHRwOi8vaWRwZi5vcmcvZXB1Yi8yMC9zcGVjL09QRl8yLjAuMV9kcmFmdC5odG0jU2VjdGlvbjIuMlxuICAgKi9cblxuICAvKipcbiAgICogR2V0IHRoZSBvcGYgbWV0YWRhdGEgYXMgYW4gb2JqZWN0IHdpdGgga2V5cyBmb3IgZWFjaCBlbnRyeS5cbiAgICogVGhlIG1ldGFkYXRhIHRhZ3MgYXR0cmlidXRlcyBhcmUgYWRkZWQgdG8gdGhlIGtleSAnYXR0cmlidXRlcydcbiAgICogQHJldHVybnMge29iamVjdH0gLSBhbiBvYmplY3Qgb2Yga2V5ZWQgbWV0YWRhdGFcbiAgICovXG4gIGdldCBtZXRhZGF0YSgpIHtcbiAgICAvL2NvbnN0IG1ldGFkYXRhID0gdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdLjtcbiAgICBsZXQgbWV0YWRhdGEgPSB7fTtcblxuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhcbiAgICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVxuICAgICkpIHtcbiAgICAgIGlmIChrZXkgPT09IFwiYXR0clwiKSB7XG4gICAgICAgIG1ldGFkYXRhW1wiYXR0cmlidXRlc1wiXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9jb250ZW50LnBhY2thZ2UubWV0YWRhdGFbMF0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBtZXRhZGF0YVtrZXldID0gdGhpcy5maW5kTWV0YWRhdGFWYWx1ZShrZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfVxuXG4gIGdldCByYXdNZXRhZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBrZXkgb2YgdGhlIG1ldGFkYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHRoZSB2YWx1ZSBvZiB0aGUgbWV0YWRhdGFcbiAgICogQHBhcmFtIHthcnJheX0gYXR0cmlidXRlcyAtIGxpc3Qgb2YgYXR0cmlidXRlIG9iamVjdHM6IFt7a2V5OiB2YWx1ZX1dXG4gICAqL1xuICBhZGRNZXRhZGF0YShrZXksIHZhbHVlLCBhdHRyaWJ1dGVzID0gW10pIHtcbiAgICBpZiAoIXRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldKSB7XG4gICAgICB0aGlzLl9jb250ZW50LnBhY2thZ2UubWV0YWRhdGFbMF1ba2V5XSA9IFtdO1xuICAgIH1cbiAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBpdGVtID0ge1xuICAgICAgICB2YWw6IHZhbHVlLFxuICAgICAgICBhdHRyOiBhdHRyaWJ1dGVzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldLnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZU1ldGFkYXRhKGtleSwgaWQgPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5fY29udGVudC5wYWNrYWdlLm1ldGFkYXRhWzBdPy5ba2V5XSkge1xuICAgICAgaWYgKFxuICAgICAgICBpZCAmJlxuICAgICAgICB0aGlzLl9jb250ZW50LnBhY2thZ2UubWV0YWRhdGFbMF1ba2V5XS5hdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+IHtcbiAgICAgICAgICByZXR1cm4gYXR0cj8uaWQgPT09IGlkO1xuICAgICAgICB9KVxuICAgICAgKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250ZW50LnBhY2thZ2UubWV0YWRhdGFbMF1ba2V5XTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGEgbWV0YWRhdGEgZW50cnkgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSB0aGUgbWV0YWRhdGEga2V5IHRvIHJldHJpZXZlXG4gICAqIEByZXR1cm5zIHthcnJheX0gYW4gYXJyYXkgb2Ygb2JqZWN0cyBpbiB0aGUgc2hhcGUgb2Y6XG4gICAqICAgW3tcbiAgICogICAgYXR0cmlidXRlczoge2FycmF5fSxcbiAgICogICAgdmFsdWU6IHN0cmluZ1xuICAgKiAgICB9LFxuICAgKiAgICAuLi5cbiAgICogICBdXG4gICAqL1xuICBmaW5kTWV0YWRhdGFWYWx1ZShrZXkpIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9IFtdO1xuXG4gICAgaWYgKHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2NvbnRlbnQucGFja2FnZS5tZXRhZGF0YVswXVtrZXldO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIgJiYgaXRlbSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbmV3TWV0YWRhdGEgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IFtpdGVtS2V5LCBpdGVtVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGl0ZW0pKSB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLmhhc093blByb3BlcnR5KGl0ZW1LZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1LZXkgPT09IFwidmFsXCIpIHtcbiAgICAgICAgICAgICAgICAgIG5ld01ldGFkYXRhW1widmFsdWVcIl0gPSBpdGVtVmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtS2V5ID09PSBcImF0dHJcIikge1xuICAgICAgICAgICAgICAgICAgbmV3TWV0YWRhdGFbXCJhdHRyaWJ1dGVzXCJdID0gaXRlbVZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW5ld01ldGFkYXRhW1widmFsdWVcIl0pIHtcbiAgICAgICAgICAgICAgICAgIG5ld01ldGFkYXRhW1widmFsdWVcIl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbmV3TWV0YWRhdGFbXCJhdHRyaWJ1dGVzXCJdKSB7XG4gICAgICAgICAgICAgICAgICBuZXdNZXRhZGF0YVtcImF0dHJpYnV0ZXNcIl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXRhZGF0YS5wdXNoKG5ld01ldGFkYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWV0YWRhdGEucHVzaCh7IHZhbHVlOiBpdGVtLCBhdHRyaWJ1dGVzOiB1bmRlZmluZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9XG5cbiAgZmluZE1ldGFkYXRhVmFsdWVXaXRoQXR0cmlidXRlKGF0dHJLZXksIGF0dHJWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIGxldCBmb3VuZE1ldGFkYXRhID0gW107XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5tZXRhZGF0YSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgICAgIGlmIChtZXRhPy5hdHRyaWJ1dGVzPy5bYXR0cktleV0pIHtcbiAgICAgICAgICAgIGlmIChhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKG1ldGE/LmF0dHJpYnV0ZXM/LlthdHRyS2V5XSA9PT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZm91bmRNZXRhZGF0YS5wdXNoKHsgW2tleV06IG1ldGEgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZvdW5kTWV0YWRhdGEucHVzaCh7IFtrZXldOiBtZXRhIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kTWV0YWRhdGE7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgdGl0bGUgbWV0YWRhdGUgZW50cmllcywgaWYgYW55XG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIGZpbmRNZXRhZGF0YVRpdGxlcygpIHtcbiAgICBjb25zdCB0aXRsZXMgPSB0aGlzLmZpbmRNZXRhZGF0YVZhbHVlW1wiZGM6dGl0bGVcIl07XG4gICAgaWYgKHRpdGxlcykge1xuICAgICAgcmV0dXJuIHRpdGxlcztcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZmluZE1ldGFkYXRhQ3JlYXRvcnMoKSB7XG4gICAgY29uc3QgY3JlYXRvcnMgPSB0aGlzLmZpbmRNZXRhZGF0YVZhbHVlW1wiZGM6Y3JlYXRvclwiXTtcbiAgICBpZiAoY3JlYXRvcnMpIHtcbiAgICAgIHJldHVybiBjcmVhdG9ycztcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCdzIHRoZSB0b2MgYXR0cmlidXRlIG9mIHRoZSBzcGluZSB0YWdcbiAgICogVGhlIHRvYyBhdHRyaWJ1dGUgdmFsdWUgaXMgdGhlIGlkIG9mIHRoZSB0b2MgaXRlbSBpbiB0aGUgbWFuaWZlc3RcbiAgICovXG4gIGdldCBzcGluZVRvYygpIHtcbiAgICByZXR1cm4gdGhpcz8uX2NvbnRlbnQ/LnBhY2thZ2U/LnNwaW5lPy5hdHRyPy50b2M7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBzcGluZSdzIFRPQyBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvY1xuICAgKi9cbiAgc2V0IHNwaW5lVG9jKHRvYykge1xuICAgIGlmICghdGhpcy5fY29udGVudC5wYWNrYWdlLnNwaW5lLmF0dHIpIHtcbiAgICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5zcGluZS5hdHRyID0geyB0b2M6IHRvYyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb250ZW50LnBhY2thZ2Uuc3BpbmUuYXR0ci50b2MgPSB0b2M7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyeSB0byBmaW5kIHRoZSBocmVmIG9mIHRoZSBuYXYgZmlsZS5cbiAgICogTG9va3MgZm9yIG5hdiBhdHRyaWJ1dGUgYW5kIG1hdGNoZXMgdGhhdCB0byBpdGVtIGlkIGluIHRoZSBtYW5pZmVzdC5cbiAgICogT3JkZXIgb2Ygc2VhcmNoIGlzOiBPUEYgU3BpbmUgdG9jLCBtYW5pZmVzdCBpdGVtIHdpdGggbmF2IFwicHJvcGVydGllc1wiLCBuY3ggcGF0aFxuICAgKi9cbiAgZmluZFRvY0hyZWYoKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cblxuICAgIGNvbnN0IHRvY0lkID0gdGhpcy5zcGluZVRvYztcblxuICAgIGlmICh0b2NJZCkge1xuICAgICAgY29uc3QgbWFuaWZlc3RJdGVtID0gdGhpcy5maW5kTWFuaWZlc3RJdGVtV2l0aElkKHRvY0lkKTtcbiAgICAgIGlmIChtYW5pZmVzdEl0ZW0pIHtcbiAgICAgICAgY29uc3QgaHJlZiA9IG1hbmlmZXN0SXRlbS5ocmVmO1xuICAgICAgICBpZiAoISFocmVmKSB7XG4gICAgICAgICAgdGhyb3cgYE1hbGZvcm1lZCBPUEY6IFNwaW5lIGRvZXMgbm90IGNvbnRhaW4gdG9jIHdpdGggaWQgJHt0b2NJZH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBocmVmO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGUgc3BpbmUncyB0b2MgYXR0cmlidXRlIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgLy8gbG9vayBmb3IgYSBtYW5pZmVzdCBpdGVtIHdpdGggdGhlIG5hdiBwcm9wZXJ0eVxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZmluZE1hbmlmZXN0SXRlbVdpdGhQcm9wZXJ0aWVzKFwibmF2XCIpO1xuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaWYgKCFpdGVtPy5ocmVmKSB7XG4gICAgICAgICAgdGhyb3cgYE1hbGZvcm1lZCBPUEY6IE1hbmlmZXN0IGNvbnRhaW5zIGl0ZW0gd2l0aCBwcm9wZXJ0eSBcIm5hdlwiIGJ1dCBocmVmIGlzIGVtcHR5LmA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW0uaHJlZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5vIG5hdiBpdGVtIGZvdW5kIC0gbG9vayBmb3IgYW4gbmN4IGZpbGVcbiAgICAgICAgY29uc3QgbmN4SXRlbXMgPSB0aGlzLmZpbmRNYW5pZmVzdEl0ZW1zV2l0aE1lZGlhVHlwZShcbiAgICAgICAgICBcImFwcGxpY2F0aW9uL3gtZHRibmN4K3htbFwiXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKG5jeEl0ZW1zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICB0aHJvdyBgTmN4IG5vdCBmb3VuZCBpbiBtYW5pZmVzdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaHJlZiA9IG5jeEl0ZW1zWzBdPy5ocmVmO1xuXG4gICAgICAgIGlmICghaHJlZikge1xuICAgICAgICAgIHRocm93IGBNYWxmb3JtZWQgT1BGOiBNYW5pZmVzdCBjb250YWlucyBuY3ggYnV0IGhyZWYgaXMgZW1wdHkuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuY3hJdGVtc1swXS5ocmVmO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSByZWxhdGl2ZSBUT0MgZmlsZSBwYXRoLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVUbyAtIHJldHVybiBwYXRoIHJlbGF0aXZlIHRvIHRoaXMgZGlyZWN0b3J5XG4gICAqL1xuICBmaW5kVG9jUGF0aChyZWxhdGl2ZVRvID0gXCIvXCIpIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuICAgIGNvbnN0IGhyZWYgPSB0aGlzLmZpbmRUb2NIcmVmKCk7XG4gICAgaWYgKGhyZWYpIHtcbiAgICAgIGNvbnN0IHRvY1BhdGggPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHJlbGF0aXZlVG8pLCBocmVmKTtcbiAgICAgIHJldHVybiB0b2NQYXRoO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgcGF0aCB0byB0aGUgbmN4IGZpbGUsIGlmIGFueS5cbiAgICovXG4gIGZpbmROY3hQYXRoKHJlbGF0aXZlVG8pIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuXG4gICAgY29uc3QgbmN4SXRlbXMgPSB0aGlzLmZpbmRNYW5pZmVzdEl0ZW1zV2l0aE1lZGlhVHlwZShcbiAgICAgIFwiYXBwbGljYXRpb24veC1kdGJuY3greG1sXCJcbiAgICApO1xuICAgIGlmIChuY3hJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBocmVmID0gbmN4SXRlbXNbMF0uaHJlZjtcbiAgICAgIGlmICghIWhyZWYpIHtcbiAgICAgICAgdGhyb3cgXCJOY3ggZm91bmQgaW4gbWFuaWZlc3QsIGJ1dCBocmVmIGlzIGVtcHR5LlwiO1xuICAgICAgfVxuICAgICAgY29uc3QgbmN4UGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUocmVsYXRpdmVUbyksIGhyZWYpO1xuICAgICAgcmV0dXJuIG5jeFBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IFwiTm8gbmN4IGZvdW5kIGluIG1hbmlmZXN0LlwiO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYW5pZmVzdCBNZXRob2RzXG4gICAqL1xuXG4gIGFkZE1hbmlmZXN0SXRlbShocmVmLCBpZCwgbWVkaWFUeXBlKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tYW5pZmVzdFswXS5pdGVtLnB1c2goe1xuICAgICAgYXR0cjoge1xuICAgICAgICBocmVmOiBocmVmLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIFwibWVkaWEtdHlwZVwiOiBtZWRpYVR5cGUsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuc29ydE1hbmlmZXN0KCk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQucGFja2FnZS5tYW5pZmVzdDtcbiAgfVxuXG4gIHNvcnRNYW5pZmVzdCgpIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuICAgIC8vIHNvcnQgYnkgdHlwZSBhbmQgdGhlbiBieSBJRC5cbiAgICBjb25zdCBzb3J0ZWRNYW5pZmVzdCA9IHRoaXMuX2NvbnRlbnQ/LnBhY2thZ2U/Lm1hbmlmZXN0WzBdLml0ZW0uc29ydChcbiAgICAgIChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IG1lZGlhVHlwZUEgPSBhLmF0dHJbXCJtZWRpYS10eXBlXCJdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG1lZGlhVHlwZUIgPSBiLmF0dHJbXCJtZWRpYS10eXBlXCJdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGlmIChtZWRpYVR5cGVBIDwgbWVkaWFUeXBlQikge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVkaWFUeXBlQSA+IG1lZGlhVHlwZUIpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlkQSA9IGEuYXR0ci5pZC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBjb25zdCBpZEIgPSBiLmF0dHIuaWQudG9VcHBlckNhc2UoKTtcblxuICAgICAgICBpZiAoaWRBIDwgaWRCKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpZEEgPiBpZEIpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHNvcnRlZE1hbmlmZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIGZpcnN0IG1hbmlmZXN0IGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gXCJwcm9wZXJ0aWVzXCIgYXR0cmlidXRlIHZhbHVlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wXG4gICAqL1xuICBmaW5kTWFuaWZlc3RJdGVtV2l0aFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2NvbnRlbnQucGFja2FnZS5tYW5pZmVzdFswXS5pdGVtLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtPy5hdHRyPy5wcm9wZXJ0aWVzID09PSBwcm9wO1xuICAgIH0pO1xuXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBpdGVtLmF0dHIuaWQsXG4gICAgICAgIGhyZWY6IGl0ZW0uYXR0ci5ocmVmLFxuICAgICAgICBtZWRpYVR5cGU6IGl0ZW0uYXR0cltcIm1lZGlhLXR5cGVcIl0sXG4gICAgICAgIHByb3BlcnRpZXM6IGl0ZW0uYXR0cj8ucHJvcGVydGllcyxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG1hbmlmZXN0IGl0ZW1zIHdpdGggdGhlIGdpdmVuIG1lZGlhLXR5cGUgYXR0cmlidXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZWRpYVR5cGVcbiAgICovXG4gIGZpbmRNYW5pZmVzdEl0ZW1zV2l0aE1lZGlhVHlwZShtZWRpYVR5cGUpIHtcbiAgICBpZiAoIXRoaXMuX2xvYWRlZCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk9wZiBub3QgbG9hZGVkLlwiKTtcbiAgICAgIHRocm93IFwiT3BmIG5vdCBsb2FkZWQuXCI7XG4gICAgfVxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fY29udGVudC5wYWNrYWdlLm1hbmlmZXN0WzBdLml0ZW1cbiAgICAgIC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0/LmF0dHJbXCJtZWRpYS10eXBlXCJdID09PSBtZWRpYVR5cGU7XG4gICAgICB9KVxuICAgICAgLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpdGVtLmF0dHIuaWQsXG4gICAgICAgICAgaHJlZjogaXRlbS5hdHRyLmhyZWYsXG4gICAgICAgICAgbWVkaWFUeXBlOiBpdGVtLmF0dHJbXCJtZWRpYS10eXBlXCJdLFxuICAgICAgICAgIHByb3BlcnRpZXM6IGl0ZW0uYXR0cj8ucHJvcGVydGllcyxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgYSBtYW5pZmVzdCBpdGVtIHdpdGggdGhlIGdpdmVuIGlkIHZhbHVlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgZmluZE1hbmlmZXN0SXRlbVdpdGhJZChpZCkge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2NvbnRlbnQucGFja2FnZS5tYW5pZmVzdFswXS5pdGVtLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmF0dHIuaWQgPT09IGlkO1xuICAgIH0pO1xuXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBpdGVtLmF0dHIuaWQsXG4gICAgICAgIGhyZWY6IGl0ZW0uYXR0ci5ocmVmLFxuICAgICAgICBtZWRpYVR5cGU6IGl0ZW0uYXR0cltcIm1lZGlhLXR5cGVcIl0sXG4gICAgICAgIHByb3BlcnRpZXM6IGl0ZW0uYXR0cj8ucHJvcGVydGllcyxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcG9zaXRpb24gb2YgYSBtYW5pZmVzdCBpdGVtIHdpdGggaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBmaW5kTWFuaWZlc3RJdGVtSWRTcGluZVBvc2l0aW9uKGlkKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY29udGVudC5wYWNrYWdlLnNwaW5lWzBdLml0ZW1yZWYuZmluZEluZGV4KFxuICAgICAgKGl0ZW1yZWYpID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW1yZWYuYXR0ci5pZHJlZiA9PT0gaWQ7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGluZSBNZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHNwaW5lJ3MgYXJyYXkgb2YgaXRlbXJlZiBlbGVtZW50cy4gRWFjaCBpdGVtcmVmIGhhcyBhbiBpZHJlZiBhdHRyaWJ1dGUuXG4gICAqIFRoZSBpZHJlZiByZWZlcmVuY2VzIGEgbWFuaWZlc3QgaXRlbSBpZC5cbiAgICogVGhlIG9yZGVyIG9mIHRoaXMgYXJyYXkgZGV0ZXJtaW5lcyB0aGUgb3JkZXIgb2YgcmVwZXNlbnRhdGlvbiBvZiB0aGUgbWFuaWZlc3QgaXRlbXMuXG4gICAqIHRoZSBsaW5lYXIgYXR0cmlidXRlIGluZGljYXRlcyBpZiB0aGUgaXRlbXJlZiBpcyBpbiBsaW5lYXIgcmVwcmVzZW50YXRpb24gb3JkZXJcbiAgICogb3IgaXMgYXV4aWxpYXJ5IGNvbnRlbnQuXG4gICAqIHNlZTogaHR0cDovL2lkcGYub3JnL2VwdWIvMjAvc3BlYy9PUEZfMi4wLjFfZHJhZnQuaHRtI1NlY3Rpb24yLjRcbiAgICovXG4gIGdldCBzcGluZUl0ZW1yZWZzKCkge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2NvbnRlbnQucGFja2FnZS5zcGluZVswXS5pdGVtLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWRyZWY6IGl0ZW0uYXR0ci5pZHJlZixcbiAgICAgICAgbGluZWFyOiBpdGVtLmF0dHIubGluZWFyIHx8IHRydWUsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gaXRlbXJlZiBpdGVtIHRvIHRoZSBzcGluZVxuICAgKiBAcGFyYW0ge2ludH0gcG9zaXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkcmVmXG4gICAqIEBwYXJhbSB7Ym9vbH0gbGluZWFyXG4gICAqL1xuICBhZGRTcGluZUl0ZW1yZWZBdFBvc2l0aW9uKHBvc2l0aW9uLCBpZHJlZiwgbGluZWFyID0gdHJ1ZSkge1xuICAgIGlmICghdGhpcy5fbG9hZGVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT3BmIG5vdCBsb2FkZWQuXCIpO1xuICAgICAgdGhyb3cgXCJPcGYgbm90IGxvYWRlZC5cIjtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZW50LnBhY2thZ2Uuc3BpbmVbMF0uaXRlbXJlZi5zcGxpY2UocG9zaXRpb24sIDAsIHtcbiAgICAgIGF0dHI6IHtcbiAgICAgICAgaWRyZWY6IGlkcmVmLFxuICAgICAgICBsaW5lYXI6IGxpbmVhciA/IFwieWVzXCIgOiBcIm5vXCIsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50LnBhY2thZ2Uuc3BpbmU7XG4gIH1cblxuICBhZGRTcGluZUl0ZW1yZWZBZnRlcklkcmVmKHBvc2l0aW9uSWRyZWYsIGlkcmVmLCBsaW5lYXIgPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLl9sb2FkZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGYgbm90IGxvYWRlZC5cIik7XG4gICAgICB0aHJvdyBcIk9wZiBub3QgbG9hZGVkLlwiO1xuICAgIH1cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuZmluZE1hbmlmZXN0SXRlbUlkU3BpbmVQb3NpdGlvbihwb3NpdGlvbklkcmVmKTtcbiAgICBpZiAocG9zaXRpb24gIT09IC0xKSB7XG4gICAgICB0aGlzLmFkZFNwaW5lSXRlbXJlZkF0UG9zaXRpb24ocG9zaXRpb24sIGlkcmVmLCBsaW5lYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBJZCBcIiR7cG9zaXRpb25JZHJlZn1cIiBub3QgZm91bmQgaW4gbWFuaWZlc3QuYCk7XG4gICAgICB0aHJvdyBgSWQgXCIke3Bvc2l0aW9uSWRyZWZ9XCIgbm90IGZvdW5kIGluIG1hbmlmZXN0LmA7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9wZk1hbmFnZXI7XG4iXX0=
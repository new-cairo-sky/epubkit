"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _dataElement = _interopRequireDefault(require("./data-element"));
var _signatureReference = _interopRequireDefault(require("./signature-reference"));
var _xml = require("./utils/xml");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class SignatureManifest extends _dataElement.default {
  constructor(id = "manifest") {
    super("Manifest", undefined, {
      id: id });

    this.references = [];
  }

  // async getXml() {
  //   const xml = await generateXml(this.getXml2JsObject(), true);
  //   return xml;
  // }

  // getXml2JsObjectOld() {
  //   let refData = this.references.map((ref) => {
  //     const transforms = {};
  //     const transformList = ref.transforms.map((transform) => {
  //       return prepareItemForXml(transform);
  //     });
  //     transforms.transform = transformList;
  //     const digestMethod = prepareItemForXml(ref.digestMethod);
  //     const digestValue = prepareItemForXml(ref.digestValue);
  //     const reference = prepareItemForXml(ref);
  //     reference.transforms = transforms;
  //     reference.digestMethod = digestMethod;
  //     reference.digestValue = digestValue;
  //     return reference;
  //   });
  //   return refData;
  // }

  // getXml2JsObject() {
  //   const xmlObj = prepareItemForXml(this);
  //   const xmlSelf = { manifest: xmlObj };
  //   return xmlSelf;

  //   let refData = this.references.map((ref) => {
  //     return prepareItemForXml(ref);
  //   });

  //   return {
  //     manifest: {
  //       reference: refData,
  //     },
  //   };
  // }
  addReference(
  uri,
  transforms,
  digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
  digestValue)
  {
    if (this.getReference(uri)) {
      // reference already exists
      throw `Reference with uri "${uri}" already exists.`;
    }
    this.references.push(
    new _signatureReference.default(uri, transforms, digestMethod, digestValue));

  }

  getReference(uri) {
    const found = this.references.find(ref => ref.uri === uri);
    return found;
  }

  /**
   * Remove a reference from the signature manifest
   * @param {string} uri - the URI of the reference
   */
  removeReference(uri) {
    const index = this.references.findIndex(ref => ref.uri === uri);
    if (index !== -1) {
      this.references.splice(index, 1);
    }
  }}exports.default = SignatureManifest;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUtbWFuaWZlc3QuanMiXSwibmFtZXMiOlsiU2lnbmF0dXJlTWFuaWZlc3QiLCJEYXRhRWxlbWVudCIsImNvbnN0cnVjdG9yIiwiaWQiLCJ1bmRlZmluZWQiLCJyZWZlcmVuY2VzIiwiYWRkUmVmZXJlbmNlIiwidXJpIiwidHJhbnNmb3JtcyIsImRpZ2VzdE1ldGhvZCIsImRpZ2VzdFZhbHVlIiwiZ2V0UmVmZXJlbmNlIiwicHVzaCIsIlNpZ25hdHVyZVJlZmVyZW5jZSIsImZvdW5kIiwiZmluZCIsInJlZiIsInJlbW92ZVJlZmVyZW5jZSIsImluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIl0sIm1hcHBpbmdzIjoib0dBQUE7QUFDQTtBQUNBLGtDOztBQUVlLE1BQU1BLGlCQUFOLFNBQWdDQyxvQkFBaEMsQ0FBNEM7QUFDekRDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBRSxHQUFHLFVBQU4sRUFBa0I7QUFDM0IsVUFBTSxVQUFOLEVBQWtCQyxTQUFsQixFQUE2QjtBQUMzQkQsTUFBQUEsRUFBRSxFQUFFQSxFQUR1QixFQUE3Qjs7QUFHQSxTQUFLRSxVQUFMLEdBQWtCLEVBQWxCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLEVBQUFBLFlBQVk7QUFDVkMsRUFBQUEsR0FEVTtBQUVWQyxFQUFBQSxVQUZVO0FBR1ZDLEVBQUFBLFlBQVksR0FBRyx5Q0FITDtBQUlWQyxFQUFBQSxXQUpVO0FBS1Y7QUFDQSxRQUFJLEtBQUtDLFlBQUwsQ0FBa0JKLEdBQWxCLENBQUosRUFBNEI7QUFDMUI7QUFDQSxZQUFPLHVCQUFzQkEsR0FBSSxtQkFBakM7QUFDRDtBQUNELFNBQUtGLFVBQUwsQ0FBZ0JPLElBQWhCO0FBQ0UsUUFBSUMsMkJBQUosQ0FBdUJOLEdBQXZCLEVBQTRCQyxVQUE1QixFQUF3Q0MsWUFBeEMsRUFBc0RDLFdBQXRELENBREY7O0FBR0Q7O0FBRURDLEVBQUFBLFlBQVksQ0FBQ0osR0FBRCxFQUFNO0FBQ2hCLFVBQU1PLEtBQUssR0FBRyxLQUFLVCxVQUFMLENBQWdCVSxJQUFoQixDQUFzQkMsR0FBRCxJQUFTQSxHQUFHLENBQUNULEdBQUosS0FBWUEsR0FBMUMsQ0FBZDtBQUNBLFdBQU9PLEtBQVA7QUFDRDs7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNFRyxFQUFBQSxlQUFlLENBQUNWLEdBQUQsRUFBTTtBQUNuQixVQUFNVyxLQUFLLEdBQUcsS0FBS2IsVUFBTCxDQUFnQmMsU0FBaEIsQ0FBMkJILEdBQUQsSUFBU0EsR0FBRyxDQUFDVCxHQUFKLEtBQVlBLEdBQS9DLENBQWQ7QUFDQSxRQUFJVyxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCLFdBQUtiLFVBQUwsQ0FBZ0JlLE1BQWhCLENBQXVCRixLQUF2QixFQUE4QixDQUE5QjtBQUNEO0FBQ0YsR0EzRXdELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUVsZW1lbnQgZnJvbSBcIi4vZGF0YS1lbGVtZW50XCI7XG5pbXBvcnQgU2lnbmF0dXJlUmVmZXJlbmNlIGZyb20gXCIuL3NpZ25hdHVyZS1yZWZlcmVuY2VcIjtcbmltcG9ydCB7IGdlbmVyYXRlWG1sLCBwcmVwYXJlSXRlbUZvclhtbCB9IGZyb20gXCIuL3V0aWxzL3htbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYXR1cmVNYW5pZmVzdCBleHRlbmRzIERhdGFFbGVtZW50IHtcbiAgY29uc3RydWN0b3IoaWQgPSBcIm1hbmlmZXN0XCIpIHtcbiAgICBzdXBlcihcIk1hbmlmZXN0XCIsIHVuZGVmaW5lZCwge1xuICAgICAgaWQ6IGlkLFxuICAgIH0pO1xuICAgIHRoaXMucmVmZXJlbmNlcyA9IFtdO1xuICB9XG5cbiAgLy8gYXN5bmMgZ2V0WG1sKCkge1xuICAvLyAgIGNvbnN0IHhtbCA9IGF3YWl0IGdlbmVyYXRlWG1sKHRoaXMuZ2V0WG1sMkpzT2JqZWN0KCksIHRydWUpO1xuICAvLyAgIHJldHVybiB4bWw7XG4gIC8vIH1cblxuICAvLyBnZXRYbWwySnNPYmplY3RPbGQoKSB7XG4gIC8vICAgbGV0IHJlZkRhdGEgPSB0aGlzLnJlZmVyZW5jZXMubWFwKChyZWYpID0+IHtcbiAgLy8gICAgIGNvbnN0IHRyYW5zZm9ybXMgPSB7fTtcbiAgLy8gICAgIGNvbnN0IHRyYW5zZm9ybUxpc3QgPSByZWYudHJhbnNmb3Jtcy5tYXAoKHRyYW5zZm9ybSkgPT4ge1xuICAvLyAgICAgICByZXR1cm4gcHJlcGFyZUl0ZW1Gb3JYbWwodHJhbnNmb3JtKTtcbiAgLy8gICAgIH0pO1xuICAvLyAgICAgdHJhbnNmb3Jtcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1MaXN0O1xuICAvLyAgICAgY29uc3QgZGlnZXN0TWV0aG9kID0gcHJlcGFyZUl0ZW1Gb3JYbWwocmVmLmRpZ2VzdE1ldGhvZCk7XG4gIC8vICAgICBjb25zdCBkaWdlc3RWYWx1ZSA9IHByZXBhcmVJdGVtRm9yWG1sKHJlZi5kaWdlc3RWYWx1ZSk7XG4gIC8vICAgICBjb25zdCByZWZlcmVuY2UgPSBwcmVwYXJlSXRlbUZvclhtbChyZWYpO1xuICAvLyAgICAgcmVmZXJlbmNlLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1zO1xuICAvLyAgICAgcmVmZXJlbmNlLmRpZ2VzdE1ldGhvZCA9IGRpZ2VzdE1ldGhvZDtcbiAgLy8gICAgIHJlZmVyZW5jZS5kaWdlc3RWYWx1ZSA9IGRpZ2VzdFZhbHVlO1xuICAvLyAgICAgcmV0dXJuIHJlZmVyZW5jZTtcbiAgLy8gICB9KTtcbiAgLy8gICByZXR1cm4gcmVmRGF0YTtcbiAgLy8gfVxuXG4gIC8vIGdldFhtbDJKc09iamVjdCgpIHtcbiAgLy8gICBjb25zdCB4bWxPYmogPSBwcmVwYXJlSXRlbUZvclhtbCh0aGlzKTtcbiAgLy8gICBjb25zdCB4bWxTZWxmID0geyBtYW5pZmVzdDogeG1sT2JqIH07XG4gIC8vICAgcmV0dXJuIHhtbFNlbGY7XG5cbiAgLy8gICBsZXQgcmVmRGF0YSA9IHRoaXMucmVmZXJlbmNlcy5tYXAoKHJlZikgPT4ge1xuICAvLyAgICAgcmV0dXJuIHByZXBhcmVJdGVtRm9yWG1sKHJlZik7XG4gIC8vICAgfSk7XG5cbiAgLy8gICByZXR1cm4ge1xuICAvLyAgICAgbWFuaWZlc3Q6IHtcbiAgLy8gICAgICAgcmVmZXJlbmNlOiByZWZEYXRhLFxuICAvLyAgICAgfSxcbiAgLy8gICB9O1xuICAvLyB9XG4gIGFkZFJlZmVyZW5jZShcbiAgICB1cmksXG4gICAgdHJhbnNmb3JtcyxcbiAgICBkaWdlc3RNZXRob2QgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NlwiLFxuICAgIGRpZ2VzdFZhbHVlXG4gICkge1xuICAgIGlmICh0aGlzLmdldFJlZmVyZW5jZSh1cmkpKSB7XG4gICAgICAvLyByZWZlcmVuY2UgYWxyZWFkeSBleGlzdHNcbiAgICAgIHRocm93IGBSZWZlcmVuY2Ugd2l0aCB1cmkgXCIke3VyaX1cIiBhbHJlYWR5IGV4aXN0cy5gO1xuICAgIH1cbiAgICB0aGlzLnJlZmVyZW5jZXMucHVzaChcbiAgICAgIG5ldyBTaWduYXR1cmVSZWZlcmVuY2UodXJpLCB0cmFuc2Zvcm1zLCBkaWdlc3RNZXRob2QsIGRpZ2VzdFZhbHVlKVxuICAgICk7XG4gIH1cblxuICBnZXRSZWZlcmVuY2UodXJpKSB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLnJlZmVyZW5jZXMuZmluZCgocmVmKSA9PiByZWYudXJpID09PSB1cmkpO1xuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZWZlcmVuY2UgZnJvbSB0aGUgc2lnbmF0dXJlIG1hbmlmZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmkgLSB0aGUgVVJJIG9mIHRoZSByZWZlcmVuY2VcbiAgICovXG4gIHJlbW92ZVJlZmVyZW5jZSh1cmkpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucmVmZXJlbmNlcy5maW5kSW5kZXgoKHJlZikgPT4gcmVmLnVyaSA9PT0gdXJpKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnJlZmVyZW5jZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
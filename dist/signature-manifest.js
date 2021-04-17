"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _dataElement = _interopRequireDefault(require("./data-element"));
var _signatureReference = _interopRequireDefault(require("./signature-reference"));
var _xml = require("./utils/xml");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}var

SignatureManifest = /*#__PURE__*/function (_DataElement) {_inherits(SignatureManifest, _DataElement);var _super = _createSuper(SignatureManifest);
  function SignatureManifest() {var _this;var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "manifest";_classCallCheck(this, SignatureManifest);
    _this = _super.call(this, "Manifest", undefined, {
      id: id });

    _this.references = [];return _this;
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
  _createClass(SignatureManifest, [{ key: "addReference", value: function addReference(
    uri,
    transforms)


    {var digestMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "http://www.w3.org/2001/04/xmlenc#sha256";var digestValue = arguments.length > 3 ? arguments[3] : undefined;
      if (this.getReference(uri)) {
        // reference already exists
        throw "Reference with uri \"".concat(uri, "\" already exists.");
      }
      this.references.push(
      new _signatureReference["default"](uri, transforms, digestMethod, digestValue));

    } }, { key: "getReference", value: function getReference(

    uri) {
      var found = this.references.find(function (ref) {return ref.uri === uri;});
      return found;
    }

    /**
       * Remove a reference from the signature manifest
       * @param {string} uri - the URI of the reference
       */ }, { key: "removeReference", value: function removeReference(
    uri) {
      var index = this.references.findIndex(function (ref) {return ref.uri === uri;});
      if (index !== -1) {
        this.references.splice(index, 1);
      }
    } }]);return SignatureManifest;}(_dataElement["default"]);exports["default"] = SignatureManifest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUtbWFuaWZlc3QuanMiXSwibmFtZXMiOlsiU2lnbmF0dXJlTWFuaWZlc3QiLCJpZCIsInVuZGVmaW5lZCIsInJlZmVyZW5jZXMiLCJ1cmkiLCJ0cmFuc2Zvcm1zIiwiZGlnZXN0TWV0aG9kIiwiZGlnZXN0VmFsdWUiLCJnZXRSZWZlcmVuY2UiLCJwdXNoIiwiU2lnbmF0dXJlUmVmZXJlbmNlIiwiZm91bmQiLCJmaW5kIiwicmVmIiwiaW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJEYXRhRWxlbWVudCJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0E7QUFDQSxrQzs7QUFFcUJBLGlCO0FBQ25CLCtCQUE2QixlQUFqQkMsRUFBaUIsdUVBQVosVUFBWTtBQUMzQiw4QkFBTSxVQUFOLEVBQWtCQyxTQUFsQixFQUE2QjtBQUMzQkQsTUFBQUEsRUFBRSxFQUFFQSxFQUR1QixFQUE3Qjs7QUFHQSxVQUFLRSxVQUFMLEdBQWtCLEVBQWxCLENBSjJCO0FBSzVCOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFRUMsSUFBQUEsRztBQUNBQyxJQUFBQSxVOzs7QUFHQSxTQUZBQyxZQUVBLHVFQUZlLHlDQUVmLEtBREFDLFdBQ0E7QUFDQSxVQUFJLEtBQUtDLFlBQUwsQ0FBa0JKLEdBQWxCLENBQUosRUFBNEI7QUFDMUI7QUFDQSw2Q0FBNkJBLEdBQTdCO0FBQ0Q7QUFDRCxXQUFLRCxVQUFMLENBQWdCTSxJQUFoQjtBQUNFLFVBQUlDLDhCQUFKLENBQXVCTixHQUF2QixFQUE0QkMsVUFBNUIsRUFBd0NDLFlBQXhDLEVBQXNEQyxXQUF0RCxDQURGOztBQUdELEs7O0FBRVlILElBQUFBLEcsRUFBSztBQUNoQixVQUFNTyxLQUFLLEdBQUcsS0FBS1IsVUFBTCxDQUFnQlMsSUFBaEIsQ0FBcUIsVUFBQ0MsR0FBRCxVQUFTQSxHQUFHLENBQUNULEdBQUosS0FBWUEsR0FBckIsRUFBckIsQ0FBZDtBQUNBLGFBQU9PLEtBQVA7QUFDRDs7QUFFRDs7OztBQUlnQlAsSUFBQUEsRyxFQUFLO0FBQ25CLFVBQU1VLEtBQUssR0FBRyxLQUFLWCxVQUFMLENBQWdCWSxTQUFoQixDQUEwQixVQUFDRixHQUFELFVBQVNBLEdBQUcsQ0FBQ1QsR0FBSixLQUFZQSxHQUFyQixFQUExQixDQUFkO0FBQ0EsVUFBSVUsS0FBSyxLQUFLLENBQUMsQ0FBZixFQUFrQjtBQUNoQixhQUFLWCxVQUFMLENBQWdCYSxNQUFoQixDQUF1QkYsS0FBdkIsRUFBOEIsQ0FBOUI7QUFDRDtBQUNGLEssZ0NBM0U0Q0csdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUVsZW1lbnQgZnJvbSBcIi4vZGF0YS1lbGVtZW50XCI7XG5pbXBvcnQgU2lnbmF0dXJlUmVmZXJlbmNlIGZyb20gXCIuL3NpZ25hdHVyZS1yZWZlcmVuY2VcIjtcbmltcG9ydCB7IGdlbmVyYXRlWG1sLCBwcmVwYXJlSXRlbUZvclhtbCB9IGZyb20gXCIuL3V0aWxzL3htbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYXR1cmVNYW5pZmVzdCBleHRlbmRzIERhdGFFbGVtZW50IHtcbiAgY29uc3RydWN0b3IoaWQgPSBcIm1hbmlmZXN0XCIpIHtcbiAgICBzdXBlcihcIk1hbmlmZXN0XCIsIHVuZGVmaW5lZCwge1xuICAgICAgaWQ6IGlkLFxuICAgIH0pO1xuICAgIHRoaXMucmVmZXJlbmNlcyA9IFtdO1xuICB9XG5cbiAgLy8gYXN5bmMgZ2V0WG1sKCkge1xuICAvLyAgIGNvbnN0IHhtbCA9IGF3YWl0IGdlbmVyYXRlWG1sKHRoaXMuZ2V0WG1sMkpzT2JqZWN0KCksIHRydWUpO1xuICAvLyAgIHJldHVybiB4bWw7XG4gIC8vIH1cblxuICAvLyBnZXRYbWwySnNPYmplY3RPbGQoKSB7XG4gIC8vICAgbGV0IHJlZkRhdGEgPSB0aGlzLnJlZmVyZW5jZXMubWFwKChyZWYpID0+IHtcbiAgLy8gICAgIGNvbnN0IHRyYW5zZm9ybXMgPSB7fTtcbiAgLy8gICAgIGNvbnN0IHRyYW5zZm9ybUxpc3QgPSByZWYudHJhbnNmb3Jtcy5tYXAoKHRyYW5zZm9ybSkgPT4ge1xuICAvLyAgICAgICByZXR1cm4gcHJlcGFyZUl0ZW1Gb3JYbWwodHJhbnNmb3JtKTtcbiAgLy8gICAgIH0pO1xuICAvLyAgICAgdHJhbnNmb3Jtcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1MaXN0O1xuICAvLyAgICAgY29uc3QgZGlnZXN0TWV0aG9kID0gcHJlcGFyZUl0ZW1Gb3JYbWwocmVmLmRpZ2VzdE1ldGhvZCk7XG4gIC8vICAgICBjb25zdCBkaWdlc3RWYWx1ZSA9IHByZXBhcmVJdGVtRm9yWG1sKHJlZi5kaWdlc3RWYWx1ZSk7XG4gIC8vICAgICBjb25zdCByZWZlcmVuY2UgPSBwcmVwYXJlSXRlbUZvclhtbChyZWYpO1xuICAvLyAgICAgcmVmZXJlbmNlLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1zO1xuICAvLyAgICAgcmVmZXJlbmNlLmRpZ2VzdE1ldGhvZCA9IGRpZ2VzdE1ldGhvZDtcbiAgLy8gICAgIHJlZmVyZW5jZS5kaWdlc3RWYWx1ZSA9IGRpZ2VzdFZhbHVlO1xuICAvLyAgICAgcmV0dXJuIHJlZmVyZW5jZTtcbiAgLy8gICB9KTtcbiAgLy8gICByZXR1cm4gcmVmRGF0YTtcbiAgLy8gfVxuXG4gIC8vIGdldFhtbDJKc09iamVjdCgpIHtcbiAgLy8gICBjb25zdCB4bWxPYmogPSBwcmVwYXJlSXRlbUZvclhtbCh0aGlzKTtcbiAgLy8gICBjb25zdCB4bWxTZWxmID0geyBtYW5pZmVzdDogeG1sT2JqIH07XG4gIC8vICAgcmV0dXJuIHhtbFNlbGY7XG5cbiAgLy8gICBsZXQgcmVmRGF0YSA9IHRoaXMucmVmZXJlbmNlcy5tYXAoKHJlZikgPT4ge1xuICAvLyAgICAgcmV0dXJuIHByZXBhcmVJdGVtRm9yWG1sKHJlZik7XG4gIC8vICAgfSk7XG5cbiAgLy8gICByZXR1cm4ge1xuICAvLyAgICAgbWFuaWZlc3Q6IHtcbiAgLy8gICAgICAgcmVmZXJlbmNlOiByZWZEYXRhLFxuICAvLyAgICAgfSxcbiAgLy8gICB9O1xuICAvLyB9XG4gIGFkZFJlZmVyZW5jZShcbiAgICB1cmksXG4gICAgdHJhbnNmb3JtcyxcbiAgICBkaWdlc3RNZXRob2QgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NlwiLFxuICAgIGRpZ2VzdFZhbHVlXG4gICkge1xuICAgIGlmICh0aGlzLmdldFJlZmVyZW5jZSh1cmkpKSB7XG4gICAgICAvLyByZWZlcmVuY2UgYWxyZWFkeSBleGlzdHNcbiAgICAgIHRocm93IGBSZWZlcmVuY2Ugd2l0aCB1cmkgXCIke3VyaX1cIiBhbHJlYWR5IGV4aXN0cy5gO1xuICAgIH1cbiAgICB0aGlzLnJlZmVyZW5jZXMucHVzaChcbiAgICAgIG5ldyBTaWduYXR1cmVSZWZlcmVuY2UodXJpLCB0cmFuc2Zvcm1zLCBkaWdlc3RNZXRob2QsIGRpZ2VzdFZhbHVlKVxuICAgICk7XG4gIH1cblxuICBnZXRSZWZlcmVuY2UodXJpKSB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLnJlZmVyZW5jZXMuZmluZCgocmVmKSA9PiByZWYudXJpID09PSB1cmkpO1xuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZWZlcmVuY2UgZnJvbSB0aGUgc2lnbmF0dXJlIG1hbmlmZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmkgLSB0aGUgVVJJIG9mIHRoZSByZWZlcmVuY2VcbiAgICovXG4gIHJlbW92ZVJlZmVyZW5jZSh1cmkpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucmVmZXJlbmNlcy5maW5kSW5kZXgoKHJlZikgPT4gcmVmLnVyaSA9PT0gdXJpKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnJlZmVyZW5jZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _dataElement = _interopRequireDefault(require("./data-element"));
var _signatureReference = _interopRequireDefault(require("./signature-reference"));
var _signatureSignatureMethod = _interopRequireDefault(require("./signature-signature-method"));
var _signatureCanonicalizationMethod = _interopRequireDefault(require("./signature-canonicalization-method"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

// https://www.w3.org/TR/xmldsig-core1/#sec-SignedInfo
/*
<element name="SignedInfo" type="ds:SignedInfoType"/> 
<complexType name="SignedInfoType">
  <sequence> 
    <element ref="ds:CanonicalizationMethod"/>
    <element ref="ds:SignatureMethod"/> 
    <element ref="ds:Reference" maxOccurs="unbounded"/> 
  </sequence>  
  <attribute name="Id" type="ID" use="optional"/> 
</complexType>
*/var
SignatureSignedInfo = /*#__PURE__*/function (_DataElement) {_inherits(SignatureSignedInfo, _DataElement);var _super = _createSuper(SignatureSignedInfo);
  function SignatureSignedInfo(id) {var _this;_classCallCheck(this, SignatureSignedInfo);
    _this = _super.call(this, "SignedInfo", undefined, { id: id });

    _this.canonicalizationMethod = new _signatureCanonicalizationMethod["default"]();
    _this.signatureMethod = new _signatureSignatureMethod["default"]();
    _this.reference = [];return _this;
  }_createClass(SignatureSignedInfo, [{ key: "addReference", value: function addReference(

    uri, transforms, digestMethod, digestValue) {
      this.reference.push(
      new _signatureReference["default"](uri, transforms, digestMethod, digestValue));

    } }]);return SignatureSignedInfo;}(_dataElement["default"]);exports["default"] = SignatureSignedInfo;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUtc2lnbmVkLWluZm8uanMiXSwibmFtZXMiOlsiU2lnbmF0dXJlU2lnbmVkSW5mbyIsImlkIiwidW5kZWZpbmVkIiwiY2Fub25pY2FsaXphdGlvbk1ldGhvZCIsIlNpZ25hdHVyZUNhbm9uaWNhbGl6YXRpb25NZXRob2QiLCJzaWduYXR1cmVNZXRob2QiLCJTaWduYXR1cmVTaWduYXR1cmVNZXRob2QiLCJyZWZlcmVuY2UiLCJ1cmkiLCJ0cmFuc2Zvcm1zIiwiZGlnZXN0TWV0aG9kIiwiZGlnZXN0VmFsdWUiLCJwdXNoIiwiU2lnbmF0dXJlUmVmZXJlbmNlIiwiRGF0YUVsZW1lbnQiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBO0FBQ0E7QUFDQSw4Rzs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQVdxQkEsbUI7QUFDbkIsK0JBQVlDLEVBQVosRUFBZ0I7QUFDZCw4QkFBTSxZQUFOLEVBQW9CQyxTQUFwQixFQUErQixFQUFFRCxFQUFFLEVBQUVBLEVBQU4sRUFBL0I7O0FBRUEsVUFBS0Usc0JBQUwsR0FBOEIsSUFBSUMsMkNBQUosRUFBOUI7QUFDQSxVQUFLQyxlQUFMLEdBQXVCLElBQUlDLG9DQUFKLEVBQXZCO0FBQ0EsVUFBS0MsU0FBTCxHQUFpQixFQUFqQixDQUxjO0FBTWYsRzs7QUFFWUMsSUFBQUEsRyxFQUFLQyxVLEVBQVlDLFksRUFBY0MsVyxFQUFhO0FBQ3ZELFdBQUtKLFNBQUwsQ0FBZUssSUFBZjtBQUNFLFVBQUlDLDhCQUFKLENBQXVCTCxHQUF2QixFQUE0QkMsVUFBNUIsRUFBd0NDLFlBQXhDLEVBQXNEQyxXQUF0RCxDQURGOztBQUdELEssa0NBYjhDRyx1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhRWxlbWVudCBmcm9tIFwiLi9kYXRhLWVsZW1lbnRcIjtcbmltcG9ydCBTaWduYXR1cmVSZWZlcmVuY2UgZnJvbSBcIi4vc2lnbmF0dXJlLXJlZmVyZW5jZVwiO1xuaW1wb3J0IFNpZ25hdHVyZVNpZ25hdHVyZU1ldGhvZCBmcm9tIFwiLi9zaWduYXR1cmUtc2lnbmF0dXJlLW1ldGhvZFwiO1xuaW1wb3J0IFNpZ25hdHVyZUNhbm9uaWNhbGl6YXRpb25NZXRob2QgZnJvbSBcIi4vc2lnbmF0dXJlLWNhbm9uaWNhbGl6YXRpb24tbWV0aG9kXCI7XG5cbi8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi94bWxkc2lnLWNvcmUxLyNzZWMtU2lnbmVkSW5mb1xuLypcbjxlbGVtZW50IG5hbWU9XCJTaWduZWRJbmZvXCIgdHlwZT1cImRzOlNpZ25lZEluZm9UeXBlXCIvPiBcbjxjb21wbGV4VHlwZSBuYW1lPVwiU2lnbmVkSW5mb1R5cGVcIj5cbiAgPHNlcXVlbmNlPiBcbiAgICA8ZWxlbWVudCByZWY9XCJkczpDYW5vbmljYWxpemF0aW9uTWV0aG9kXCIvPlxuICAgIDxlbGVtZW50IHJlZj1cImRzOlNpZ25hdHVyZU1ldGhvZFwiLz4gXG4gICAgPGVsZW1lbnQgcmVmPVwiZHM6UmVmZXJlbmNlXCIgbWF4T2NjdXJzPVwidW5ib3VuZGVkXCIvPiBcbiAgPC9zZXF1ZW5jZT4gIFxuICA8YXR0cmlidXRlIG5hbWU9XCJJZFwiIHR5cGU9XCJJRFwiIHVzZT1cIm9wdGlvbmFsXCIvPiBcbjwvY29tcGxleFR5cGU+XG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lnbmF0dXJlU2lnbmVkSW5mbyBleHRlbmRzIERhdGFFbGVtZW50IHtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcihcIlNpZ25lZEluZm9cIiwgdW5kZWZpbmVkLCB7IGlkOiBpZCB9KTtcblxuICAgIHRoaXMuY2Fub25pY2FsaXphdGlvbk1ldGhvZCA9IG5ldyBTaWduYXR1cmVDYW5vbmljYWxpemF0aW9uTWV0aG9kKCk7XG4gICAgdGhpcy5zaWduYXR1cmVNZXRob2QgPSBuZXcgU2lnbmF0dXJlU2lnbmF0dXJlTWV0aG9kKCk7XG4gICAgdGhpcy5yZWZlcmVuY2UgPSBbXTtcbiAgfVxuXG4gIGFkZFJlZmVyZW5jZSh1cmksIHRyYW5zZm9ybXMsIGRpZ2VzdE1ldGhvZCwgZGlnZXN0VmFsdWUpIHtcbiAgICB0aGlzLnJlZmVyZW5jZS5wdXNoKFxuICAgICAgbmV3IFNpZ25hdHVyZVJlZmVyZW5jZSh1cmksIHRyYW5zZm9ybXMsIGRpZ2VzdE1ldGhvZCwgZGlnZXN0VmFsdWUpXG4gICAgKTtcbiAgfVxufVxuIl19
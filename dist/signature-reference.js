"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _dataElement = _interopRequireDefault(require("./data-element"));
var _signatureDigestMethod = _interopRequireDefault(require("./signature-digest-method"));
var _signatureDigestValue = _interopRequireDefault(require("./signature-digest-value"));
var _signatureReferenceTransform = _interopRequireDefault(require("./signature-reference-transform"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

// https://www.w3.org/TR/xmldsig-core1/#sec-Reference
var
SignatureReference = /*#__PURE__*/function (_DataElement) {_inherits(SignatureReference, _DataElement);var _super = _createSuper(SignatureReference);
  function SignatureReference(
  uri,
  transforms)


  {var _this;var digestMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "http://www.w3.org/2001/04/xmlenc#sha256";var digestValue = arguments.length > 3 ? arguments[3] : undefined;_classCallCheck(this, SignatureReference);
    _this = _super.call(this, "Reference", undefined, { uri: uri });

    Object.defineProperty(_assertThisInitialized(_this), "transforms", {
      configurable: true,
      get: function get() {
        return this._transforms;
      },
      set: function set(val) {
        if (Array.isArray(val)) {
          this._transforms = new _dataElement["default"]("Transforms");
          this._transforms.transform = val.map(function (transform) {
            return new _signatureReferenceTransform["default"](transform);
          });
        }
      } });

    // if (Array.isArray(transforms)) {
    //   this.transforms = new DataElement("transforms");
    //   this.transforms.transform = transforms.map((transform) => {
    //     return new SignatureReferenceTransform(transform);
    //   });
    // }

    _this.transforms = transforms;

    _this.digestMethod = new _signatureDigestMethod["default"](digestMethod);

    _this.digestValue = new _signatureDigestValue["default"](digestValue);return _this;
  }return SignatureReference;}(_dataElement["default"]);exports["default"] = SignatureReference;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUtcmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbIlNpZ25hdHVyZVJlZmVyZW5jZSIsInVyaSIsInRyYW5zZm9ybXMiLCJkaWdlc3RNZXRob2QiLCJkaWdlc3RWYWx1ZSIsInVuZGVmaW5lZCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiY29uZmlndXJhYmxlIiwiZ2V0IiwiX3RyYW5zZm9ybXMiLCJzZXQiLCJ2YWwiLCJBcnJheSIsImlzQXJyYXkiLCJEYXRhRWxlbWVudCIsInRyYW5zZm9ybSIsIm1hcCIsIlNpZ25hdHVyZVJlZmVyZW5jZVRyYW5zZm9ybSIsIlNpZ25hdHVyZURpZ2VzdE1ldGhvZCIsIlNpZ25hdHVyZURpZ2VzdFZhbHVlIl0sIm1hcHBpbmdzIjoidUdBQUE7QUFDQTtBQUNBO0FBQ0Esc0c7O0FBRUE7O0FBRXFCQSxrQjtBQUNuQjtBQUNFQyxFQUFBQSxHQURGO0FBRUVDLEVBQUFBLFVBRkY7OztBQUtFLGlCQUZBQyxZQUVBLHVFQUZlLHlDQUVmLEtBREFDLFdBQ0E7QUFDQSw4QkFBTSxXQUFOLEVBQW1CQyxTQUFuQixFQUE4QixFQUFFSixHQUFHLEVBQUVBLEdBQVAsRUFBOUI7O0FBRUFLLElBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxnQ0FBNEIsWUFBNUIsRUFBMEM7QUFDeENDLE1BQUFBLFlBQVksRUFBRSxJQUQwQjtBQUV4Q0MsTUFBQUEsR0FGd0MsaUJBRWxDO0FBQ0osZUFBTyxLQUFLQyxXQUFaO0FBQ0QsT0FKdUM7QUFLeENDLE1BQUFBLEdBTHdDLGVBS3BDQyxHQUxvQyxFQUsvQjtBQUNQLFlBQUlDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixHQUFkLENBQUosRUFBd0I7QUFDdEIsZUFBS0YsV0FBTCxHQUFtQixJQUFJSyx1QkFBSixDQUFnQixZQUFoQixDQUFuQjtBQUNBLGVBQUtMLFdBQUwsQ0FBaUJNLFNBQWpCLEdBQTZCSixHQUFHLENBQUNLLEdBQUosQ0FBUSxVQUFDRCxTQUFELEVBQWU7QUFDbEQsbUJBQU8sSUFBSUUsdUNBQUosQ0FBZ0NGLFNBQWhDLENBQVA7QUFDRCxXQUY0QixDQUE3QjtBQUdEO0FBQ0YsT0FadUMsRUFBMUM7O0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQUtkLFVBQUwsR0FBa0JBLFVBQWxCOztBQUVBLFVBQUtDLFlBQUwsR0FBb0IsSUFBSWdCLGlDQUFKLENBQTBCaEIsWUFBMUIsQ0FBcEI7O0FBRUEsVUFBS0MsV0FBTCxHQUFtQixJQUFJZ0IsZ0NBQUosQ0FBeUJoQixXQUF6QixDQUFuQixDQTVCQTtBQTZCRCxHLDRCQW5DNkNXLHVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFFbGVtZW50IGZyb20gXCIuL2RhdGEtZWxlbWVudFwiO1xuaW1wb3J0IFNpZ25hdHVyZURpZ2VzdE1ldGhvZCBmcm9tIFwiLi9zaWduYXR1cmUtZGlnZXN0LW1ldGhvZFwiO1xuaW1wb3J0IFNpZ25hdHVyZURpZ2VzdFZhbHVlIGZyb20gXCIuL3NpZ25hdHVyZS1kaWdlc3QtdmFsdWVcIjtcbmltcG9ydCBTaWduYXR1cmVSZWZlcmVuY2VUcmFuc2Zvcm0gZnJvbSBcIi4vc2lnbmF0dXJlLXJlZmVyZW5jZS10cmFuc2Zvcm1cIjtcblxuLy8gaHR0cHM6Ly93d3cudzMub3JnL1RSL3htbGRzaWctY29yZTEvI3NlYy1SZWZlcmVuY2VcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lnbmF0dXJlUmVmZXJlbmNlIGV4dGVuZHMgRGF0YUVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICB1cmksXG4gICAgdHJhbnNmb3JtcyxcbiAgICBkaWdlc3RNZXRob2QgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NlwiLFxuICAgIGRpZ2VzdFZhbHVlXG4gICkge1xuICAgIHN1cGVyKFwiUmVmZXJlbmNlXCIsIHVuZGVmaW5lZCwgeyB1cmk6IHVyaSB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInRyYW5zZm9ybXNcIiwge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtcztcbiAgICAgIH0sXG4gICAgICBzZXQodmFsKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1zID0gbmV3IERhdGFFbGVtZW50KFwiVHJhbnNmb3Jtc1wiKTtcbiAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1zLnRyYW5zZm9ybSA9IHZhbC5tYXAoKHRyYW5zZm9ybSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTaWduYXR1cmVSZWZlcmVuY2VUcmFuc2Zvcm0odHJhbnNmb3JtKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBpZiAoQXJyYXkuaXNBcnJheSh0cmFuc2Zvcm1zKSkge1xuICAgIC8vICAgdGhpcy50cmFuc2Zvcm1zID0gbmV3IERhdGFFbGVtZW50KFwidHJhbnNmb3Jtc1wiKTtcbiAgICAvLyAgIHRoaXMudHJhbnNmb3Jtcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1zLm1hcCgodHJhbnNmb3JtKSA9PiB7XG4gICAgLy8gICAgIHJldHVybiBuZXcgU2lnbmF0dXJlUmVmZXJlbmNlVHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1zO1xuXG4gICAgdGhpcy5kaWdlc3RNZXRob2QgPSBuZXcgU2lnbmF0dXJlRGlnZXN0TWV0aG9kKGRpZ2VzdE1ldGhvZCk7XG5cbiAgICB0aGlzLmRpZ2VzdFZhbHVlID0gbmV3IFNpZ25hdHVyZURpZ2VzdFZhbHVlKGRpZ2VzdFZhbHVlKTtcbiAgfVxufVxuIl19
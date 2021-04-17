"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _dataElement = _interopRequireDefault(require("./data-element"));
var _signatureDigestMethod = _interopRequireDefault(require("./signature-digest-method"));
var _signatureDigestValue = _interopRequireDefault(require("./signature-digest-value"));
var _signatureReferenceTransform = _interopRequireDefault(require("./signature-reference-transform"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// https://www.w3.org/TR/xmldsig-core1/#sec-Reference

class SignatureReference extends _dataElement.default {
  constructor(
  uri,
  transforms,
  digestMethod = "http://www.w3.org/2001/04/xmlenc#sha256",
  digestValue)
  {
    super("Reference", undefined, { uri: uri });

    Object.defineProperty(this, "transforms", {
      configurable: true,
      get() {
        return this._transforms;
      },
      set(val) {
        if (Array.isArray(val)) {
          this._transforms = new _dataElement.default("Transforms");
          this._transforms.transform = val.map(transform => {
            return new _signatureReferenceTransform.default(transform);
          });
        }
      } });

    // if (Array.isArray(transforms)) {
    //   this.transforms = new DataElement("transforms");
    //   this.transforms.transform = transforms.map((transform) => {
    //     return new SignatureReferenceTransform(transform);
    //   });
    // }

    this.transforms = transforms;

    this.digestMethod = new _signatureDigestMethod.default(digestMethod);

    this.digestValue = new _signatureDigestValue.default(digestValue);
  }}exports.default = SignatureReference;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUtcmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbIlNpZ25hdHVyZVJlZmVyZW5jZSIsIkRhdGFFbGVtZW50IiwiY29uc3RydWN0b3IiLCJ1cmkiLCJ0cmFuc2Zvcm1zIiwiZGlnZXN0TWV0aG9kIiwiZGlnZXN0VmFsdWUiLCJ1bmRlZmluZWQiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImdldCIsIl90cmFuc2Zvcm1zIiwic2V0IiwidmFsIiwiQXJyYXkiLCJpc0FycmF5IiwidHJhbnNmb3JtIiwibWFwIiwiU2lnbmF0dXJlUmVmZXJlbmNlVHJhbnNmb3JtIiwiU2lnbmF0dXJlRGlnZXN0TWV0aG9kIiwiU2lnbmF0dXJlRGlnZXN0VmFsdWUiXSwibWFwcGluZ3MiOiJvR0FBQTtBQUNBO0FBQ0E7QUFDQSxzRzs7QUFFQTs7QUFFZSxNQUFNQSxrQkFBTixTQUFpQ0Msb0JBQWpDLENBQTZDO0FBQzFEQyxFQUFBQSxXQUFXO0FBQ1RDLEVBQUFBLEdBRFM7QUFFVEMsRUFBQUEsVUFGUztBQUdUQyxFQUFBQSxZQUFZLEdBQUcseUNBSE47QUFJVEMsRUFBQUEsV0FKUztBQUtUO0FBQ0EsVUFBTSxXQUFOLEVBQW1CQyxTQUFuQixFQUE4QixFQUFFSixHQUFHLEVBQUVBLEdBQVAsRUFBOUI7O0FBRUFLLElBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixJQUF0QixFQUE0QixZQUE1QixFQUEwQztBQUN4Q0MsTUFBQUEsWUFBWSxFQUFFLElBRDBCO0FBRXhDQyxNQUFBQSxHQUFHLEdBQUc7QUFDSixlQUFPLEtBQUtDLFdBQVo7QUFDRCxPQUp1QztBQUt4Q0MsTUFBQUEsR0FBRyxDQUFDQyxHQUFELEVBQU07QUFDUCxZQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsR0FBZCxDQUFKLEVBQXdCO0FBQ3RCLGVBQUtGLFdBQUwsR0FBbUIsSUFBSVgsb0JBQUosQ0FBZ0IsWUFBaEIsQ0FBbkI7QUFDQSxlQUFLVyxXQUFMLENBQWlCSyxTQUFqQixHQUE2QkgsR0FBRyxDQUFDSSxHQUFKLENBQVNELFNBQUQsSUFBZTtBQUNsRCxtQkFBTyxJQUFJRSxvQ0FBSixDQUFnQ0YsU0FBaEMsQ0FBUDtBQUNELFdBRjRCLENBQTdCO0FBR0Q7QUFDRixPQVp1QyxFQUExQzs7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBS2IsVUFBTCxHQUFrQkEsVUFBbEI7O0FBRUEsU0FBS0MsWUFBTCxHQUFvQixJQUFJZSw4QkFBSixDQUEwQmYsWUFBMUIsQ0FBcEI7O0FBRUEsU0FBS0MsV0FBTCxHQUFtQixJQUFJZSw2QkFBSixDQUF5QmYsV0FBekIsQ0FBbkI7QUFDRCxHQW5DeUQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhRWxlbWVudCBmcm9tIFwiLi9kYXRhLWVsZW1lbnRcIjtcbmltcG9ydCBTaWduYXR1cmVEaWdlc3RNZXRob2QgZnJvbSBcIi4vc2lnbmF0dXJlLWRpZ2VzdC1tZXRob2RcIjtcbmltcG9ydCBTaWduYXR1cmVEaWdlc3RWYWx1ZSBmcm9tIFwiLi9zaWduYXR1cmUtZGlnZXN0LXZhbHVlXCI7XG5pbXBvcnQgU2lnbmF0dXJlUmVmZXJlbmNlVHJhbnNmb3JtIGZyb20gXCIuL3NpZ25hdHVyZS1yZWZlcmVuY2UtdHJhbnNmb3JtXCI7XG5cbi8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi94bWxkc2lnLWNvcmUxLyNzZWMtUmVmZXJlbmNlXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hdHVyZVJlZmVyZW5jZSBleHRlbmRzIERhdGFFbGVtZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgdXJpLFxuICAgIHRyYW5zZm9ybXMsXG4gICAgZGlnZXN0TWV0aG9kID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGEyNTZcIixcbiAgICBkaWdlc3RWYWx1ZVxuICApIHtcbiAgICBzdXBlcihcIlJlZmVyZW5jZVwiLCB1bmRlZmluZWQsIHsgdXJpOiB1cmkgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ0cmFuc2Zvcm1zXCIsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybXM7XG4gICAgICB9LFxuICAgICAgc2V0KHZhbCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgdGhpcy5fdHJhbnNmb3JtcyA9IG5ldyBEYXRhRWxlbWVudChcIlRyYW5zZm9ybXNcIik7XG4gICAgICAgICAgdGhpcy5fdHJhbnNmb3Jtcy50cmFuc2Zvcm0gPSB2YWwubWFwKCh0cmFuc2Zvcm0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU2lnbmF0dXJlUmVmZXJlbmNlVHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gaWYgKEFycmF5LmlzQXJyYXkodHJhbnNmb3JtcykpIHtcbiAgICAvLyAgIHRoaXMudHJhbnNmb3JtcyA9IG5ldyBEYXRhRWxlbWVudChcInRyYW5zZm9ybXNcIik7XG4gICAgLy8gICB0aGlzLnRyYW5zZm9ybXMudHJhbnNmb3JtID0gdHJhbnNmb3Jtcy5tYXAoKHRyYW5zZm9ybSkgPT4ge1xuICAgIC8vICAgICByZXR1cm4gbmV3IFNpZ25hdHVyZVJlZmVyZW5jZVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICAgIC8vICAgfSk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy50cmFuc2Zvcm1zID0gdHJhbnNmb3JtcztcblxuICAgIHRoaXMuZGlnZXN0TWV0aG9kID0gbmV3IFNpZ25hdHVyZURpZ2VzdE1ldGhvZChkaWdlc3RNZXRob2QpO1xuXG4gICAgdGhpcy5kaWdlc3RWYWx1ZSA9IG5ldyBTaWduYXR1cmVEaWdlc3RWYWx1ZShkaWdlc3RWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==
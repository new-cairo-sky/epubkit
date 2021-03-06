"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _dataElement = _interopRequireDefault(require("./data-element"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// https://www.w3.org/TR/xml-c14n/

class SignatureDigestMethod extends _dataElement.default {
  constructor(algorithm) {
    super("DigestMethod", undefined, { algorithm: algorithm });
  }}exports.default = SignatureDigestMethod;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUtZGlnZXN0LW1ldGhvZC5qcyJdLCJuYW1lcyI6WyJTaWduYXR1cmVEaWdlc3RNZXRob2QiLCJEYXRhRWxlbWVudCIsImNvbnN0cnVjdG9yIiwiYWxnb3JpdGhtIiwidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoib0dBQUEscUU7O0FBRUE7O0FBRWUsTUFBTUEscUJBQU4sU0FBb0NDLG9CQUFwQyxDQUFnRDtBQUM3REMsRUFBQUEsV0FBVyxDQUFDQyxTQUFELEVBQVk7QUFDckIsVUFBTSxjQUFOLEVBQXNCQyxTQUF0QixFQUFpQyxFQUFFRCxTQUFTLEVBQUVBLFNBQWIsRUFBakM7QUFDRCxHQUg0RCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFFbGVtZW50IGZyb20gXCIuL2RhdGEtZWxlbWVudFwiO1xuXG4vLyBodHRwczovL3d3dy53My5vcmcvVFIveG1sLWMxNG4vXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hdHVyZURpZ2VzdE1ldGhvZCBleHRlbmRzIERhdGFFbGVtZW50IHtcbiAgY29uc3RydWN0b3IoYWxnb3JpdGhtKSB7XG4gICAgc3VwZXIoXCJEaWdlc3RNZXRob2RcIiwgdW5kZWZpbmVkLCB7IGFsZ29yaXRobTogYWxnb3JpdGhtIH0pO1xuICB9XG59XG4iXX0=
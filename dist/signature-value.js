"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _dataElement = _interopRequireDefault(require("./data-element"));
var _signatureReference = _interopRequireDefault(require("./signature-reference"));
var _signatureDigestMethod = _interopRequireDefault(require("./signature-digest-method"));
var _signatureDigestValue = _interopRequireDefault(require("./signature-digest-value"));
var _signatureCanonicalizationMethod = _interopRequireDefault(require("./signature-canonicalization-method"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// The SignatureValue element contains the actual value of the digital signature; it is always encoded using base64
// https://www.w3.org/TR/xmldsig-core1/#sec-SignatureValue
/*
<element name="SignatureValue" type="ds:SignatureValueType" /> 

<complexType name="SignatureValueType">
  <simpleContent>
    <extension base="base64Binary">
      <attribute name="Id" type="ID" use="optional"/>
    </extension>
  </simpleContent>
</complexType>
*/

class SignatureValue extends _dataElement.default {
  constructor(value, id) {
    // value should be base64
    super("SignatureValue", value, { id: id });
  }}exports.default = SignatureValue;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmUtdmFsdWUuanMiXSwibmFtZXMiOlsiU2lnbmF0dXJlVmFsdWUiLCJEYXRhRWxlbWVudCIsImNvbnN0cnVjdG9yIiwidmFsdWUiLCJpZCJdLCJtYXBwaW5ncyI6Im9HQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsTUFBTUEsY0FBTixTQUE2QkMsb0JBQTdCLENBQXlDO0FBQ3REQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsRUFBUixFQUFZO0FBQ3JCO0FBQ0EsVUFBTSxnQkFBTixFQUF3QkQsS0FBeEIsRUFBK0IsRUFBRUMsRUFBRSxFQUFFQSxFQUFOLEVBQS9CO0FBQ0QsR0FKcUQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhRWxlbWVudCBmcm9tIFwiLi9kYXRhLWVsZW1lbnRcIjtcbmltcG9ydCBTaWduYXR1cmVSZWZlcmVuY2UgZnJvbSBcIi4vc2lnbmF0dXJlLXJlZmVyZW5jZVwiO1xuaW1wb3J0IFNpZ25hdHVyZURpZ2VzdE1ldGhvZCBmcm9tIFwiLi9zaWduYXR1cmUtZGlnZXN0LW1ldGhvZFwiO1xuaW1wb3J0IFNpZ25hdHVyZURpZ2VzdFZhbHVlIGZyb20gXCIuL3NpZ25hdHVyZS1kaWdlc3QtdmFsdWVcIjtcbmltcG9ydCBTaWduYXR1cmVDYW5vbmljYWxpemF0aW9uTWV0aG9kIGZyb20gXCIuL3NpZ25hdHVyZS1jYW5vbmljYWxpemF0aW9uLW1ldGhvZFwiO1xuXG4vLyBUaGUgU2lnbmF0dXJlVmFsdWUgZWxlbWVudCBjb250YWlucyB0aGUgYWN0dWFsIHZhbHVlIG9mIHRoZSBkaWdpdGFsIHNpZ25hdHVyZTsgaXQgaXMgYWx3YXlzIGVuY29kZWQgdXNpbmcgYmFzZTY0XG4vLyBodHRwczovL3d3dy53My5vcmcvVFIveG1sZHNpZy1jb3JlMS8jc2VjLVNpZ25hdHVyZVZhbHVlXG4vKlxuPGVsZW1lbnQgbmFtZT1cIlNpZ25hdHVyZVZhbHVlXCIgdHlwZT1cImRzOlNpZ25hdHVyZVZhbHVlVHlwZVwiIC8+IFxuXG48Y29tcGxleFR5cGUgbmFtZT1cIlNpZ25hdHVyZVZhbHVlVHlwZVwiPlxuICA8c2ltcGxlQ29udGVudD5cbiAgICA8ZXh0ZW5zaW9uIGJhc2U9XCJiYXNlNjRCaW5hcnlcIj5cbiAgICAgIDxhdHRyaWJ1dGUgbmFtZT1cIklkXCIgdHlwZT1cIklEXCIgdXNlPVwib3B0aW9uYWxcIi8+XG4gICAgPC9leHRlbnNpb24+XG4gIDwvc2ltcGxlQ29udGVudD5cbjwvY29tcGxleFR5cGU+XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYXR1cmVWYWx1ZSBleHRlbmRzIERhdGFFbGVtZW50IHtcbiAgY29uc3RydWN0b3IodmFsdWUsIGlkKSB7XG4gICAgLy8gdmFsdWUgc2hvdWxkIGJlIGJhc2U2NFxuICAgIHN1cGVyKFwiU2lnbmF0dXJlVmFsdWVcIiwgdmFsdWUsIHsgaWQ6IGlkIH0pO1xuICB9XG59XG4iXX0=
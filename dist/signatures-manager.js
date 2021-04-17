"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;















var _path = _interopRequireDefault(require("path"));
var xmldsigjs = _interopRequireWildcard(require("xmldsigjs"));

var _xml = require("./utils/xml");

var _environment = _interopRequireDefault(require("./utils/environment"));

var _dataElement = _interopRequireDefault(require("./data-element"));
var _signature = _interopRequireDefault(require("./signature"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function _getRequireWildcardCache() {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {return { "default": obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj["default"] = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArrayLimit(arr, i) {if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _createForOfIteratorHelper(o, allowArrayLike) {var it;if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e2) {throw _e2;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e3) {didErr = true;err = _e3;}, f: function f() {try {if (!normalCompletion && it["return"] != null) it["return"]();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}var

SignaturesManager = /*#__PURE__*/function (_DataElement) {_inherits(SignaturesManager, _DataElement);var _super = _createSuper(SignaturesManager);
  function SignaturesManager() {var _this;var epubLocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";_classCallCheck(this, SignaturesManager);
    _this = _super.call(this, "signatures", undefined, {
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container" });


    _this._rawData = undefined;
    _this.signatures = [];
    _this.epubLocation = epubLocation;
    _this.location = _path["default"].resolve(epubLocation, "./META-INF/signatures.xml");return _this;
  }_createClass(SignaturesManager, [{ key: "initCrypto", value: function initCrypto()

    {
      // only load the webcrypto pollyfill in node
      // xmldsigjs will default to native webcrypto in the browser
      if ((0, _environment["default"])() === "node") {var _require =
        require("@peculiar/webcrypto"),Crypto = _require.Crypto;
        var crypto = new Crypto();
        xmldsigjs.Application.setEngine("WebCrypto", crypto);
      }
    } }, { key: "loadXml", value: function () {var _loadXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(

      data) {var result, _iterator, _step, xmlSig, signature, _loop, _i, _Object$entries;return regeneratorRuntime.wrap(function _callee2$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
                  (0, _xml.parseXml)(data, false));case 2:result = _context3.sent;
                if (result) {
                  this._rawData = result;
                }

                // hashing can be resource intensive so we will run the async functions sequentially.
                this.signatures = [];_iterator = _createForOfIteratorHelper(
                this._rawData.signatures.Signature);_context3.prev = 6;_iterator.s();case 8:if ((_step = _iterator.n()).done) {_context3.next = 21;break;}xmlSig = _step.value;
                signature = new _signature["default"](this.epubLocation);_loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {var _Object$entries$_i, key, value, _xmlSig$signedInfo$, _iterator2, _step2, _xmlSignedInfoReferen, xmlSignedInfoReference, uri, transforms, digestMethod, digestValue, _xmlSig$signatureValu, signatureValueValue, _xmlSig$Object$, _xmlSig$Object$$Manif, _iterator3, _step3, _xmlManifestReference, xmlManifestReference, _uri, _transforms, _iterator4, _step4, xmlTransform, _digestMethod, _digestValue;return regeneratorRuntime.wrap(function _loop$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),

                          key = _Object$entries$_i[0], value = _Object$entries$_i[1];if (!(
                          key === "attr")) {_context2.next = 5;break;}
                          signature.addAttributes(xmlSig.attr);_context2.next = 51;break;case 5:if (!(
                          key === "signedInfo")) {_context2.next = 10;break;}
                          // add signature > signedInfo > references
                          _iterator2 = _createForOfIteratorHelper((_xmlSig$signedInfo$ = xmlSig.signedInfo[0]) === null || _xmlSig$signedInfo$ === void 0 ? void 0 : _xmlSig$signedInfo$.
                          reference);try {for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {xmlSignedInfoReference = _step2.value;
                              // todo: parse this info
                              uri = (_xmlSignedInfoReferen = xmlSignedInfoReference.attr) === null || _xmlSignedInfoReferen === void 0 ? void 0 : _xmlSignedInfoReferen.uri;
                              transforms = undefined;
                              digestMethod = undefined;
                              digestValue = undefined;
                              signature.signedInfo.addReference(
                              uri,
                              transforms,
                              digestMethod,
                              digestValue);

                            }} catch (err) {_iterator2.e(err);} finally {_iterator2.f();}_context2.next = 51;break;case 10:if (!(
                          key === "signatureValue")) {_context2.next = 15;break;}
                          signatureValueValue = (_xmlSig$signatureValu = xmlSig.signatureValue[0]) === null || _xmlSig$signatureValu === void 0 ? void 0 : _xmlSig$signatureValu.value;
                          if (signatureValueValue) {
                            signature.signatureValue.value = signatureValueValue;
                          }_context2.next = 51;break;case 15:if (!(
                          key === "Object")) {_context2.next = 42;break;}
                          // add object > manifest attributes
                          if ((_xmlSig$Object$ = xmlSig.Object[0]) === null || _xmlSig$Object$ === void 0 ? void 0 : (_xmlSig$Object$$Manif = _xmlSig$Object$.Manifest[0]) === null || _xmlSig$Object$$Manif === void 0 ? void 0 : _xmlSig$Object$$Manif.attr) {
                            signature.object.manifest.addAttributes(
                            xmlSig.Object[0].Manifest[0].attr);

                          }
                          // get the object > manifest > references
                          _iterator3 = _createForOfIteratorHelper(xmlSig.Object[0].Manifest[0].
                          Reference);_context2.prev = 18;_iterator3.s();case 20:if ((_step3 = _iterator3.n()).done) {_context2.next = 32;break;}xmlManifestReference = _step3.value;
                          _uri = xmlManifestReference.attr.uri;

                          _transforms = [];_iterator4 = _createForOfIteratorHelper(
                          xmlManifestReference === null || xmlManifestReference === void 0 ? void 0 : (_xmlManifestReference = xmlManifestReference.Transforms[0]) === null || _xmlManifestReference === void 0 ? void 0 : _xmlManifestReference.
                          Transform);try {for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {xmlTransform = _step4.value;
                              _transforms.push(xmlTransform.attr.algorithm);
                            }} catch (err) {_iterator4.e(err);} finally {_iterator4.f();}
                          _digestMethod =
                          xmlManifestReference === null || xmlManifestReference === void 0 ? void 0 : xmlManifestReference.DigestMethod[0].attr.algorithm;
                          _digestValue = xmlManifestReference === null || xmlManifestReference === void 0 ? void 0 : xmlManifestReference.DigestValue[0].value;_context2.next = 30;return (

                            signature.addManifestReference(
                            _uri,
                            _transforms,
                            _digestMethod,
                            _digestValue));case 30:_context2.next = 20;break;case 32:_context2.next = 37;break;case 34:_context2.prev = 34;_context2.t0 = _context2["catch"](18);_iterator3.e(_context2.t0);case 37:_context2.prev = 37;_iterator3.f();return _context2.finish(37);case 40:_context2.next = 51;break;case 42:if (!




                          Array.isArray(value)) {_context2.next = 48;break;}_context2.next = 45;return (
                            Promise.all(
                            value.map( /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(val) {var dataElement;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                                        dataElement = new _dataElement["default"]("".concat(key));_context.next = 3;return (
                                          dataElement.parseXmlObj(val, true));case 3:return _context.abrupt("return",
                                        dataElement);case 4:case "end":return _context.stop();}}}, _callee);}));return function (_x2) {return _ref.apply(this, arguments);};}())));case 45:signature[key] = _context2.sent;_context2.next = 51;break;case 48:



                          signature[key] = new _dataElement["default"](key);_context2.next = 51;return (
                            signature[key].parseXmlObj(value, true));case 51:case "end":return _context2.stop();}}}, _loop, null, [[18, 34, 37, 40]]);});_i = 0, _Object$entries = Object.entries(xmlSig);case 13:if (!(_i < _Object$entries.length)) {_context3.next = 18;break;}return _context3.delegateYield(_loop(), "t0", 15);case 15:_i++;_context3.next = 13;break;case 18:














                this.signatures.push(signature);case 19:_context3.next = 8;break;case 21:_context3.next = 26;break;case 23:_context3.prev = 23;_context3.t1 = _context3["catch"](6);_iterator.e(_context3.t1);case 26:_context3.prev = 26;_iterator.f();return _context3.finish(26);case 29:return _context3.abrupt("return",


                this._rawData);case 30:case "end":return _context3.stop();}}}, _callee2, this, [[6, 23, 26, 29]]);}));function loadXml(_x) {return _loadXml.apply(this, arguments);}return loadXml;}() }, { key: "create", value: function create()


    {
      this.signatures = [];
    } }, { key: "addSignature", value: function addSignature(

    id) {
      this.signatures.push(new _signature["default"](this.epubLocation, id));
    } }, { key: "getSignature", value: function getSignature(

    id) {
      return this.signatures.find(function (signature) {return signature.id === id;});
    }


    /**
      * The signatures.xml file should be included in the signature manifest, but it requires
      * an envelopedTransform. Ie. this will add signatures.xml file to the given signature's manifest.
      * 
      * @param {object} signature - a target signature data-element instance to add file into manifest. 
      */ }, { key: "addSelfToSignatureManifest", value: function () {var _addSelfToSignatureManifest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(
      signature) {var xml, C14NTransform, node, data, digest, digestValue, base64Digest;return regeneratorRuntime.wrap(function _callee3$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (




                  this.getEnvelopedSignatureTransformedXml(signature));case 2:xml = _context4.sent;

                // get the C14N Normalized xml
                C14NTransform = new xmldsigjs.XmlDsigC14NTransform();
                node = xmldsigjs.Parse(xml).documentElement;
                C14NTransform.LoadInnerXml(node);
                // GetOuput returns xml as string
                data = C14NTransform.GetOutput();

                //console.log("after enveloped", new XMLSerializer().serializeToString(data));
                digest = xmldsigjs.CryptoConfig.CreateHashAlgorithm(
                "http://www.w3.org/2001/04/xmlenc#sha256");_context4.next = 10;return (

                  digest.Digest(data));case 10:digestValue = _context4.sent;

                // the fileHash should be represented as a base64 string
                base64Digest = Buffer.from(digestValue).toString("base64");_context4.next = 14;return (
                  signature.addManifestReference(
                  "META-INF/signatures.xml",
                  [
                  "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
                  "http://www.w3.org/TR/2001/REC-xml-c14n-2001031"],

                  "http://www.w3.org/2001/04/xmlenc#sha256",
                  base64Digest));case 14:case "end":return _context4.stop();}}}, _callee3, this);}));function addSelfToSignatureManifest(_x3) {return _addSelfToSignatureManifest.apply(this, arguments);}return addSelfToSignatureManifest;}()



    /**
                                                                                                                                                                                                                                                 * Returns a string represention of signatures xml, with 'enveloped transform' applied.
                                                                                                                                                                                                                                                 * This will remove the provided Signature instance from signatures so that the xml can
                                                                                                                                                                                                                                                 * be signed without recursion.
                                                                                                                                                                                                                                                 * The xmldsigjs.XmlDsigEnvelopedSignatureTransform() is not used due to this issue:
                                                                                                                                                                                                                                                 * https://github.com/PeculiarVentures/xmldsigjs/issues/49
                                                                                                                                                                                                                                                 * The EnvelopedSignature transform is intended to remove only the direct ancestor
                                                                                                                                                                                                                                                 * Signature of the transform.
                                                                                                                                                                                                                                                 *
                                                                                                                                                                                                                                                 * @param {object} envelopedSignature - the signature object instance to be enveloped
                                                                                                                                                                                                                                                 * @returns {string} - enveloped xml
                                                                                                                                                                                                                                                 */ }, { key: "getEnvelopedSignatureTransformedXml", value: function () {var _getEnvelopedSignatureTransformedXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(
      envelopedSignature) {var xmlJsObject, sigIndex, xml;return regeneratorRuntime.wrap(function _callee4$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                xmlJsObject = this.prepareForXml();

                sigIndex = this.signatures.findIndex(
                function (sig) {return sig == envelopedSignature;});


                if (sigIndex !== -1) {
                  xmlJsObject.signatures.Signature.splice(sigIndex, 1);
                }_context5.next = 5;return (

                  (0, _xml.generateXml)(xmlJsObject));case 5:xml = _context5.sent;return _context5.abrupt("return",
                xml);case 7:case "end":return _context5.stop();}}}, _callee4, this);}));function getEnvelopedSignatureTransformedXml(_x4) {return _getEnvelopedSignatureTransformedXml.apply(this, arguments);}return getEnvelopedSignatureTransformedXml;}() }]);return SignaturesManager;}(_dataElement["default"]);exports["default"] = SignaturesManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmVzLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiU2lnbmF0dXJlc01hbmFnZXIiLCJlcHViTG9jYXRpb24iLCJ1bmRlZmluZWQiLCJ4bWxucyIsIl9yYXdEYXRhIiwic2lnbmF0dXJlcyIsImxvY2F0aW9uIiwicGF0aCIsInJlc29sdmUiLCJyZXF1aXJlIiwiQ3J5cHRvIiwiY3J5cHRvIiwieG1sZHNpZ2pzIiwiQXBwbGljYXRpb24iLCJzZXRFbmdpbmUiLCJkYXRhIiwicmVzdWx0IiwiU2lnbmF0dXJlIiwieG1sU2lnIiwic2lnbmF0dXJlIiwia2V5IiwidmFsdWUiLCJhZGRBdHRyaWJ1dGVzIiwiYXR0ciIsInNpZ25lZEluZm8iLCJyZWZlcmVuY2UiLCJ4bWxTaWduZWRJbmZvUmVmZXJlbmNlIiwidXJpIiwidHJhbnNmb3JtcyIsImRpZ2VzdE1ldGhvZCIsImRpZ2VzdFZhbHVlIiwiYWRkUmVmZXJlbmNlIiwic2lnbmF0dXJlVmFsdWVWYWx1ZSIsInNpZ25hdHVyZVZhbHVlIiwiT2JqZWN0IiwiTWFuaWZlc3QiLCJvYmplY3QiLCJtYW5pZmVzdCIsIlJlZmVyZW5jZSIsInhtbE1hbmlmZXN0UmVmZXJlbmNlIiwiVHJhbnNmb3JtcyIsIlRyYW5zZm9ybSIsInhtbFRyYW5zZm9ybSIsInB1c2giLCJhbGdvcml0aG0iLCJEaWdlc3RNZXRob2QiLCJEaWdlc3RWYWx1ZSIsImFkZE1hbmlmZXN0UmVmZXJlbmNlIiwiQXJyYXkiLCJpc0FycmF5IiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsInZhbCIsImRhdGFFbGVtZW50IiwiRGF0YUVsZW1lbnQiLCJwYXJzZVhtbE9iaiIsImVudHJpZXMiLCJpZCIsImZpbmQiLCJnZXRFbnZlbG9wZWRTaWduYXR1cmVUcmFuc2Zvcm1lZFhtbCIsInhtbCIsIkMxNE5UcmFuc2Zvcm0iLCJYbWxEc2lnQzE0TlRyYW5zZm9ybSIsIm5vZGUiLCJQYXJzZSIsImRvY3VtZW50RWxlbWVudCIsIkxvYWRJbm5lclhtbCIsIkdldE91dHB1dCIsImRpZ2VzdCIsIkNyeXB0b0NvbmZpZyIsIkNyZWF0ZUhhc2hBbGdvcml0aG0iLCJEaWdlc3QiLCJiYXNlNjREaWdlc3QiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJlbnZlbG9wZWRTaWduYXR1cmUiLCJ4bWxKc09iamVjdCIsInByZXBhcmVGb3JYbWwiLCJzaWdJbmRleCIsImZpbmRJbmRleCIsInNpZyIsInNwbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsZ0U7O0FBRXFCQSxpQjtBQUNuQiwrQkFBK0IsZUFBbkJDLFlBQW1CLHVFQUFKLEVBQUk7QUFDN0IsOEJBQU0sWUFBTixFQUFvQkMsU0FBcEIsRUFBK0I7QUFDN0JDLE1BQUFBLEtBQUssRUFBRSxpREFEc0IsRUFBL0I7OztBQUlBLFVBQUtDLFFBQUwsR0FBZ0JGLFNBQWhCO0FBQ0EsVUFBS0csVUFBTCxHQUFrQixFQUFsQjtBQUNBLFVBQUtKLFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0EsVUFBS0ssUUFBTCxHQUFnQkMsaUJBQUtDLE9BQUwsQ0FBYVAsWUFBYixFQUEyQiwyQkFBM0IsQ0FBaEIsQ0FSNkI7QUFTOUIsRzs7QUFFWTtBQUNYO0FBQ0E7QUFDQSxVQUFJLG1DQUFxQixNQUF6QixFQUFpQztBQUNaUSxRQUFBQSxPQUFPLENBQUMscUJBQUQsQ0FESyxDQUN2QkMsTUFEdUIsWUFDdkJBLE1BRHVCO0FBRS9CLFlBQU1DLE1BQU0sR0FBRyxJQUFJRCxNQUFKLEVBQWY7QUFDQUUsUUFBQUEsU0FBUyxDQUFDQyxXQUFWLENBQXNCQyxTQUF0QixDQUFnQyxXQUFoQyxFQUE2Q0gsTUFBN0M7QUFDRDtBQUNGLEs7O0FBRWFJLE1BQUFBLEk7QUFDUyxxQ0FBU0EsSUFBVCxFQUFlLEtBQWYsQyxTQUFmQyxNO0FBQ04sb0JBQUlBLE1BQUosRUFBWTtBQUNWLHVCQUFLWixRQUFMLEdBQWdCWSxNQUFoQjtBQUNEOztBQUVEO0FBQ0EscUJBQUtY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ZXB1Yi1vY2YuaHRtbCNzZWMtY29udGFpbmVyLW1ldGFpbmYtc2lnbmF0dXJlcy54bWxcbmh0dHBzOi8vd3d3LnczLm9yZy9UUi8yMDA4L1JFQy14bWxkc2lnLWNvcmUtMjAwODA2MTAvI3NlYy1FbnZlbG9wZWRTaWduYXR1cmVcbmh0dHBzOi8vZ2l0aHViLmNvbS9QZWN1bGlhclZlbnR1cmVzL3htbGRzaWdqc1xuXG5UaGUgb3JpZ2luYWwgZXB1YiBpcyBzaWduZWQgdXNpbmcgdGhlIHNpZ25hdHVyZSArIG1hbmlmZXN0IG1ldGhvZC5cblRoZSBzaWduYXR1cmUueG1sIGZpbGUgaXMgaW5jbHVkZWQgaW4gdGhlIHNpZyBtYW5pZmVzdCBzbyB0aGF0IGNoYW5nZXMgdG8gdGhlIGZpbGUgY2FtIGJlIGRldGVjdGVkLiBcbkEgd2F0ZXJtYXJrZWQgZXB1YiBzaG91bGQgbWFpbnRhaW4gdGhhdCBvcmdpbmFsIHNpZ25hdHVyZSBpbiB0aGUgc2lnbmF0dXJlcy54bWwgZmlsZSBhbmQgYWRkIGEgbmV3XG5zaWduYXR1cmUuIFRoZSBzaWcgc2hvdWxkIGJlIHRyYW5zZm9ybWVkIHVzaW5nIHRoZSBFbnZlbG9wZWQgU2lnbmF0dXJlIFRyYW5zZm9ybS4gSW5cbnRoaXMgd2F5IHRoZSB3YXRlcm1hcmtlZCBlcHViIHNpZ25hdHVyZSBjYW4gYmUgdHJhY2VkIGJhY2sgYW5kIG1hdGNoZWQgdG8gb3JpZ2luYWwgZXB1Yi4gXG5cbk5vdGUgdGhhdCB0aGUgU2lnbmF0dXJlIHhtbCBub2RlLCBhcyBhIHczZCBzdGFuZGFyZCBoYXMgZGlmZmVyZW50IGF0dHIgY2FzZSByZXF1aXJlbWVudHNcbnRoYW4gb3RoZXIgZXB1YiBzcGVjcy4gU2lnbmF0dXJlIGF0dHIgdXNlIFBhc2NhbENhc2VcbiovXG5cbi8vIGltcG9ydCB7IENyeXB0byB9IGZyb20gXCJAcGVjdWxpYXIvd2ViY3J5cHRvXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgeG1sZHNpZ2pzIGZyb20gXCJ4bWxkc2lnanNcIjtcblxuaW1wb3J0IHsgZ2VuZXJhdGVYbWwsIHBhcnNlWG1sIH0gZnJvbSBcIi4vdXRpbHMveG1sXCI7XG5cbmltcG9ydCBnZXRFbnZpcm9ubWVudCBmcm9tIFwiLi91dGlscy9lbnZpcm9ubWVudFwiO1xuXG5pbXBvcnQgRGF0YUVsZW1lbnQgZnJvbSBcIi4vZGF0YS1lbGVtZW50XCI7XG5pbXBvcnQgU2lnbmF0dXJlIGZyb20gXCIuL3NpZ25hdHVyZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYXR1cmVzTWFuYWdlciBleHRlbmRzIERhdGFFbGVtZW50IHtcbiAgY29uc3RydWN0b3IoZXB1YkxvY2F0aW9uID0gXCJcIikge1xuICAgIHN1cGVyKFwic2lnbmF0dXJlc1wiLCB1bmRlZmluZWQsIHtcbiAgICAgIHhtbG5zOiBcInVybjpvYXNpczpuYW1lczp0YzpvcGVuZG9jdW1lbnQ6eG1sbnM6Y29udGFpbmVyXCIsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9yYXdEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2lnbmF0dXJlcyA9IFtdO1xuICAgIHRoaXMuZXB1YkxvY2F0aW9uID0gZXB1YkxvY2F0aW9uO1xuICAgIHRoaXMubG9jYXRpb24gPSBwYXRoLnJlc29sdmUoZXB1YkxvY2F0aW9uLCBcIi4vTUVUQS1JTkYvc2lnbmF0dXJlcy54bWxcIik7XG4gIH1cblxuICBpbml0Q3J5cHRvKCkge1xuICAgIC8vIG9ubHkgbG9hZCB0aGUgd2ViY3J5cHRvIHBvbGx5ZmlsbCBpbiBub2RlXG4gICAgLy8geG1sZHNpZ2pzIHdpbGwgZGVmYXVsdCB0byBuYXRpdmUgd2ViY3J5cHRvIGluIHRoZSBicm93c2VyXG4gICAgaWYgKGdldEVudmlyb25tZW50KCkgPT09IFwibm9kZVwiKSB7XG4gICAgICBjb25zdCB7IENyeXB0byB9ID0gcmVxdWlyZShcIkBwZWN1bGlhci93ZWJjcnlwdG9cIik7XG4gICAgICBjb25zdCBjcnlwdG8gPSBuZXcgQ3J5cHRvKCk7XG4gICAgICB4bWxkc2lnanMuQXBwbGljYXRpb24uc2V0RW5naW5lKFwiV2ViQ3J5cHRvXCIsIGNyeXB0byk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZFhtbChkYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcGFyc2VYbWwoZGF0YSwgZmFsc2UpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHRoaXMuX3Jhd0RhdGEgPSByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gaGFzaGluZyBjYW4gYmUgcmVzb3VyY2UgaW50ZW5zaXZlIHNvIHdlIHdpbGwgcnVuIHRoZSBhc3luYyBmdW5jdGlvbnMgc2VxdWVudGlhbGx5LlxuICAgIHRoaXMuc2lnbmF0dXJlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgeG1sU2lnIG9mIHRoaXMuX3Jhd0RhdGEuc2lnbmF0dXJlcy5TaWduYXR1cmUpIHtcbiAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IG5ldyBTaWduYXR1cmUodGhpcy5lcHViTG9jYXRpb24pO1xuXG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoeG1sU2lnKSkge1xuICAgICAgICBpZiAoa2V5ID09PSBcImF0dHJcIikge1xuICAgICAgICAgIHNpZ25hdHVyZS5hZGRBdHRyaWJ1dGVzKHhtbFNpZy5hdHRyKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic2lnbmVkSW5mb1wiKSB7XG4gICAgICAgICAgLy8gYWRkIHNpZ25hdHVyZSA+IHNpZ25lZEluZm8gPiByZWZlcmVuY2VzXG4gICAgICAgICAgZm9yIChjb25zdCB4bWxTaWduZWRJbmZvUmVmZXJlbmNlIG9mIHhtbFNpZy5zaWduZWRJbmZvWzBdXG4gICAgICAgICAgICA/LnJlZmVyZW5jZSkge1xuICAgICAgICAgICAgLy8gdG9kbzogcGFyc2UgdGhpcyBpbmZvXG4gICAgICAgICAgICBjb25zdCB1cmkgPSB4bWxTaWduZWRJbmZvUmVmZXJlbmNlLmF0dHI/LnVyaTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBkaWdlc3RNZXRob2QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBkaWdlc3RWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHNpZ25hdHVyZS5zaWduZWRJbmZvLmFkZFJlZmVyZW5jZShcbiAgICAgICAgICAgICAgdXJpLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm1zLFxuICAgICAgICAgICAgICBkaWdlc3RNZXRob2QsXG4gICAgICAgICAgICAgIGRpZ2VzdFZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic2lnbmF0dXJlVmFsdWVcIikge1xuICAgICAgICAgIGNvbnN0IHNpZ25hdHVyZVZhbHVlVmFsdWUgPSB4bWxTaWcuc2lnbmF0dXJlVmFsdWVbMF0/LnZhbHVlO1xuICAgICAgICAgIGlmIChzaWduYXR1cmVWYWx1ZVZhbHVlKSB7XG4gICAgICAgICAgICBzaWduYXR1cmUuc2lnbmF0dXJlVmFsdWUudmFsdWUgPSBzaWduYXR1cmVWYWx1ZVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwiT2JqZWN0XCIpIHtcbiAgICAgICAgICAvLyBhZGQgb2JqZWN0ID4gbWFuaWZlc3QgYXR0cmlidXRlc1xuICAgICAgICAgIGlmICh4bWxTaWcuT2JqZWN0WzBdPy5NYW5pZmVzdFswXT8uYXR0cikge1xuICAgICAgICAgICAgc2lnbmF0dXJlLm9iamVjdC5tYW5pZmVzdC5hZGRBdHRyaWJ1dGVzKFxuICAgICAgICAgICAgICB4bWxTaWcuT2JqZWN0WzBdLk1hbmlmZXN0WzBdLmF0dHJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGdldCB0aGUgb2JqZWN0ID4gbWFuaWZlc3QgPiByZWZlcmVuY2VzXG4gICAgICAgICAgZm9yIChjb25zdCB4bWxNYW5pZmVzdFJlZmVyZW5jZSBvZiB4bWxTaWcuT2JqZWN0WzBdLk1hbmlmZXN0WzBdXG4gICAgICAgICAgICAuUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICBjb25zdCB1cmkgPSB4bWxNYW5pZmVzdFJlZmVyZW5jZS5hdHRyLnVyaTtcblxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgeG1sVHJhbnNmb3JtIG9mIHhtbE1hbmlmZXN0UmVmZXJlbmNlPy5UcmFuc2Zvcm1zWzBdXG4gICAgICAgICAgICAgID8uVHJhbnNmb3JtKSB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybXMucHVzaCh4bWxUcmFuc2Zvcm0uYXR0ci5hbGdvcml0aG0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGlnZXN0TWV0aG9kID1cbiAgICAgICAgICAgICAgeG1sTWFuaWZlc3RSZWZlcmVuY2U/LkRpZ2VzdE1ldGhvZFswXS5hdHRyLmFsZ29yaXRobTtcbiAgICAgICAgICAgIGNvbnN0IGRpZ2VzdFZhbHVlID0geG1sTWFuaWZlc3RSZWZlcmVuY2U/LkRpZ2VzdFZhbHVlWzBdLnZhbHVlO1xuXG4gICAgICAgICAgICBhd2FpdCBzaWduYXR1cmUuYWRkTWFuaWZlc3RSZWZlcmVuY2UoXG4gICAgICAgICAgICAgIHVyaSxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtcyxcbiAgICAgICAgICAgICAgZGlnZXN0TWV0aG9kLFxuICAgICAgICAgICAgICBkaWdlc3RWYWx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcGFyc2UgYWxsIG90aGVyIGRhdGEgd2l0aCBnZW5lcmljIGRhdGEtZWxlbWVudHNcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHNpZ25hdHVyZVtrZXldID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgIHZhbHVlLm1hcChhc3luYyAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YUVsZW1lbnQgPSBuZXcgRGF0YUVsZW1lbnQoYCR7a2V5fWApO1xuICAgICAgICAgICAgICAgIGF3YWl0IGRhdGFFbGVtZW50LnBhcnNlWG1sT2JqKHZhbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFFbGVtZW50O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2lnbmF0dXJlW2tleV0gPSBuZXcgRGF0YUVsZW1lbnQoa2V5KTtcbiAgICAgICAgICAgIGF3YWl0IHNpZ25hdHVyZVtrZXldLnBhcnNlWG1sT2JqKHZhbHVlLCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gaWYgKHRoaXNba2V5XSAmJiBBcnJheS5pc0FycmF5KHRoaXNba2V5XSkpIHtcbiAgICAgICAgICAvLyAgIGNvbnN0IGxlbmd0aCA9IHRoaXNba2V5XS5wdXNoKG5ldyBEYXRhRWxlbWVudChrZXkpKTtcbiAgICAgICAgICAvLyAgIGF3YWl0IHRoaXNba2V5XVtsZW5ndGggLSAxXS5wYXJzZVhtbE9iaih2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgLy8gfSBlbHNlIGlmICh0aGlzW2tleV0pIHtcbiAgICAgICAgICAvLyAgIHRoaXNba2V5XSA9IFt0aGlzW2tleV1dO1xuICAgICAgICAgIC8vICAgY29uc3QgbGVuZ3RoID0gdGhpc1trZXldLnB1c2gobmV3IERhdGFFbGVtZW50KGtleSkpO1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpc1trZXldW2xlbmd0aCAtIDFdLnBhcnNlWG1sT2JqKHZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgIC8vICAgdGhpc1trZXldID0gbmV3IERhdGFFbGVtZW50KGtleSk7XG4gICAgICAgICAgLy8gICBhd2FpdCB0aGlzW2tleV0ucGFyc2VYbWxPYmoodmFsdWUsIHRydWUpO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zaWduYXR1cmVzLnB1c2goc2lnbmF0dXJlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcmF3RGF0YTtcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLnNpZ25hdHVyZXMgPSBbXTtcbiAgfVxuXG4gIGFkZFNpZ25hdHVyZShpZCkge1xuICAgIHRoaXMuc2lnbmF0dXJlcy5wdXNoKG5ldyBTaWduYXR1cmUodGhpcy5lcHViTG9jYXRpb24sIGlkKSk7XG4gIH1cblxuICBnZXRTaWduYXR1cmUoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5zaWduYXR1cmVzLmZpbmQoKHNpZ25hdHVyZSkgPT4gc2lnbmF0dXJlLmlkID09PSBpZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFRoZSBzaWduYXR1cmVzLnhtbCBmaWxlIHNob3VsZCBiZSBpbmNsdWRlZCBpbiB0aGUgc2lnbmF0dXJlIG1hbmlmZXN0LCBidXQgaXQgcmVxdWlyZXNcbiAgKiBhbiBlbnZlbG9wZWRUcmFuc2Zvcm0uIEllLiB0aGlzIHdpbGwgYWRkIHNpZ25hdHVyZXMueG1sIGZpbGUgdG8gdGhlIGdpdmVuIHNpZ25hdHVyZSdzIG1hbmlmZXN0LlxuICAqIFxuICAqIEBwYXJhbSB7b2JqZWN0fSBzaWduYXR1cmUgLSBhIHRhcmdldCBzaWduYXR1cmUgZGF0YS1lbGVtZW50IGluc3RhbmNlIHRvIGFkZCBmaWxlIGludG8gbWFuaWZlc3QuIFxuICAqL1xuICBhc3luYyBhZGRTZWxmVG9TaWduYXR1cmVNYW5pZmVzdChzaWduYXR1cmUpIHtcbiAgICAvLyBnZXQgdGhlIGVudmVsb3BlZCB0cmFuc2Zyb21lZCB4bWwgZm9yIHRoaXMgc2lnbmF0dXJlcyB4bWxcbiAgICAvLyBub3RlOiB3ZSBkb24ndCB1c2UgdGhlIHhtbGRzaWdqcyBYbWxEc2lnRW52ZWxvcGVkU2lnbmF0dXJlVHJhbnNmb3JtXG4gICAgLy8gYmVjYXVzZSBvZiBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vUGVjdWxpYXJWZW50dXJlcy94bWxkc2lnanMvaXNzdWVzLzQ5XG4gICAgLy8gVE9ETzogcGF0Y2ggd2hlbiBpc3N1ZSBpcyBmaXhlZC5cbiAgICBjb25zdCB4bWwgPSBhd2FpdCB0aGlzLmdldEVudmVsb3BlZFNpZ25hdHVyZVRyYW5zZm9ybWVkWG1sKHNpZ25hdHVyZSk7XG5cbiAgICAvLyBnZXQgdGhlIEMxNE4gTm9ybWFsaXplZCB4bWxcbiAgICBjb25zdCBDMTROVHJhbnNmb3JtID0gbmV3IHhtbGRzaWdqcy5YbWxEc2lnQzE0TlRyYW5zZm9ybSgpO1xuICAgIGNvbnN0IG5vZGUgPSB4bWxkc2lnanMuUGFyc2UoeG1sKS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgQzE0TlRyYW5zZm9ybS5Mb2FkSW5uZXJYbWwobm9kZSk7XG4gICAgLy8gR2V0T3VwdXQgcmV0dXJucyB4bWwgYXMgc3RyaW5nXG4gICAgbGV0IGRhdGEgPSBDMTROVHJhbnNmb3JtLkdldE91dHB1dCgpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhcImFmdGVyIGVudmVsb3BlZFwiLCBuZXcgWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKGRhdGEpKTtcbiAgICBjb25zdCBkaWdlc3QgPSB4bWxkc2lnanMuQ3J5cHRvQ29uZmlnLkNyZWF0ZUhhc2hBbGdvcml0aG0oXG4gICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NlwiXG4gICAgKTtcbiAgICBjb25zdCBkaWdlc3RWYWx1ZSA9IGF3YWl0IGRpZ2VzdC5EaWdlc3QoZGF0YSk7XG5cbiAgICAvLyB0aGUgZmlsZUhhc2ggc2hvdWxkIGJlIHJlcHJlc2VudGVkIGFzIGEgYmFzZTY0IHN0cmluZ1xuICAgIGNvbnN0IGJhc2U2NERpZ2VzdCA9IEJ1ZmZlci5mcm9tKGRpZ2VzdFZhbHVlKS50b1N0cmluZyhcImJhc2U2NFwiKTtcbiAgICBhd2FpdCBzaWduYXR1cmUuYWRkTWFuaWZlc3RSZWZlcmVuY2UoXG4gICAgICBcIk1FVEEtSU5GL3NpZ25hdHVyZXMueG1sXCIsXG4gICAgICBbXG4gICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmVcIixcbiAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy14bWwtYzE0bi0yMDAxMDMxXCIsXG4gICAgICBdLFxuICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGEyNTZcIixcbiAgICAgIGJhc2U2NERpZ2VzdFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRpb24gb2Ygc2lnbmF0dXJlcyB4bWwsIHdpdGggJ2VudmVsb3BlZCB0cmFuc2Zvcm0nIGFwcGxpZWQuXG4gICAqIFRoaXMgd2lsbCByZW1vdmUgdGhlIHByb3ZpZGVkIFNpZ25hdHVyZSBpbnN0YW5jZSBmcm9tIHNpZ25hdHVyZXMgc28gdGhhdCB0aGUgeG1sIGNhblxuICAgKiBiZSBzaWduZWQgd2l0aG91dCByZWN1cnNpb24uXG4gICAqIFRoZSB4bWxkc2lnanMuWG1sRHNpZ0VudmVsb3BlZFNpZ25hdHVyZVRyYW5zZm9ybSgpIGlzIG5vdCB1c2VkIGR1ZSB0byB0aGlzIGlzc3VlOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vUGVjdWxpYXJWZW50dXJlcy94bWxkc2lnanMvaXNzdWVzLzQ5XG4gICAqIFRoZSBFbnZlbG9wZWRTaWduYXR1cmUgdHJhbnNmb3JtIGlzIGludGVuZGVkIHRvIHJlbW92ZSBvbmx5IHRoZSBkaXJlY3QgYW5jZXN0b3JcbiAgICogU2lnbmF0dXJlIG9mIHRoZSB0cmFuc2Zvcm0uXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlbnZlbG9wZWRTaWduYXR1cmUgLSB0aGUgc2lnbmF0dXJlIG9iamVjdCBpbnN0YW5jZSB0byBiZSBlbnZlbG9wZWRcbiAgICogQHJldHVybnMge3N0cmluZ30gLSBlbnZlbG9wZWQgeG1sXG4gICAqL1xuICBhc3luYyBnZXRFbnZlbG9wZWRTaWduYXR1cmVUcmFuc2Zvcm1lZFhtbChlbnZlbG9wZWRTaWduYXR1cmUpIHtcbiAgICBjb25zdCB4bWxKc09iamVjdCA9IHRoaXMucHJlcGFyZUZvclhtbCgpO1xuXG4gICAgY29uc3Qgc2lnSW5kZXggPSB0aGlzLnNpZ25hdHVyZXMuZmluZEluZGV4KFxuICAgICAgKHNpZykgPT4gc2lnID09IGVudmVsb3BlZFNpZ25hdHVyZVxuICAgICk7XG5cbiAgICBpZiAoc2lnSW5kZXggIT09IC0xKSB7XG4gICAgICB4bWxKc09iamVjdC5zaWduYXR1cmVzLlNpZ25hdHVyZS5zcGxpY2Uoc2lnSW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGNvbnN0IHhtbCA9IGF3YWl0IGdlbmVyYXRlWG1sKHhtbEpzT2JqZWN0KTtcbiAgICByZXR1cm4geG1sO1xuICB9XG59XG4iXX0=
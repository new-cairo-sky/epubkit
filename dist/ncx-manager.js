"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _es6Promisify = require("es6-promisify");
var _xml2js = _interopRequireDefault(require("xml2js"));
var _fileManager = _interopRequireDefault(require("./file-manager"));
var _xml = require("./utils/xml");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

NcxManager = /*#__PURE__*/function () {
  function NcxManager() {_classCallCheck(this, NcxManager);
    this._content = undefined;
  }_createClass(NcxManager, [{ key: "init", value: function init(

    jsonData) {
      this._content = jsonData;
    } }, { key: "loadXml", value: function () {var _loadXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (


                  (0, _xml.parseXml)(data));case 2:result = _context.sent;

                if (result) {
                  this.rawData = result;

                  if (this.rawData["package"].attr) {
                    this.addAttributes(this.rawData.ncx.attr);
                  }
                }case 4:case "end":return _context.stop();}}}, _callee, this);}));function loadXml() {return _loadXml.apply(this, arguments);}return loadXml;}() }, { key: "oldloadFile", value: function () {var _oldloadFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(


      newPath) {var result, fileManager, data;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:

                this._path = newPath ? newPath : this._path;

                fileManager = new _fileManager["default"]();_context2.next = 4;return (
                  fileManager.readFile(this._path));case 4:data = _context2.sent;if (

                data) {_context2.next = 8;break;}
                console.warn("Error reading file", this._path);return _context2.abrupt("return");case 8:_context2.prev = 8;_context2.next = 11;return (





                  (0, _es6Promisify.promisify)(_xml2js["default"].parseString)(data));case 11:result = _context2.sent;_context2.next = 18;break;case 14:_context2.prev = 14;_context2.t0 = _context2["catch"](8);

                console.warn("Error parsing ncx file:", _context2.t0);return _context2.abrupt("return");case 18:



                this._content = result;return _context2.abrupt("return",
                result);case 20:case "end":return _context2.stop();}}}, _callee2, this, [[8, 14]]);}));function oldloadFile(_x) {return _oldloadFile.apply(this, arguments);}return oldloadFile;}() }, { key: "content", get: function get()


    {
      return this._content;
    } }]);return NcxManager;}();var _default =


NcxManager;exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9uY3gtbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJOY3hNYW5hZ2VyIiwiX2NvbnRlbnQiLCJ1bmRlZmluZWQiLCJqc29uRGF0YSIsImRhdGEiLCJyZXN1bHQiLCJyYXdEYXRhIiwiYXR0ciIsImFkZEF0dHJpYnV0ZXMiLCJuY3giLCJuZXdQYXRoIiwiX3BhdGgiLCJmaWxlTWFuYWdlciIsIkZpbGVNYW5hZ2VyIiwicmVhZEZpbGUiLCJjb25zb2xlIiwid2FybiIsInhtbDJqcyIsInBhcnNlU3RyaW5nIl0sIm1hcHBpbmdzIjoidUdBQUE7QUFDQTtBQUNBO0FBQ0Esa0M7O0FBRU1BLFU7QUFDSix3QkFBYztBQUNaLFNBQUtDLFFBQUwsR0FBZ0JDLFNBQWhCO0FBQ0QsRzs7QUFFSUMsSUFBQUEsUSxFQUFVO0FBQ2IsV0FBS0YsUUFBTCxHQUFnQkUsUUFBaEI7QUFDRCxLOzs7QUFHc0IscUNBQVNDLElBQVQsQyxTQUFmQyxNOztBQUVOLG9CQUFJQSxNQUFKLEVBQVk7QUFDVix1QkFBS0MsT0FBTCxHQUFlRCxNQUFmOztBQUVBLHNCQUFJLEtBQUtDLE9BQUwsWUFBcUJDLElBQXpCLEVBQStCO0FBQzdCLHlCQUFLQyxhQUFMLENBQW1CLEtBQUtGLE9BQUwsQ0FBYUcsR0FBYixDQUFpQkYsSUFBcEM7QUFDRDtBQUNGLGlCOzs7QUFHZUcsTUFBQUEsTzs7QUFFaEIscUJBQUtDLEtBQUwsR0FBYUQsT0FBTyxHQUFHQSxPQUFILEdBQWEsS0FBS0MsS0FBdEM7O0FBRU1DLGdCQUFBQSxXLEdBQWMsSUFBSUMsdUJBQUosRTtBQUNERCxrQkFBQUEsV0FBVyxDQUFDRSxRQUFaLENBQXFCLEtBQUtILEtBQTFCLEMsU0FBYlAsSTs7QUFFREEsZ0JBQUFBLEk7QUFDSFcsZ0JBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG9CQUFiLEVBQW1DLEtBQUtMLEtBQXhDLEU7Ozs7OztBQU1lLCtDQUFVTSxtQkFBT0MsV0FBakIsRUFBOEJkLElBQTlCLEMsVUFBZkMsTTs7QUFFQVUsZ0JBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHlCQUFiLGdCOzs7O0FBSUYscUJBQUtmLFFBQUwsR0FBZ0JJLE1BQWhCLEM7QUFDT0EsZ0JBQUFBLE07OztBQUdLO0FBQ1osYUFBTyxLQUFLSixRQUFaO0FBQ0QsSzs7O0FBR1lELFUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tIFwiZXM2LXByb21pc2lmeVwiO1xuaW1wb3J0IHhtbDJqcyBmcm9tIFwieG1sMmpzXCI7XG5pbXBvcnQgRmlsZU1hbmFnZXIgZnJvbSBcIi4vZmlsZS1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBwYXJzZVhtbCB9IGZyb20gXCIuL3V0aWxzL3htbFwiO1xuXG5jbGFzcyBOY3hNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY29udGVudCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGluaXQoanNvbkRhdGEpIHtcbiAgICB0aGlzLl9jb250ZW50ID0ganNvbkRhdGE7XG4gIH1cblxuICBhc3luYyBsb2FkWG1sKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBhcnNlWG1sKGRhdGEpO1xuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgdGhpcy5yYXdEYXRhID0gcmVzdWx0O1xuXG4gICAgICBpZiAodGhpcy5yYXdEYXRhLnBhY2thZ2UuYXR0cikge1xuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZXModGhpcy5yYXdEYXRhLm5jeC5hdHRyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBvbGRsb2FkRmlsZShuZXdQYXRoKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICB0aGlzLl9wYXRoID0gbmV3UGF0aCA/IG5ld1BhdGggOiB0aGlzLl9wYXRoO1xuXG4gICAgY29uc3QgZmlsZU1hbmFnZXIgPSBuZXcgRmlsZU1hbmFnZXIoKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZmlsZU1hbmFnZXIucmVhZEZpbGUodGhpcy5fcGF0aCk7XG5cbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkVycm9yIHJlYWRpbmcgZmlsZVwiLCB0aGlzLl9wYXRoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gY29uc3QgcGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoKTtcbiAgICAgIHJlc3VsdCA9IGF3YWl0IHByb21pc2lmeSh4bWwyanMucGFyc2VTdHJpbmcpKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKFwiRXJyb3IgcGFyc2luZyBuY3ggZmlsZTpcIiwgZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZW50ID0gcmVzdWx0O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXQgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOY3hNYW5hZ2VyO1xuIl19
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _es6Promisify = require("es6-promisify");
var _xml2js = _interopRequireDefault(require("xml2js"));
var _fileManager = _interopRequireDefault(require("./file-manager"));
var _xml = require("./utils/xml");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class NcxManager {
  constructor() {
    this._content = undefined;
  }

  init(jsonData) {
    this._content = jsonData;
  }

  async loadXml() {
    const result = await (0, _xml.parseXml)(data);

    if (result) {
      this.rawData = result;

      if (this.rawData.package.attr) {
        this.addAttributes(this.rawData.ncx.attr);
      }
    }
  }

  async oldloadFile(newPath) {
    let result;
    this._path = newPath ? newPath : this._path;

    const fileManager = new _fileManager.default();
    const data = await fileManager.readFile(this._path);

    if (!data) {
      console.warn("Error reading file", this._path);
      return;
    }

    try {
      // const parser = new xml2js.Parser();
      result = await (0, _es6Promisify.promisify)(_xml2js.default.parseString)(data);
    } catch (err) {
      console.warn("Error parsing ncx file:", err);
      return;
    }

    this._content = result;
    return result;
  }

  get content() {
    return this._content;
  }}var _default =


NcxManager;exports.default = _default;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9uY3gtbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJOY3hNYW5hZ2VyIiwiY29uc3RydWN0b3IiLCJfY29udGVudCIsInVuZGVmaW5lZCIsImluaXQiLCJqc29uRGF0YSIsImxvYWRYbWwiLCJyZXN1bHQiLCJkYXRhIiwicmF3RGF0YSIsInBhY2thZ2UiLCJhdHRyIiwiYWRkQXR0cmlidXRlcyIsIm5jeCIsIm9sZGxvYWRGaWxlIiwibmV3UGF0aCIsIl9wYXRoIiwiZmlsZU1hbmFnZXIiLCJGaWxlTWFuYWdlciIsInJlYWRGaWxlIiwiY29uc29sZSIsIndhcm4iLCJ4bWwyanMiLCJwYXJzZVN0cmluZyIsImVyciIsImNvbnRlbnQiXSwibWFwcGluZ3MiOiJvR0FBQTtBQUNBO0FBQ0E7QUFDQSxrQzs7QUFFQSxNQUFNQSxVQUFOLENBQWlCO0FBQ2ZDLEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtDLFFBQUwsR0FBZ0JDLFNBQWhCO0FBQ0Q7O0FBRURDLEVBQUFBLElBQUksQ0FBQ0MsUUFBRCxFQUFXO0FBQ2IsU0FBS0gsUUFBTCxHQUFnQkcsUUFBaEI7QUFDRDs7QUFFWSxRQUFQQyxPQUFPLEdBQUc7QUFDZCxVQUFNQyxNQUFNLEdBQUcsTUFBTSxtQkFBU0MsSUFBVCxDQUFyQjs7QUFFQSxRQUFJRCxNQUFKLEVBQVk7QUFDVixXQUFLRSxPQUFMLEdBQWVGLE1BQWY7O0FBRUEsVUFBSSxLQUFLRSxPQUFMLENBQWFDLE9BQWIsQ0FBcUJDLElBQXpCLEVBQStCO0FBQzdCLGFBQUtDLGFBQUwsQ0FBbUIsS0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCRixJQUFwQztBQUNEO0FBQ0Y7QUFDRjs7QUFFZ0IsUUFBWEcsV0FBVyxDQUFDQyxPQUFELEVBQVU7QUFDekIsUUFBSVIsTUFBSjtBQUNBLFNBQUtTLEtBQUwsR0FBYUQsT0FBTyxHQUFHQSxPQUFILEdBQWEsS0FBS0MsS0FBdEM7O0FBRUEsVUFBTUMsV0FBVyxHQUFHLElBQUlDLG9CQUFKLEVBQXBCO0FBQ0EsVUFBTVYsSUFBSSxHQUFHLE1BQU1TLFdBQVcsQ0FBQ0UsUUFBWixDQUFxQixLQUFLSCxLQUExQixDQUFuQjs7QUFFQSxRQUFJLENBQUNSLElBQUwsRUFBVztBQUNUWSxNQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxvQkFBYixFQUFtQyxLQUFLTCxLQUF4QztBQUNBO0FBQ0Q7O0FBRUQsUUFBSTtBQUNGO0FBQ0FULE1BQUFBLE1BQU0sR0FBRyxNQUFNLDZCQUFVZSxnQkFBT0MsV0FBakIsRUFBOEJmLElBQTlCLENBQWY7QUFDRCxLQUhELENBR0UsT0FBT2dCLEdBQVAsRUFBWTtBQUNaSixNQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx5QkFBYixFQUF3Q0csR0FBeEM7QUFDQTtBQUNEOztBQUVELFNBQUt0QixRQUFMLEdBQWdCSyxNQUFoQjtBQUNBLFdBQU9BLE1BQVA7QUFDRDs7QUFFVSxNQUFQa0IsT0FBTyxHQUFHO0FBQ1osV0FBTyxLQUFLdkIsUUFBWjtBQUNELEdBL0NjLEM7OztBQWtERkYsVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJlczYtcHJvbWlzaWZ5XCI7XG5pbXBvcnQgeG1sMmpzIGZyb20gXCJ4bWwyanNcIjtcbmltcG9ydCBGaWxlTWFuYWdlciBmcm9tIFwiLi9maWxlLW1hbmFnZXJcIjtcbmltcG9ydCB7IHBhcnNlWG1sIH0gZnJvbSBcIi4vdXRpbHMveG1sXCI7XG5cbmNsYXNzIE5jeE1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaW5pdChqc29uRGF0YSkge1xuICAgIHRoaXMuX2NvbnRlbnQgPSBqc29uRGF0YTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRYbWwoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcGFyc2VYbWwoZGF0YSk7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICB0aGlzLnJhd0RhdGEgPSByZXN1bHQ7XG5cbiAgICAgIGlmICh0aGlzLnJhd0RhdGEucGFja2FnZS5hdHRyKSB7XG4gICAgICAgIHRoaXMuYWRkQXR0cmlidXRlcyh0aGlzLnJhd0RhdGEubmN4LmF0dHIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9sZGxvYWRGaWxlKG5ld1BhdGgpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIHRoaXMuX3BhdGggPSBuZXdQYXRoID8gbmV3UGF0aCA6IHRoaXMuX3BhdGg7XG5cbiAgICBjb25zdCBmaWxlTWFuYWdlciA9IG5ldyBGaWxlTWFuYWdlcigpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmaWxlTWFuYWdlci5yZWFkRmlsZSh0aGlzLl9wYXRoKTtcblxuICAgIGlmICghZGF0YSkge1xuICAgICAgY29uc29sZS53YXJuKFwiRXJyb3IgcmVhZGluZyBmaWxlXCIsIHRoaXMuX3BhdGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBjb25zdCBwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcigpO1xuICAgICAgcmVzdWx0ID0gYXdhaXQgcHJvbWlzaWZ5KHhtbDJqcy5wYXJzZVN0cmluZykoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJFcnJvciBwYXJzaW5nIG5jeCBmaWxlOlwiLCBlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRlbnQgPSByZXN1bHQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldCBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5jeE1hbmFnZXI7XG4iXX0=
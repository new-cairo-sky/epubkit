"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _xml = require("./utils/xml");





var _dataElement = _interopRequireDefault(require("./data-element"));
var _containerRootfiles = _interopRequireDefault(require("./container-rootfiles"));
var _containerRootfilesRootfile = _interopRequireDefault(require("./container-rootfiles-rootfile"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
 * Manager for the container.xml file
 * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-container.xml
 */
class ContainerManager extends _dataElement.default {
  constructor() {
    super("container", {
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container",
      version: "1.0" });


    this._rawData = undefined;

    this.rootfiles = undefined;
  }

  /**
   * Inititialize a new empty container
   * @param {string} opfLocation - path the opf file
   */
  create(opfLocation = "package.opf") {
    const defaultRootfile = new _containerRootfilesRootfile.default(
    opfLocation,
    "application/oebps-package+xml");

    this.rootfiles = new _containerRootfiles.default([defaultRootfile]);
  }

  /**
   * Load and parse the provided xml
   * @param {string | buffer} data
   * @returns {object} - the resulting parsed xml object
   */
  async loadXml(data) {
    const result = await (0, _xml.parseXml)(data);
    if (result) {
      this._rawData = result;

      if (this._rawData.container.attr) {
        this.addAttributes(this._rawData.container.attr);
      }

      // construct the rootfiles section
      const rawRootfiles = result.container.rootfiles[0].rootfile;

      const rootfileDataList = rawRootfiles.map(rootfile => {
        return rootfile.attr;
      });

      this.rootfiles = new _containerRootfiles.default(rootfileDataList);
    }

    return this._rawData;
  }

  /**
   * Get the xml string data
   * @returns {string}
   */
  async getXml() {
    const xml = await (0, _xml.generateXml)(this.getXml2JsObject());
    return xml;
  }

  /**
   * Build the xml2Js object for conversion to raw xml
   * @returns {object}
   */
  getXml2JsObject() {
    const xmlJsRootfiles = (0, _xml.prepareItemsForXml)(this.rootfiles.items);
    const rootfilesAttr = (0, _xml.filterAttributes)(this.rootfiles.attributes);
    if (rootfilesAttr) {
      xmlJsRootfiles.attr = rootfilesAttr;
    }

    const containerXmlJsData = {
      container: {
        attr: (0, _xml.filterAttributes)(this.attributes),
        rootfiles: [xmlJsRootfiles] } };



    return containerXmlJsData;
  }

  /**
   * Find the first rootfile element's full-path value.
   * @returns {string} - package file's location relative to the epub's root.
   */
  get rootFilePath() {var _this$rootfiles;
    const rootPath = (_this$rootfiles = this.rootfiles) === null || _this$rootfiles === void 0 ? void 0 : _this$rootfiles.items[0]["full-path"];
    return rootPath;
  }}var _default =


ContainerManager;exports.default = _default;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250YWluZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJDb250YWluZXJNYW5hZ2VyIiwiRGF0YUVsZW1lbnQiLCJjb25zdHJ1Y3RvciIsInhtbG5zIiwidmVyc2lvbiIsIl9yYXdEYXRhIiwidW5kZWZpbmVkIiwicm9vdGZpbGVzIiwiY3JlYXRlIiwib3BmTG9jYXRpb24iLCJkZWZhdWx0Um9vdGZpbGUiLCJDb250YWluZXJSb290ZmlsZXNSb290ZmlsZSIsIkNvbnRhaW5lclJvb3RmaWxlcyIsImxvYWRYbWwiLCJkYXRhIiwicmVzdWx0IiwiY29udGFpbmVyIiwiYXR0ciIsImFkZEF0dHJpYnV0ZXMiLCJyYXdSb290ZmlsZXMiLCJyb290ZmlsZSIsInJvb3RmaWxlRGF0YUxpc3QiLCJtYXAiLCJnZXRYbWwiLCJ4bWwiLCJnZXRYbWwySnNPYmplY3QiLCJ4bWxKc1Jvb3RmaWxlcyIsIml0ZW1zIiwicm9vdGZpbGVzQXR0ciIsImF0dHJpYnV0ZXMiLCJjb250YWluZXJYbWxKc0RhdGEiLCJyb290RmlsZVBhdGgiLCJyb290UGF0aCJdLCJtYXBwaW5ncyI6Im9HQUFBOzs7Ozs7QUFNQTtBQUNBO0FBQ0Esb0c7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxnQkFBTixTQUErQkMsb0JBQS9CLENBQTJDO0FBQ3pDQyxFQUFBQSxXQUFXLEdBQUc7QUFDWixVQUFNLFdBQU4sRUFBbUI7QUFDakJDLE1BQUFBLEtBQUssRUFBRSxpREFEVTtBQUVqQkMsTUFBQUEsT0FBTyxFQUFFLEtBRlEsRUFBbkI7OztBQUtBLFNBQUtDLFFBQUwsR0FBZ0JDLFNBQWhCOztBQUVBLFNBQUtDLFNBQUwsR0FBaUJELFNBQWpCO0FBQ0Q7O0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDRUUsRUFBQUEsTUFBTSxDQUFDQyxXQUFXLEdBQUcsYUFBZixFQUE4QjtBQUNsQyxVQUFNQyxlQUFlLEdBQUcsSUFBSUMsbUNBQUo7QUFDdEJGLElBQUFBLFdBRHNCO0FBRXRCLG1DQUZzQixDQUF4Qjs7QUFJQSxTQUFLRixTQUFMLEdBQWlCLElBQUlLLDJCQUFKLENBQXVCLENBQUNGLGVBQUQsQ0FBdkIsQ0FBakI7QUFDRDs7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBUEcsT0FBTyxDQUFDQyxJQUFELEVBQU87QUFDbEIsVUFBTUMsTUFBTSxHQUFHLE1BQU0sbUJBQVNELElBQVQsQ0FBckI7QUFDQSxRQUFJQyxNQUFKLEVBQVk7QUFDVixXQUFLVixRQUFMLEdBQWdCVSxNQUFoQjs7QUFFQSxVQUFJLEtBQUtWLFFBQUwsQ0FBY1csU0FBZCxDQUF3QkMsSUFBNUIsRUFBa0M7QUFDaEMsYUFBS0MsYUFBTCxDQUFtQixLQUFLYixRQUFMLENBQWNXLFNBQWQsQ0FBd0JDLElBQTNDO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNRSxZQUFZLEdBQUdKLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQlQsU0FBakIsQ0FBMkIsQ0FBM0IsRUFBOEJhLFFBQW5EOztBQUVBLFlBQU1DLGdCQUFnQixHQUFHRixZQUFZLENBQUNHLEdBQWIsQ0FBa0JGLFFBQUQsSUFBYztBQUN0RCxlQUFPQSxRQUFRLENBQUNILElBQWhCO0FBQ0QsT0FGd0IsQ0FBekI7O0FBSUEsV0FBS1YsU0FBTCxHQUFpQixJQUFJSywyQkFBSixDQUF1QlMsZ0JBQXZCLENBQWpCO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLaEIsUUFBWjtBQUNEOztBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ2MsUUFBTmtCLE1BQU0sR0FBRztBQUNiLFVBQU1DLEdBQUcsR0FBRyxNQUFNLHNCQUFZLEtBQUtDLGVBQUwsRUFBWixDQUFsQjtBQUNBLFdBQU9ELEdBQVA7QUFDRDs7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNFQyxFQUFBQSxlQUFlLEdBQUc7QUFDaEIsVUFBTUMsY0FBYyxHQUFHLDZCQUFtQixLQUFLbkIsU0FBTCxDQUFlb0IsS0FBbEMsQ0FBdkI7QUFDQSxVQUFNQyxhQUFhLEdBQUcsMkJBQWlCLEtBQUtyQixTQUFMLENBQWVzQixVQUFoQyxDQUF0QjtBQUNBLFFBQUlELGFBQUosRUFBbUI7QUFDakJGLE1BQUFBLGNBQWMsQ0FBQ1QsSUFBZixHQUFzQlcsYUFBdEI7QUFDRDs7QUFFRCxVQUFNRSxrQkFBa0IsR0FBRztBQUN6QmQsTUFBQUEsU0FBUyxFQUFFO0FBQ1RDLFFBQUFBLElBQUksRUFBRSwyQkFBaUIsS0FBS1ksVUFBdEIsQ0FERztBQUVUdEIsUUFBQUEsU0FBUyxFQUFFLENBQUNtQixjQUFELENBRkYsRUFEYyxFQUEzQjs7OztBQU9BLFdBQU9JLGtCQUFQO0FBQ0Q7O0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDa0IsTUFBWkMsWUFBWSxHQUFHO0FBQ2pCLFVBQU1DLFFBQVEsc0JBQUcsS0FBS3pCLFNBQVIsb0RBQUcsZ0JBQWdCb0IsS0FBaEIsQ0FBc0IsQ0FBdEIsRUFBeUIsV0FBekIsQ0FBakI7QUFDQSxXQUFPSyxRQUFQO0FBQ0QsR0F4RndDLEM7OztBQTJGNUJoQyxnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHBhcnNlWG1sLFxuICBnZW5lcmF0ZVhtbCxcbiAgZmlsdGVyQXR0cmlidXRlcyxcbiAgcHJlcGFyZUl0ZW1zRm9yWG1sLFxufSBmcm9tIFwiLi91dGlscy94bWxcIjtcbmltcG9ydCBEYXRhRWxlbWVudCBmcm9tIFwiLi9kYXRhLWVsZW1lbnRcIjtcbmltcG9ydCBDb250YWluZXJSb290ZmlsZXMgZnJvbSBcIi4vY29udGFpbmVyLXJvb3RmaWxlc1wiO1xuaW1wb3J0IENvbnRhaW5lclJvb3RmaWxlc1Jvb3RmaWxlIGZyb20gXCIuL2NvbnRhaW5lci1yb290ZmlsZXMtcm9vdGZpbGVcIjtcblxuLyoqXG4gKiBNYW5hZ2VyIGZvciB0aGUgY29udGFpbmVyLnhtbCBmaWxlXG4gKiBodHRwczovL3d3dy53My5vcmcvcHVibGlzaGluZy9lcHViMzIvZXB1Yi1vY2YuaHRtbCNzZWMtY29udGFpbmVyLW1ldGFpbmYtY29udGFpbmVyLnhtbFxuICovXG5jbGFzcyBDb250YWluZXJNYW5hZ2VyIGV4dGVuZHMgRGF0YUVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcImNvbnRhaW5lclwiLCB7XG4gICAgICB4bWxuczogXCJ1cm46b2FzaXM6bmFtZXM6dGM6b3BlbmRvY3VtZW50OnhtbG5zOmNvbnRhaW5lclwiLFxuICAgICAgdmVyc2lvbjogXCIxLjBcIixcbiAgICB9KTtcblxuICAgIHRoaXMuX3Jhd0RhdGEgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnJvb3RmaWxlcyA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aXRpYWxpemUgYSBuZXcgZW1wdHkgY29udGFpbmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcGZMb2NhdGlvbiAtIHBhdGggdGhlIG9wZiBmaWxlXG4gICAqL1xuICBjcmVhdGUob3BmTG9jYXRpb24gPSBcInBhY2thZ2Uub3BmXCIpIHtcbiAgICBjb25zdCBkZWZhdWx0Um9vdGZpbGUgPSBuZXcgQ29udGFpbmVyUm9vdGZpbGVzUm9vdGZpbGUoXG4gICAgICBvcGZMb2NhdGlvbixcbiAgICAgIFwiYXBwbGljYXRpb24vb2VicHMtcGFja2FnZSt4bWxcIlxuICAgICk7XG4gICAgdGhpcy5yb290ZmlsZXMgPSBuZXcgQ29udGFpbmVyUm9vdGZpbGVzKFtkZWZhdWx0Um9vdGZpbGVdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGFuZCBwYXJzZSB0aGUgcHJvdmlkZWQgeG1sXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgYnVmZmVyfSBkYXRhXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gdGhlIHJlc3VsdGluZyBwYXJzZWQgeG1sIG9iamVjdFxuICAgKi9cbiAgYXN5bmMgbG9hZFhtbChkYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcGFyc2VYbWwoZGF0YSk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgdGhpcy5fcmF3RGF0YSA9IHJlc3VsdDtcblxuICAgICAgaWYgKHRoaXMuX3Jhd0RhdGEuY29udGFpbmVyLmF0dHIpIHtcbiAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVzKHRoaXMuX3Jhd0RhdGEuY29udGFpbmVyLmF0dHIpO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zdHJ1Y3QgdGhlIHJvb3RmaWxlcyBzZWN0aW9uXG4gICAgICBjb25zdCByYXdSb290ZmlsZXMgPSByZXN1bHQuY29udGFpbmVyLnJvb3RmaWxlc1swXS5yb290ZmlsZTtcblxuICAgICAgY29uc3Qgcm9vdGZpbGVEYXRhTGlzdCA9IHJhd1Jvb3RmaWxlcy5tYXAoKHJvb3RmaWxlKSA9PiB7XG4gICAgICAgIHJldHVybiByb290ZmlsZS5hdHRyO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucm9vdGZpbGVzID0gbmV3IENvbnRhaW5lclJvb3RmaWxlcyhyb290ZmlsZURhdGFMaXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcmF3RGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHhtbCBzdHJpbmcgZGF0YVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgYXN5bmMgZ2V0WG1sKCkge1xuICAgIGNvbnN0IHhtbCA9IGF3YWl0IGdlbmVyYXRlWG1sKHRoaXMuZ2V0WG1sMkpzT2JqZWN0KCkpO1xuICAgIHJldHVybiB4bWw7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgdGhlIHhtbDJKcyBvYmplY3QgZm9yIGNvbnZlcnNpb24gdG8gcmF3IHhtbFxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0WG1sMkpzT2JqZWN0KCkge1xuICAgIGNvbnN0IHhtbEpzUm9vdGZpbGVzID0gcHJlcGFyZUl0ZW1zRm9yWG1sKHRoaXMucm9vdGZpbGVzLml0ZW1zKTtcbiAgICBjb25zdCByb290ZmlsZXNBdHRyID0gZmlsdGVyQXR0cmlidXRlcyh0aGlzLnJvb3RmaWxlcy5hdHRyaWJ1dGVzKTtcbiAgICBpZiAocm9vdGZpbGVzQXR0cikge1xuICAgICAgeG1sSnNSb290ZmlsZXMuYXR0ciA9IHJvb3RmaWxlc0F0dHI7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyWG1sSnNEYXRhID0ge1xuICAgICAgY29udGFpbmVyOiB7XG4gICAgICAgIGF0dHI6IGZpbHRlckF0dHJpYnV0ZXModGhpcy5hdHRyaWJ1dGVzKSxcbiAgICAgICAgcm9vdGZpbGVzOiBbeG1sSnNSb290ZmlsZXNdLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lclhtbEpzRGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBmaXJzdCByb290ZmlsZSBlbGVtZW50J3MgZnVsbC1wYXRoIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHBhY2thZ2UgZmlsZSdzIGxvY2F0aW9uIHJlbGF0aXZlIHRvIHRoZSBlcHViJ3Mgcm9vdC5cbiAgICovXG4gIGdldCByb290RmlsZVBhdGgoKSB7XG4gICAgY29uc3Qgcm9vdFBhdGggPSB0aGlzLnJvb3RmaWxlcz8uaXRlbXNbMF1bXCJmdWxsLXBhdGhcIl07XG4gICAgcmV0dXJuIHJvb3RQYXRoO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRhaW5lck1hbmFnZXI7XG4iXX0=
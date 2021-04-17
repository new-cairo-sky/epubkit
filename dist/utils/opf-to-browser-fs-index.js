"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.opfManifestToBrowserFsIndex = opfManifestToBrowserFsIndex;exports.pathToObject = pathToObject;var _path = _interopRequireDefault(require("path"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}

/**
                                                                                                                                                                                                                                                                                                                                      * BrowserFS's HTTPRequest backend requires a file index. This function takes a 
                                                                                                                                                                                                                                                                                                                                      * epub's opf manifest and converts it a nested object in the form used by browserFS, eg:
                                                                                                                                                                                                                                                                                                                                       {
                                                                                                                                                                                                                                                                                                                                         "home": {
                                                                                                                                                                                                                                                                                                                                           "jvilk": {
                                                                                                                                                                                                                                                                                                                                           "someFile.txt": null,
                                                                                                                                                                                                                                                                                                                                           "someDir": {
                                                                                                                                                                                                                                                                                                                                               // Empty directory
                                                                                                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                                                                                                           }
                                                                                                                                                                                                                                                                                                                                         }
                                                                                                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                                                                                                      * NOTE: The path structure must be relative to the fetch relative operating path. 
                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                      * @param {array} manifest - an array of items returned from OpfManager.manifestItems
                                                                                                                                                                                                                                                                                                                                      * @param {string} epubPath - path to the epub dir
                                                                                                                                                                                                                                                                                                                                      * @param {string} manifestPath - path to the opf, relative to the epub base dir
                                                                                                                                                                                                                                                                                                                                      */
function opfManifestToBrowserFsIndex(manifest, manifestEpubLocation) {
  // the opf file itself is not in the manifest - add that frist

  var fileIndex = pathToObject(_path["default"].normalize(manifestEpubLocation));
  var mimetypePath = "mimetype";
  pathToObject(mimetypePath, fileIndex);
  var containerPath = "META-INF/container.xml";
  pathToObject(containerPath, fileIndex);

  // add all the files listed in the manifest.
  // const basePath = path.dirname(path.normalize(manifestPath));

  manifest.forEach(function (item) {
    // const href = item.href;
    // const resolvedPath = path.join(basePath, href);
    pathToObject(item.location, fileIndex);
  });

  return fileIndex;
}

/**
   * Converts a path string to a nested object
   * @param {string} pathString - the path to be converted
   * @param {object} fileIndex - the BrowserFS file index object to add file path to
   */
function pathToObject(pathString) {var fileIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ref = fileIndex;
  var pathArray = _path["default"].
  normalize(_path["default"].dirname(pathString)).
  split(_path["default"].sep).
  filter(function (part) {return part !== ".";});

  var fileName = _path["default"].basename(pathString);

  pathArray.forEach(function (pathPart, i) {
    if (!!pathPart) {
      if (ref[pathPart]) {
        ref = ref[pathPart];
      } else {
        ref[pathPart] = {};
        ref = ref[pathPart];
      }
    }
  });
  ref[fileName] = null;
  return fileIndex;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9vcGYtdG8tYnJvd3Nlci1mcy1pbmRleC5qcyJdLCJuYW1lcyI6WyJvcGZNYW5pZmVzdFRvQnJvd3NlckZzSW5kZXgiLCJtYW5pZmVzdCIsIm1hbmlmZXN0RXB1YkxvY2F0aW9uIiwiZmlsZUluZGV4IiwicGF0aFRvT2JqZWN0IiwicGF0aCIsIm5vcm1hbGl6ZSIsIm1pbWV0eXBlUGF0aCIsImNvbnRhaW5lclBhdGgiLCJmb3JFYWNoIiwiaXRlbSIsImxvY2F0aW9uIiwicGF0aFN0cmluZyIsInJlZiIsInBhdGhBcnJheSIsImRpcm5hbWUiLCJzcGxpdCIsInNlcCIsImZpbHRlciIsInBhcnQiLCJmaWxlTmFtZSIsImJhc2VuYW1lIiwicGF0aFBhcnQiLCJpIl0sIm1hcHBpbmdzIjoiaUxBQUEsb0Q7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sU0FBU0EsMkJBQVQsQ0FBcUNDLFFBQXJDLEVBQStDQyxvQkFBL0MsRUFBcUU7QUFDMUU7O0FBRUEsTUFBTUMsU0FBUyxHQUFHQyxZQUFZLENBQUNDLGlCQUFLQyxTQUFMLENBQWVKLG9CQUFmLENBQUQsQ0FBOUI7QUFDQSxNQUFNSyxZQUFZLEdBQUcsVUFBckI7QUFDQUgsRUFBQUEsWUFBWSxDQUFDRyxZQUFELEVBQWVKLFNBQWYsQ0FBWjtBQUNBLE1BQU1LLGFBQWEsR0FBRyx3QkFBdEI7QUFDQUosRUFBQUEsWUFBWSxDQUFDSSxhQUFELEVBQWdCTCxTQUFoQixDQUFaOztBQUVBO0FBQ0E7O0FBRUFGLEVBQUFBLFFBQVEsQ0FBQ1EsT0FBVCxDQUFpQixVQUFDQyxJQUFELEVBQVU7QUFDekI7QUFDQTtBQUNBTixJQUFBQSxZQUFZLENBQUNNLElBQUksQ0FBQ0MsUUFBTixFQUFnQlIsU0FBaEIsQ0FBWjtBQUNELEdBSkQ7O0FBTUEsU0FBT0EsU0FBUDtBQUNEOztBQUVEOzs7OztBQUtPLFNBQVNDLFlBQVQsQ0FBc0JRLFVBQXRCLEVBQWtELEtBQWhCVCxTQUFnQix1RUFBSixFQUFJO0FBQ3ZELE1BQUlVLEdBQUcsR0FBR1YsU0FBVjtBQUNBLE1BQU1XLFNBQVMsR0FBR1Q7QUFDZkMsRUFBQUEsU0FEZSxDQUNMRCxpQkFBS1UsT0FBTCxDQUFhSCxVQUFiLENBREs7QUFFZkksRUFBQUEsS0FGZSxDQUVUWCxpQkFBS1ksR0FGSTtBQUdmQyxFQUFBQSxNQUhlLENBR1IsVUFBQ0MsSUFBRCxVQUFVQSxJQUFJLEtBQUssR0FBbkIsRUFIUSxDQUFsQjs7QUFLQSxNQUFNQyxRQUFRLEdBQUdmLGlCQUFLZ0IsUUFBTCxDQUFjVCxVQUFkLENBQWpCOztBQUVBRSxFQUFBQSxTQUFTLENBQUNMLE9BQVYsQ0FBa0IsVUFBQ2EsUUFBRCxFQUFXQyxDQUFYLEVBQWlCO0FBQ2pDLFFBQUksQ0FBQyxDQUFDRCxRQUFOLEVBQWdCO0FBQ2QsVUFBSVQsR0FBRyxDQUFDUyxRQUFELENBQVAsRUFBbUI7QUFDakJULFFBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDUyxRQUFELENBQVQ7QUFDRCxPQUZELE1BRU87QUFDTFQsUUFBQUEsR0FBRyxDQUFDUyxRQUFELENBQUgsR0FBZ0IsRUFBaEI7QUFDQVQsUUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNTLFFBQUQsQ0FBVDtBQUNEO0FBQ0Y7QUFDRixHQVREO0FBVUFULEVBQUFBLEdBQUcsQ0FBQ08sUUFBRCxDQUFILEdBQWdCLElBQWhCO0FBQ0EsU0FBT2pCLFNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8qKlxuICogQnJvd3NlckZTJ3MgSFRUUFJlcXVlc3QgYmFja2VuZCByZXF1aXJlcyBhIGZpbGUgaW5kZXguIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBcbiAqIGVwdWIncyBvcGYgbWFuaWZlc3QgYW5kIGNvbnZlcnRzIGl0IGEgbmVzdGVkIG9iamVjdCBpbiB0aGUgZm9ybSB1c2VkIGJ5IGJyb3dzZXJGUywgZWc6XG4gIHtcbiAgICBcImhvbWVcIjoge1xuICAgICAgXCJqdmlsa1wiOiB7XG4gICAgICBcInNvbWVGaWxlLnR4dFwiOiBudWxsLFxuICAgICAgXCJzb21lRGlyXCI6IHtcbiAgICAgICAgICAvLyBFbXB0eSBkaXJlY3RvcnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICogTk9URTogVGhlIHBhdGggc3RydWN0dXJlIG11c3QgYmUgcmVsYXRpdmUgdG8gdGhlIGZldGNoIHJlbGF0aXZlIG9wZXJhdGluZyBwYXRoLiBcblxuICogQHBhcmFtIHthcnJheX0gbWFuaWZlc3QgLSBhbiBhcnJheSBvZiBpdGVtcyByZXR1cm5lZCBmcm9tIE9wZk1hbmFnZXIubWFuaWZlc3RJdGVtc1xuICogQHBhcmFtIHtzdHJpbmd9IGVwdWJQYXRoIC0gcGF0aCB0byB0aGUgZXB1YiBkaXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBtYW5pZmVzdFBhdGggLSBwYXRoIHRvIHRoZSBvcGYsIHJlbGF0aXZlIHRvIHRoZSBlcHViIGJhc2UgZGlyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcGZNYW5pZmVzdFRvQnJvd3NlckZzSW5kZXgobWFuaWZlc3QsIG1hbmlmZXN0RXB1YkxvY2F0aW9uKSB7XG4gIC8vIHRoZSBvcGYgZmlsZSBpdHNlbGYgaXMgbm90IGluIHRoZSBtYW5pZmVzdCAtIGFkZCB0aGF0IGZyaXN0XG5cbiAgY29uc3QgZmlsZUluZGV4ID0gcGF0aFRvT2JqZWN0KHBhdGgubm9ybWFsaXplKG1hbmlmZXN0RXB1YkxvY2F0aW9uKSk7XG4gIGNvbnN0IG1pbWV0eXBlUGF0aCA9IFwibWltZXR5cGVcIjtcbiAgcGF0aFRvT2JqZWN0KG1pbWV0eXBlUGF0aCwgZmlsZUluZGV4KTtcbiAgY29uc3QgY29udGFpbmVyUGF0aCA9IFwiTUVUQS1JTkYvY29udGFpbmVyLnhtbFwiO1xuICBwYXRoVG9PYmplY3QoY29udGFpbmVyUGF0aCwgZmlsZUluZGV4KTtcblxuICAvLyBhZGQgYWxsIHRoZSBmaWxlcyBsaXN0ZWQgaW4gdGhlIG1hbmlmZXN0LlxuICAvLyBjb25zdCBiYXNlUGF0aCA9IHBhdGguZGlybmFtZShwYXRoLm5vcm1hbGl6ZShtYW5pZmVzdFBhdGgpKTtcblxuICBtYW5pZmVzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgLy8gY29uc3QgaHJlZiA9IGl0ZW0uaHJlZjtcbiAgICAvLyBjb25zdCByZXNvbHZlZFBhdGggPSBwYXRoLmpvaW4oYmFzZVBhdGgsIGhyZWYpO1xuICAgIHBhdGhUb09iamVjdChpdGVtLmxvY2F0aW9uLCBmaWxlSW5kZXgpO1xuICB9KTtcblxuICByZXR1cm4gZmlsZUluZGV4O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgcGF0aCBzdHJpbmcgdG8gYSBuZXN0ZWQgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFN0cmluZyAtIHRoZSBwYXRoIHRvIGJlIGNvbnZlcnRlZFxuICogQHBhcmFtIHtvYmplY3R9IGZpbGVJbmRleCAtIHRoZSBCcm93c2VyRlMgZmlsZSBpbmRleCBvYmplY3QgdG8gYWRkIGZpbGUgcGF0aCB0b1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0aFRvT2JqZWN0KHBhdGhTdHJpbmcsIGZpbGVJbmRleCA9IHt9KSB7XG4gIGxldCByZWYgPSBmaWxlSW5kZXg7XG4gIGNvbnN0IHBhdGhBcnJheSA9IHBhdGhcbiAgICAubm9ybWFsaXplKHBhdGguZGlybmFtZShwYXRoU3RyaW5nKSlcbiAgICAuc3BsaXQocGF0aC5zZXApXG4gICAgLmZpbHRlcigocGFydCkgPT4gcGFydCAhPT0gXCIuXCIpO1xuXG4gIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZShwYXRoU3RyaW5nKTtcblxuICBwYXRoQXJyYXkuZm9yRWFjaCgocGF0aFBhcnQsIGkpID0+IHtcbiAgICBpZiAoISFwYXRoUGFydCkge1xuICAgICAgaWYgKHJlZltwYXRoUGFydF0pIHtcbiAgICAgICAgcmVmID0gcmVmW3BhdGhQYXJ0XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZltwYXRoUGFydF0gPSB7fTtcbiAgICAgICAgcmVmID0gcmVmW3BhdGhQYXJ0XTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZWZbZmlsZU5hbWVdID0gbnVsbDtcbiAgcmV0dXJuIGZpbGVJbmRleDtcbn1cbiJdfQ==
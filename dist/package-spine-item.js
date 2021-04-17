"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _packageElement = _interopRequireDefault(require("./package-element"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
 * https://www.w3.org/publishing/epub32/epub-packages.html#sec-itemref-elem
 */
class PackageSpineItem extends _packageElement.default {
  constructor(idref, options = {}) {
    const attr = Object.assign(
    {
      id: undefined,
      idref: idref,
      linear: undefined,
      properties: undefined },

    options);

    super("itemref", undefined, attr);
  }}exports.default = PackageSpineItem;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLXNwaW5lLWl0ZW0uanMiXSwibmFtZXMiOlsiUGFja2FnZVNwaW5lSXRlbSIsIlBhY2thZ2VFbGVtZW50IiwiY29uc3RydWN0b3IiLCJpZHJlZiIsIm9wdGlvbnMiLCJhdHRyIiwiT2JqZWN0IiwiYXNzaWduIiwiaWQiLCJ1bmRlZmluZWQiLCJsaW5lYXIiLCJwcm9wZXJ0aWVzIl0sIm1hcHBpbmdzIjoib0dBQUEsMkU7O0FBRUE7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsZ0JBQU4sU0FBK0JDLHVCQUEvQixDQUE4QztBQUMzREMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVFDLE9BQU8sR0FBRyxFQUFsQixFQUFzQjtBQUMvQixVQUFNQyxJQUFJLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUDtBQUNYO0FBQ0VDLE1BQUFBLEVBQUUsRUFBRUMsU0FETjtBQUVFTixNQUFBQSxLQUFLLEVBQUVBLEtBRlQ7QUFHRU8sTUFBQUEsTUFBTSxFQUFFRCxTQUhWO0FBSUVFLE1BQUFBLFVBQVUsRUFBRUYsU0FKZCxFQURXOztBQU9YTCxJQUFBQSxPQVBXLENBQWI7O0FBU0EsVUFBTSxTQUFOLEVBQWlCSyxTQUFqQixFQUE0QkosSUFBNUI7QUFDRCxHQVowRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhY2thZ2VFbGVtZW50IGZyb20gXCIuL3BhY2thZ2UtZWxlbWVudFwiO1xuXG4vKipcbiAqIGh0dHBzOi8vd3d3LnczLm9yZy9wdWJsaXNoaW5nL2VwdWIzMi9lcHViLXBhY2thZ2VzLmh0bWwjc2VjLWl0ZW1yZWYtZWxlbVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlU3BpbmVJdGVtIGV4dGVuZHMgUGFja2FnZUVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihpZHJlZiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXR0ciA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgICAgIGlkcmVmOiBpZHJlZixcbiAgICAgICAgbGluZWFyOiB1bmRlZmluZWQsXG4gICAgICAgIHByb3BlcnRpZXM6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBzdXBlcihcIml0ZW1yZWZcIiwgdW5kZWZpbmVkLCBhdHRyKTtcbiAgfVxufVxuIl19
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageManifestItem = _interopRequireDefault(require("./package-manifest-item"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _objectWithoutProperties(source, excluded) {if (source == null) return {};var target = _objectWithoutPropertiesLoose(source, excluded);var key, i;if (Object.getOwnPropertySymbols) {var sourceSymbolKeys = Object.getOwnPropertySymbols(source);for (i = 0; i < sourceSymbolKeys.length; i++) {key = sourceSymbolKeys[i];if (excluded.indexOf(key) >= 0) continue;if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;target[key] = source[key];}}return target;}function _objectWithoutPropertiesLoose(source, excluded) {if (source == null) return {};var target = {};var sourceKeys = Object.keys(source);var key, i;for (i = 0; i < sourceKeys.length; i++) {key = sourceKeys[i];if (excluded.indexOf(key) >= 0) continue;target[key] = source[key];}return target;}

class PackageManifest extends _packageElement.default {
  constructor(items = [], id = undefined, location) {
    const attr = {};
    if (id) {
      attr.id = id;
    }
    super("manifest", undefined, attr);

    this._location = location;
    this.items = [];

    items.forEach(itemData => {
      const { id, href, "media-type": mediaType } = itemData,options = _objectWithoutProperties(itemData, ["id", "href", "media-type"]);
      this.addItem(id, href, mediaType, options);
    });
  }

  set location(locationInEpub) {
    this._location = locationInEpub;
    this.items.forEach(item => {
      item.opfLocation = locationInEpub;
    });
  }

  get location() {
    return this._location;
  }

  addItem(id, href, mediaType, options = {}, index = undefined) {
    const pos = index !== undefined ? index : this.items.length;
    this.items.splice(
    pos,
    0,
    new _packageManifestItem.default(id, href, mediaType, options, this._location));

  }

  addItemAfterId(posId, id, href, mediaType, options = {}) {
    const searchPos = this.items.findIndex(item => {
      return item.id === posId;
    });
    if (searchPos !== -1) {
      this.addItem(id, href, mediaType, options, searchPos + 1);
    } else {
      this.addItem(id, href, mediaType, options);
    }
  }

  addItemBeforeId(posId, id, href, mediaType, options = {}) {
    const searchPos = this.items.findIndex(item => {
      return item.id === posId;
    });
    if (searchPos !== -1) {
      this.addItem(id, href, mediaType, options, searchPos);
    } else {
      this.addItem(id, href, mediaType, options, 0);
    }
  }

  findItemWithId(id) {
    return this.items.find(item => {
      return item.id === id;
    });
  }

  removeItemWithId(id) {
    this.items = this.items.filter(item => {
      item.id !== id;
    });
  }

  findNav() {
    return this.items.find(item => {
      return (item === null || item === void 0 ? void 0 : item.properties) === "nav";
    });
  }

  setNav(id) {
    const oldNav = this.findNav();
    if (oldNav) {
      oldNav.removeAttribute("properties", "nav");
    }
    const newNav = this.findItemWithId(id);
    newNav.addAttributes({ properties: "nav" });
  }

  findItemWithHref(href) {
    return this.items.find(item => {
      return item.href === href;
    });
  }

  removeItemWithHref(href) {
    this.items = this.items.filter(item => {
      return item.href !== href;
    });
  }

  findItemsWithMediaType(mediaType) {
    return this.items.filter(item => {
      return item["media-type"] === mediaType;
    });
  }

  removeItemsWithMediaType(mediaType) {
    this.items = this.items.filter(item => {
      return item["media-type"] !== mediaType;
    });
  }

  /**
   * Finds items that have all of the attributes listed in the provided object.
   * If the onject attribute's value is undefined, then only the attribute name
   * is matched.
   * @param {object} attributes
   */
  findItemsWithAttributes(attributes) {
    return this.items.filter(item => {
      return Object.keys(attributes).every(key => {
        if (item.hasOwnProperty(key)) {
          if (attributes[key] !== undefined) {
            return item[key] === attributes[key];
          } else {
            return true;
          }
        }
        return false;
      });
    });
  }}exports.default = PackageManifest;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLW1hbmlmZXN0LmpzIl0sIm5hbWVzIjpbIlBhY2thZ2VNYW5pZmVzdCIsIlBhY2thZ2VFbGVtZW50IiwiY29uc3RydWN0b3IiLCJpdGVtcyIsImlkIiwidW5kZWZpbmVkIiwibG9jYXRpb24iLCJhdHRyIiwiX2xvY2F0aW9uIiwiZm9yRWFjaCIsIml0ZW1EYXRhIiwiaHJlZiIsIm1lZGlhVHlwZSIsIm9wdGlvbnMiLCJhZGRJdGVtIiwibG9jYXRpb25JbkVwdWIiLCJpdGVtIiwib3BmTG9jYXRpb24iLCJpbmRleCIsInBvcyIsImxlbmd0aCIsInNwbGljZSIsIlBhY2thZ2VNYW5pZmVzdEl0ZW0iLCJhZGRJdGVtQWZ0ZXJJZCIsInBvc0lkIiwic2VhcmNoUG9zIiwiZmluZEluZGV4IiwiYWRkSXRlbUJlZm9yZUlkIiwiZmluZEl0ZW1XaXRoSWQiLCJmaW5kIiwicmVtb3ZlSXRlbVdpdGhJZCIsImZpbHRlciIsImZpbmROYXYiLCJwcm9wZXJ0aWVzIiwic2V0TmF2Iiwib2xkTmF2IiwicmVtb3ZlQXR0cmlidXRlIiwibmV3TmF2IiwiYWRkQXR0cmlidXRlcyIsImZpbmRJdGVtV2l0aEhyZWYiLCJyZW1vdmVJdGVtV2l0aEhyZWYiLCJmaW5kSXRlbXNXaXRoTWVkaWFUeXBlIiwicmVtb3ZlSXRlbXNXaXRoTWVkaWFUeXBlIiwiZmluZEl0ZW1zV2l0aEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsImV2ZXJ5Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiXSwibWFwcGluZ3MiOiJvR0FBQTtBQUNBLHNGOztBQUVlLE1BQU1BLGVBQU4sU0FBOEJDLHVCQUE5QixDQUE2QztBQUMxREMsRUFBQUEsV0FBVyxDQUFDQyxLQUFLLEdBQUcsRUFBVCxFQUFhQyxFQUFFLEdBQUdDLFNBQWxCLEVBQTZCQyxRQUE3QixFQUF1QztBQUNoRCxVQUFNQyxJQUFJLEdBQUcsRUFBYjtBQUNBLFFBQUlILEVBQUosRUFBUTtBQUNORyxN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QWpJeUQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWNrYWdlRWxlbWVudCBmcm9tIFwiLi9wYWNrYWdlLWVsZW1lbnRcIjtcbmltcG9ydCBQYWNrYWdlTWFuaWZlc3RJdGVtIGZyb20gXCIuL3BhY2thZ2UtbWFuaWZlc3QtaXRlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlTWFuaWZlc3QgZXh0ZW5kcyBQYWNrYWdlRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKGl0ZW1zID0gW10sIGlkID0gdW5kZWZpbmVkLCBsb2NhdGlvbikge1xuICAgIGNvbnN0IGF0dHIgPSB7fTtcbiAgICBpZiAoaWQpIHtcbiAgICAgIGF0dHIuaWQgPSBpZDtcbiAgICB9XG4gICAgc3VwZXIoXCJtYW5pZmVzdFwiLCB1bmRlZmluZWQsIGF0dHIpO1xuXG4gICAgdGhpcy5fbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB0aGlzLml0ZW1zID0gW107XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtRGF0YSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgaHJlZiwgXCJtZWRpYS10eXBlXCI6IG1lZGlhVHlwZSwgLi4ub3B0aW9ucyB9ID0gaXRlbURhdGE7XG4gICAgICB0aGlzLmFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYXRpb24obG9jYXRpb25JbkVwdWIpIHtcbiAgICB0aGlzLl9sb2NhdGlvbiA9IGxvY2F0aW9uSW5FcHViO1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5vcGZMb2NhdGlvbiA9IGxvY2F0aW9uSW5FcHViO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhdGlvbjtcbiAgfVxuXG4gIGFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyA9IHt9LCBpbmRleCA9IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IHBvcyA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIHRoaXMuaXRlbXMuc3BsaWNlKFxuICAgICAgcG9zLFxuICAgICAgMCxcbiAgICAgIG5ldyBQYWNrYWdlTWFuaWZlc3RJdGVtKGlkLCBocmVmLCBtZWRpYVR5cGUsIG9wdGlvbnMsIHRoaXMuX2xvY2F0aW9uKVxuICAgICk7XG4gIH1cblxuICBhZGRJdGVtQWZ0ZXJJZChwb3NJZCwgaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc2VhcmNoUG9zID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmlkID09PSBwb3NJZDtcbiAgICB9KTtcbiAgICBpZiAoc2VhcmNoUG9zICE9PSAtMSkge1xuICAgICAgdGhpcy5hZGRJdGVtKGlkLCBocmVmLCBtZWRpYVR5cGUsIG9wdGlvbnMsIHNlYXJjaFBvcyArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgYWRkSXRlbUJlZm9yZUlkKHBvc0lkLCBpZCwgaHJlZiwgbWVkaWFUeXBlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzZWFyY2hQb3MgPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IHBvc0lkO1xuICAgIH0pO1xuICAgIGlmIChzZWFyY2hQb3MgIT09IC0xKSB7XG4gICAgICB0aGlzLmFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucywgc2VhcmNoUG9zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRJdGVtKGlkLCBocmVmLCBtZWRpYVR5cGUsIG9wdGlvbnMsIDApO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJdGVtV2l0aElkKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlSXRlbVdpdGhJZChpZCkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5pZCAhPT0gaWQ7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kTmF2KCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtPy5wcm9wZXJ0aWVzID09PSBcIm5hdlwiO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0TmF2KGlkKSB7XG4gICAgY29uc3Qgb2xkTmF2ID0gdGhpcy5maW5kTmF2KCk7XG4gICAgaWYgKG9sZE5hdikge1xuICAgICAgb2xkTmF2LnJlbW92ZUF0dHJpYnV0ZShcInByb3BlcnRpZXNcIiwgXCJuYXZcIik7XG4gICAgfVxuICAgIGNvbnN0IG5ld05hdiA9IHRoaXMuZmluZEl0ZW1XaXRoSWQoaWQpO1xuICAgIG5ld05hdi5hZGRBdHRyaWJ1dGVzKHsgcHJvcGVydGllczogXCJuYXZcIiB9KTtcbiAgfVxuXG4gIGZpbmRJdGVtV2l0aEhyZWYoaHJlZikge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmhyZWYgPT09IGhyZWY7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVJdGVtV2l0aEhyZWYoaHJlZikge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaHJlZiAhPT0gaHJlZjtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRJdGVtc1dpdGhNZWRpYVR5cGUobWVkaWFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbVtcIm1lZGlhLXR5cGVcIl0gPT09IG1lZGlhVHlwZTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZUl0ZW1zV2l0aE1lZGlhVHlwZShtZWRpYVR5cGUpIHtcbiAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtW1wibWVkaWEtdHlwZVwiXSAhPT0gbWVkaWFUeXBlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGl0ZW1zIHRoYXQgaGF2ZSBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgbGlzdGVkIGluIHRoZSBwcm92aWRlZCBvYmplY3QuXG4gICAqIElmIHRoZSBvbmplY3QgYXR0cmlidXRlJ3MgdmFsdWUgaXMgdW5kZWZpbmVkLCB0aGVuIG9ubHkgdGhlIGF0dHJpYnV0ZSBuYW1lXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAqL1xuICBmaW5kSXRlbXNXaXRoQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZXZlcnkoKGtleSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtrZXldID09PSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19
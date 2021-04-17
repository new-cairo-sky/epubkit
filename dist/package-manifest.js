"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageManifestItem = _interopRequireDefault(require("./package-manifest-item"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _objectWithoutProperties(source, excluded) {if (source == null) return {};var target = _objectWithoutPropertiesLoose(source, excluded);var key, i;if (Object.getOwnPropertySymbols) {var sourceSymbolKeys = Object.getOwnPropertySymbols(source);for (i = 0; i < sourceSymbolKeys.length; i++) {key = sourceSymbolKeys[i];if (excluded.indexOf(key) >= 0) continue;if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;target[key] = source[key];}}return target;}function _objectWithoutPropertiesLoose(source, excluded) {if (source == null) return {};var target = {};var sourceKeys = Object.keys(source);var key, i;for (i = 0; i < sourceKeys.length; i++) {key = sourceKeys[i];if (excluded.indexOf(key) >= 0) continue;target[key] = source[key];}return target;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}var

PackageManifest = /*#__PURE__*/function (_PackageElement) {_inherits(PackageManifest, _PackageElement);var _super = _createSuper(PackageManifest);
  function PackageManifest() {var _this;var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;var location = arguments.length > 2 ? arguments[2] : undefined;_classCallCheck(this, PackageManifest);
    var attr = {};
    if (id) {
      attr.id = id;
    }
    _this = _super.call(this, "manifest", undefined, attr);

    _this._location = location;
    _this.items = [];

    items.forEach(function (itemData) {var
      id = itemData.id,href = itemData.href,mediaType = itemData["media-type"],options = _objectWithoutProperties(itemData, ["id", "href", "media-type"]);
      _this.addItem(id, href, mediaType, options);
    });return _this;
  }_createClass(PackageManifest, [{ key: "addItem", value: function addItem(












    id, href, mediaType) {var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
      var pos = index !== undefined ? index : this.items.length;
      this.items.splice(
      pos,
      0,
      new _packageManifestItem["default"](id, href, mediaType, options, this._location));

    } }, { key: "addItemAfterId", value: function addItemAfterId(

    posId, id, href, mediaType) {var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var searchPos = this.items.findIndex(function (item) {
        return item.id === posId;
      });
      if (searchPos !== -1) {
        this.addItem(id, href, mediaType, options, searchPos + 1);
      } else {
        this.addItem(id, href, mediaType, options);
      }
    } }, { key: "addItemBeforeId", value: function addItemBeforeId(

    posId, id, href, mediaType) {var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var searchPos = this.items.findIndex(function (item) {
        return item.id === posId;
      });
      if (searchPos !== -1) {
        this.addItem(id, href, mediaType, options, searchPos);
      } else {
        this.addItem(id, href, mediaType, options, 0);
      }
    } }, { key: "findItemWithId", value: function findItemWithId(

    id) {
      return this.items.find(function (item) {
        return item.id === id;
      });
    } }, { key: "removeItemWithId", value: function removeItemWithId(

    id) {
      this.items = this.items.filter(function (item) {
        item.id !== id;
      });
    } }, { key: "findNav", value: function findNav()

    {
      return this.items.find(function (item) {
        return (item === null || item === void 0 ? void 0 : item.properties) === "nav";
      });
    } }, { key: "setNav", value: function setNav(

    id) {
      var oldNav = this.findNav();
      if (oldNav) {
        oldNav.removeAttribute("properties", "nav");
      }
      var newNav = this.findItemWithId(id);
      newNav.addAttributes({ properties: "nav" });
    } }, { key: "findItemWithHref", value: function findItemWithHref(

    href) {
      return this.items.find(function (item) {
        return item.href === href;
      });
    } }, { key: "removeItemWithHref", value: function removeItemWithHref(

    href) {
      this.items = this.items.filter(function (item) {
        return item.href !== href;
      });
    } }, { key: "findItemsWithMediaType", value: function findItemsWithMediaType(

    mediaType) {
      return this.items.filter(function (item) {
        return item["media-type"] === mediaType;
      });
    } }, { key: "removeItemsWithMediaType", value: function removeItemsWithMediaType(

    mediaType) {
      this.items = this.items.filter(function (item) {
        return item["media-type"] !== mediaType;
      });
    }

    /**
       * Finds items that have all of the attributes listed in the provided object.
       * If the onject attribute's value is undefined, then only the attribute name
       * is matched.
       * @param {object} attributes
       */ }, { key: "findItemsWithAttributes", value: function findItemsWithAttributes(
    attributes) {
      return this.items.filter(function (item) {
        return Object.keys(attributes).every(function (key) {
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
    } }, { key: "location", set: function set(locationInEpub) {this._location = locationInEpub;this.items.forEach(function (item) {item.opfLocation = locationInEpub;});}, get: function get() {return this._location;} }]);return PackageManifest;}(_packageElement["default"]);exports["default"] = PackageManifest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLW1hbmlmZXN0LmpzIl0sIm5hbWVzIjpbIlBhY2thZ2VNYW5pZmVzdCIsIml0ZW1zIiwiaWQiLCJ1bmRlZmluZWQiLCJsb2NhdGlvbiIsImF0dHIiLCJfbG9jYXRpb24iLCJmb3JFYWNoIiwiaXRlbURhdGEiLCJocmVmIiwibWVkaWFUeXBlIiwib3B0aW9ucyIsImFkZEl0ZW0iLCJpbmRleCIsInBvcyIsImxlbmd0aCIsInNwbGljZSIsIlBhY2thZ2VNYW5pZmVzdEl0ZW0iLCJwb3NJZCIsInNlYXJjaFBvcyIsImZpbmRJbmRleCIsIml0ZW0iLCJmaW5kIiwiZmlsdGVyIiwicHJvcGVydGllcyIsIm9sZE5hdiIsImZpbmROYXYiLCJyZW1vdmVBdHRyaWJ1dGUiLCJuZXdOYXYiLCJmaW5kSXRlbVdpdGhJZCIsImFkZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsImV2ZXJ5Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJsb2NhdGlvbkluRXB1YiIsIm9wZkxvY2F0aW9uIiwiUGFja2FnZUVsZW1lbnQiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBLHNGOztBQUVxQkEsZTtBQUNuQiw2QkFBa0QsZUFBdENDLEtBQXNDLHVFQUE5QixFQUE4QixLQUExQkMsRUFBMEIsdUVBQXJCQyxTQUFxQixLQUFWQyxRQUFVO0FBQ2hELFFBQU1DLElBQUksR0FBRyxFQUFiO0FBQ0EsUUFBSUgsRUFBSixFQUFRO0FBQ05HLE1BQUFBLElBQUksQ0FBQ0gsRUFBTCxHQUFVQSxFQUFWO0FBQ0Q7QUFDRCw4QkFBTSxVQUFOLEVBQWtCQyxTQUFsQixFQUE2QkUsSUFBN0I7O0FBRUEsVUFBS0MsU0FBTCxHQUFpQkYsUUFBakI7QUFDQSxVQUFLSCxLQUFMLEdBQWEsRUFBYjs7QUFFQUEsSUFBQUEsS0FBSyxDQUFDTSxPQUFOLENBQWMsVUFBQ0MsUUFBRCxFQUFjO0FBQ2xCTixNQUFBQSxFQURrQixHQUNnQ00sUUFEaEMsQ0FDbEJOLEVB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QixLQUFMLENBQVdzQixNQUFYLENBQWtCLFVBQUNGLElBQUQsRUFBVTtBQUNqQyxlQUFPVyxNQUFNLENBQUNDLElBQVAsQ0FBWUYsVUFBWixFQUF3QkcsS0FBeEIsQ0FBOEIsVUFBQ0MsR0FBRCxFQUFTO0FBQzVDLGNBQUlkLElBQUksQ0FBQ2UsY0FBTCxDQUFvQkQsR0FBcEIsQ0FBSixFQUE4QjtBQUM1QixnQkFBSUosVUFBVSxDQUFDSSxHQUFELENBQVYsS0FBb0JoQyxTQUF4QixFQUFtQztBQUNqQyxxQkFBT2tCLElBQUksQ0FBQ2MsR0FBRCxDQUFKLEtBQWNKLFVBQVUsQ0FBQ0ksR0FBRCxDQUEvQjtBQUNELGFBRkQsTUFFTztBQUNMLHFCQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsaUJBQU8sS0FBUDtBQUNELFNBVE0sQ0FBUDtBQVVELE9BWE0sQ0FBUDtBQVlELEsseUNBaEhZRSxjLEVBQWdCLENBQzNCLEtBQUsvQixTQUFMLEdBQWlCK0IsY0FBakIsQ0FDQSxLQUFLcEMsS0FBTCxDQUFXTSxPQUFYLENBQW1CLFVBQUNjLElBQUQsRUFBVSxDQUMzQkEsSUFBSSxDQUFDaUIsV0FBTCxHQUFtQkQsY0FBbkIsQ0FDRCxDQUZELEVBR0QsQyxzQkFFYyxDQUNiLE9BQU8sS0FBSy9CLFNBQVosQ0FDRCxDLDhCQTFCMENpQywwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWNrYWdlRWxlbWVudCBmcm9tIFwiLi9wYWNrYWdlLWVsZW1lbnRcIjtcbmltcG9ydCBQYWNrYWdlTWFuaWZlc3RJdGVtIGZyb20gXCIuL3BhY2thZ2UtbWFuaWZlc3QtaXRlbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlTWFuaWZlc3QgZXh0ZW5kcyBQYWNrYWdlRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKGl0ZW1zID0gW10sIGlkID0gdW5kZWZpbmVkLCBsb2NhdGlvbikge1xuICAgIGNvbnN0IGF0dHIgPSB7fTtcbiAgICBpZiAoaWQpIHtcbiAgICAgIGF0dHIuaWQgPSBpZDtcbiAgICB9XG4gICAgc3VwZXIoXCJtYW5pZmVzdFwiLCB1bmRlZmluZWQsIGF0dHIpO1xuXG4gICAgdGhpcy5fbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB0aGlzLml0ZW1zID0gW107XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtRGF0YSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgaHJlZiwgXCJtZWRpYS10eXBlXCI6IG1lZGlhVHlwZSwgLi4ub3B0aW9ucyB9ID0gaXRlbURhdGE7XG4gICAgICB0aGlzLmFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYXRpb24obG9jYXRpb25JbkVwdWIpIHtcbiAgICB0aGlzLl9sb2NhdGlvbiA9IGxvY2F0aW9uSW5FcHViO1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5vcGZMb2NhdGlvbiA9IGxvY2F0aW9uSW5FcHViO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhdGlvbjtcbiAgfVxuXG4gIGFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyA9IHt9LCBpbmRleCA9IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IHBvcyA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIHRoaXMuaXRlbXMuc3BsaWNlKFxuICAgICAgcG9zLFxuICAgICAgMCxcbiAgICAgIG5ldyBQYWNrYWdlTWFuaWZlc3RJdGVtKGlkLCBocmVmLCBtZWRpYVR5cGUsIG9wdGlvbnMsIHRoaXMuX2xvY2F0aW9uKVxuICAgICk7XG4gIH1cblxuICBhZGRJdGVtQWZ0ZXJJZChwb3NJZCwgaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc2VhcmNoUG9zID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmlkID09PSBwb3NJZDtcbiAgICB9KTtcbiAgICBpZiAoc2VhcmNoUG9zICE9PSAtMSkge1xuICAgICAgdGhpcy5hZGRJdGVtKGlkLCBocmVmLCBtZWRpYVR5cGUsIG9wdGlvbnMsIHNlYXJjaFBvcyArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgYWRkSXRlbUJlZm9yZUlkKHBvc0lkLCBpZCwgaHJlZiwgbWVkaWFUeXBlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzZWFyY2hQb3MgPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IHBvc0lkO1xuICAgIH0pO1xuICAgIGlmIChzZWFyY2hQb3MgIT09IC0xKSB7XG4gICAgICB0aGlzLmFkZEl0ZW0oaWQsIGhyZWYsIG1lZGlhVHlwZSwgb3B0aW9ucywgc2VhcmNoUG9zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRJdGVtKGlkLCBocmVmLCBtZWRpYVR5cGUsIG9wdGlvbnMsIDApO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJdGVtV2l0aElkKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlSXRlbVdpdGhJZChpZCkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5pZCAhPT0gaWQ7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kTmF2KCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtPy5wcm9wZXJ0aWVzID09PSBcIm5hdlwiO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0TmF2KGlkKSB7XG4gICAgY29uc3Qgb2xkTmF2ID0gdGhpcy5maW5kTmF2KCk7XG4gICAgaWYgKG9sZE5hdikge1xuICAgICAgb2xkTmF2LnJlbW92ZUF0dHJpYnV0ZShcInByb3BlcnRpZXNcIiwgXCJuYXZcIik7XG4gICAgfVxuICAgIGNvbnN0IG5ld05hdiA9IHRoaXMuZmluZEl0ZW1XaXRoSWQoaWQpO1xuICAgIG5ld05hdi5hZGRBdHRyaWJ1dGVzKHsgcHJvcGVydGllczogXCJuYXZcIiB9KTtcbiAgfVxuXG4gIGZpbmRJdGVtV2l0aEhyZWYoaHJlZikge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmhyZWYgPT09IGhyZWY7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVJdGVtV2l0aEhyZWYoaHJlZikge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaHJlZiAhPT0gaHJlZjtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRJdGVtc1dpdGhNZWRpYVR5cGUobWVkaWFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbVtcIm1lZGlhLXR5cGVcIl0gPT09IG1lZGlhVHlwZTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZUl0ZW1zV2l0aE1lZGlhVHlwZShtZWRpYVR5cGUpIHtcbiAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtW1wibWVkaWEtdHlwZVwiXSAhPT0gbWVkaWFUeXBlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGl0ZW1zIHRoYXQgaGF2ZSBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgbGlzdGVkIGluIHRoZSBwcm92aWRlZCBvYmplY3QuXG4gICAqIElmIHRoZSBvbmplY3QgYXR0cmlidXRlJ3MgdmFsdWUgaXMgdW5kZWZpbmVkLCB0aGVuIG9ubHkgdGhlIGF0dHJpYnV0ZSBuYW1lXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAqL1xuICBmaW5kSXRlbXNXaXRoQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZXZlcnkoKGtleSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtrZXldID09PSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19
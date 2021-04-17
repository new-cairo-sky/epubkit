"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageSpineItem = _interopRequireDefault(require("./package-spine-item"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _objectWithoutProperties(source, excluded) {if (source == null) return {};var target = _objectWithoutPropertiesLoose(source, excluded);var key, i;if (Object.getOwnPropertySymbols) {var sourceSymbolKeys = Object.getOwnPropertySymbols(source);for (i = 0; i < sourceSymbolKeys.length; i++) {key = sourceSymbolKeys[i];if (excluded.indexOf(key) >= 0) continue;if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;target[key] = source[key];}}return target;}function _objectWithoutPropertiesLoose(source, excluded) {if (source == null) return {};var target = {};var sourceKeys = Object.keys(source);var key, i;for (i = 0; i < sourceKeys.length; i++) {key = sourceKeys[i];if (excluded.indexOf(key) >= 0) continue;target[key] = source[key];}return target;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}var

PackageSpine = /*#__PURE__*/function (_PackageElement) {_inherits(PackageSpine, _PackageElement);var _super = _createSuper(PackageSpine);
  function PackageSpine() {var _this;var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, PackageSpine);
    var attr = Object.assign(
    {
      id: undefined,
      "page-progression-direction": undefined,
      toc: undefined },

    options);


    _this = _super.call(this, "spine", undefined, attr);

    _this.items = [];

    items.forEach(function (itemData) {var
      idref = itemData.idref,options = _objectWithoutProperties(itemData, ["idref"]);
      _this.addItem(idref, options);
    });return _this;
  }_createClass(PackageSpine, [{ key: "addItem", value: function addItem(

    idref) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.items.push(new _packageSpineItem["default"](idref, options));
    } }, { key: "findItemWithId", value: function findItemWithId(

    id) {
      return this.items.find(function (item) {
        return item.id === id;
      });
    } }, { key: "removeItemWithId", value: function removeItemWithId(

    id) {
      this.items = this.items.filter(function (item) {
        return item.id !== id;
      });
    } }, { key: "findItemWithIdref", value: function findItemWithIdref(

    idref) {
      return this.items.find(function (item) {
        return item.idref === idref;
      });
    } }, { key: "removeItemWithIdref", value: function removeItemWithIdref(

    idref) {
      this.items = this.items.filter(function (item) {
        return item.idref !== idref;
      });
    } }, { key: "findItemsWithLinear", value: function findItemsWithLinear(

    value) {
      return this.items.filter(function (item) {
        if (value === "no") {
          return item.linear === "no";
        } else {
          return item.linear !== "no";
        }
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
    } }]);return PackageSpine;}(_packageElement["default"]);exports["default"] = PackageSpine;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLXNwaW5lLmpzIl0sIm5hbWVzIjpbIlBhY2thZ2VTcGluZSIsIml0ZW1zIiwib3B0aW9ucyIsImF0dHIiLCJPYmplY3QiLCJhc3NpZ24iLCJpZCIsInVuZGVmaW5lZCIsInRvYyIsImZvckVhY2giLCJpdGVtRGF0YSIsImlkcmVmIiwiYWRkSXRlbSIsInB1c2giLCJQYWNrYWdlU3BpbmVJdGVtIiwiZmluZCIsIml0ZW0iLCJmaWx0ZXIiLCJ2YWx1ZSIsImxpbmVhciIsImF0dHJpYnV0ZXMiLCJrZXlzIiwiZXZlcnkiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIlBhY2thZ2VFbGVtZW50Il0sIm1hcHBpbmdzIjoidUdBQUE7QUFDQSxnRjs7QUFFcUJBLFk7QUFDbkIsMEJBQXNDLGVBQTFCQyxLQUEwQix1RUFBbEIsRUFBa0IsS0FBZEMsT0FBYyx1RUFBSixFQUFJO0FBQ3BDLFFBQU1DLElBQUksR0FBR0MsTUFBTSxDQUFDQyxNQUFQO0FBQ1g7QUFDRUMsTUFBQUEsRUFBRSxFQUFFQyxTQUROO0FBRUUsb0NBQThCQSxTQUZoQztBQUdFQyxNQUFBQSxHQUFHLEVBQUVELFNBSFAsRUFEVzs7QUFNWEwsSUFBQUEsT0FOVyxDQUFiOzs7QUFTQSw4QkFBTSxPQUFOLEVBQWVLLFNBQWYsRUFBMEJKLElBQTFCOztBQUVBLFVBQUtGLEtBQUwsR0FBYSxFQUFiOztBQUVBQSxJQUFBQSxLQUFLLENBQUNRLE9BQU4sQ0FBYyxVQUFDQyxRQUFELEVBQWM7QUFDbEJDLE1BQUFBLEtBRGtCLEdBQ0lELFFBREosQ0FDbEJDLEtBRGtCLENBQ1JULE9BRFEsNEJBQ0lRLFFBREo7QUFFMUIsWUFBS0UsT0FBTCxDQUFhRCxLQUFiLEVBQW9CVCxPQUFwQjtBQUNELEtBSEQsRUFkb0M7QUFrQnJDLEc7O0FBRU9TLElBQUFBLEssRUFBcUIsS0FBZFQsT0FBYyx1RUFBSixFQUFJO0FBQzNCLFdBQUtELEtBQUwsQ0FBV1ksSUFBWCxDQUFnQixJQUFJQyw0QkFBSixDQUFxQkgsS0FBckIsRUFBNEJULE9BQTVCLENBQWhCO0FBQ0QsSzs7QUFFY0ksSUFBQUEsRSxFQUFJO0FBQ2pCLGFBQU8sS0FBS0wsS0FBTCxDQUFXYyxJQUFYLENBQWdCLFVBQUNDLElBQUQsRUFBVTtBQUMvQixlQUFPQSxJQUFJLENBQUNWLEVBQUwsS0FBWUEsRUFBbkI7QUFDRCxPQUZNLENBQVA7QUFHRCxLOztBQUVnQkEsSUFBQUEsRSxFQUFJO0FBQ25CLFdBQUtMLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdnQixNQUFYLENBQWtCLFVBQUNELElBQUQsRUFBVTtBQUN2QyxlQUFPQSxJQUFJLENBQUNWLEVBQUwsS0FBWUEsRUFBbkI7QUFDRCxPQUZZLENBQWI7QUFHRCxLOztBQUVpQkssSUFBQUEsSyxFQUFPO0FBQ3ZCLGFBQU8sS0FBS1YsS0FBTCxDQUFXYyxJQUFYLENBQWdCLFVBQUNDLElBQUQsRUFBVTtBQUMvQixlQUFPQSxJQUFJLENBQUNMLEtBQUwsS0FBZUEsS0FBdEI7QUFDRCxPQUZNLENBQVA7QUFHRCxLOztBQUVtQkEsSUFBQUEsSyxFQUFPO0FBQ3pCLFdBQUtWLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdnQixNQUFYLENBQWtCLFVBQUNELElBQUQsRUFBVTtBQUN2QyxlQUFPQSxJQUFJLENBQUNMLEtBQUwsS0FBZUEsS0FBdEI7QUFDRCxPQUZZLENBQWI7QUFHRCxLOztBQUVtQk8sSUFBQUEsSyxFQUFPO0FBQ3pCLGFBQU8sS0FBS2pCLEtBQUwsQ0FBV2dCLE1BQVgsQ0FBa0IsVUFBQ0QsSUFBRCxFQUFVO0FBQ2pDLFlBQUlFLEtBQUssS0FBSyxJQUFkLEVBQW9CO0FBQ2xCLGlCQUFPRixJQUFJLENBQUNHLE1BQUwsS0FBZ0IsSUFBdkI7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBT0gsSUFBSSxDQUFDRyxNQUFMLEtBQWdCLElBQXZCO0FBQ0Q7QUFDRixPQU5NLENBQVA7QUFPRDs7QUFFRDs7Ozs7O0FBTXdCQyxJQUFBQSxVLEVBQVk7QUFDbEMsYUFBTyxLQUFLbkIsS0FBTCxDQUFXZ0IsTUFBWCxDQUFrQixVQUFDRCxJQUFELEVBQVU7QUFDakMsZUFBT1osTUFBTSxDQUFDaUIsSUFBUCxDQUFZRCxVQUFaLEVBQXdCRSxLQUF4QixDQUE4QixVQUFDQyxHQUFELEVBQVM7QUFDNUMsY0FBSVAsSUFBSSxDQUFDUSxjQUFMLENBQW9CRCxHQUFwQixDQUFKLEVBQThCO0FBQzVCLGdCQUFJSCxVQUFVLENBQUNHLEdBQUQsQ0FBVixLQUFvQmhCLFNBQXhCLEVBQW1DO0FBQ2pDLHFCQUFPUyxJQUFJLENBQUNPLEdBQUQsQ0FBSixLQUFjSCxVQUFVLENBQUNHLEdBQUQsQ0FBL0I7QUFDRCxhQUZELE1BRU87QUFDTCxxQkFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNELGlCQUFPLEtBQVA7QUFDRCxTQVRNLENBQVA7QUFVRCxPQVhNLENBQVA7QUFZRCxLLDJCQTlFdUNFLDBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhY2thZ2VFbGVtZW50IGZyb20gXCIuL3BhY2thZ2UtZWxlbWVudFwiO1xuaW1wb3J0IFBhY2thZ2VTcGluZUl0ZW0gZnJvbSBcIi4vcGFja2FnZS1zcGluZS1pdGVtXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VTcGluZSBleHRlbmRzIFBhY2thZ2VFbGVtZW50IHtcbiAgY29uc3RydWN0b3IoaXRlbXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXR0ciA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgICAgIFwicGFnZS1wcm9ncmVzc2lvbi1kaXJlY3Rpb25cIjogdW5kZWZpbmVkLFxuICAgICAgICB0b2M6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcblxuICAgIHN1cGVyKFwic3BpbmVcIiwgdW5kZWZpbmVkLCBhdHRyKTtcblxuICAgIHRoaXMuaXRlbXMgPSBbXTtcblxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW1EYXRhKSA9PiB7XG4gICAgICBjb25zdCB7IGlkcmVmLCAuLi5vcHRpb25zIH0gPSBpdGVtRGF0YTtcbiAgICAgIHRoaXMuYWRkSXRlbShpZHJlZiwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRJdGVtKGlkcmVmLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2gobmV3IFBhY2thZ2VTcGluZUl0ZW0oaWRyZWYsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGZpbmRJdGVtV2l0aElkKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlSXRlbVdpdGhJZChpZCkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgIT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZEl0ZW1XaXRoSWRyZWYoaWRyZWYpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5pZHJlZiA9PT0gaWRyZWY7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVJdGVtV2l0aElkcmVmKGlkcmVmKSB7XG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5pZHJlZiAhPT0gaWRyZWY7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kSXRlbXNXaXRoTGluZWFyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICBpZiAodmFsdWUgPT09IFwibm9cIikge1xuICAgICAgICByZXR1cm4gaXRlbS5saW5lYXIgPT09IFwibm9cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpdGVtLmxpbmVhciAhPT0gXCJub1wiO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGl0ZW1zIHRoYXQgaGF2ZSBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgbGlzdGVkIGluIHRoZSBwcm92aWRlZCBvYmplY3QuXG4gICAqIElmIHRoZSBvbmplY3QgYXR0cmlidXRlJ3MgdmFsdWUgaXMgdW5kZWZpbmVkLCB0aGVuIG9ubHkgdGhlIGF0dHJpYnV0ZSBuYW1lXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAqL1xuICBmaW5kSXRlbXNXaXRoQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZXZlcnkoKGtleSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtrZXldID09PSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _uuid = require("uuid");
var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageMetadataItem = _interopRequireDefault(require("./package-metadata-item"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

// TODO: add date modified meta element on save
var
PackageMetadata = /*#__PURE__*/function (_PackageElement) {_inherits(PackageMetadata, _PackageElement);var _super = _createSuper(PackageMetadata);
  function PackageMetadata() {var _this;var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, PackageMetadata);
    var attr = Object.assign(
    {
      "xmlns:dc": "http://purl.org/dc/elements/1.1/" },

    attributes);


    _this = _super.call(this, "metadata", undefined, attr);

    var requiredMetadata = [
    // { element: "dc:identifier", value: `urn:uuid:${uuidv4()}` },
    { element: "dc:title", value: "Untitled" },
    { element: "dc:language", value: "en-US" }
    // { element: "meta", value: undefined, attributes: {property: "dcterms:modified"}}
    ];

    var neededMetadata = requiredMetadata.filter(function (requiredItem) {
      return (
        items.findIndex(function (item) {
          return item.element === requiredItem.element;
        }) === -1);

    });

    _this.items = items.concat(neededMetadata).map(function (itemData) {
      return new _packageMetadataItem["default"](
      itemData.element,
      itemData.value,
      itemData === null || itemData === void 0 ? void 0 : itemData.attributes);

    });return _this;
  }_createClass(PackageMetadata, [{ key: "addItem", value: function addItem(

    element) {var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.items.push(new _packageMetadataItem["default"](element, value, attributes));
    } }, { key: "removeItemsWithName", value: function removeItemsWithName(

    element) {
      this.items = this.items.filter(function (item) {
        item.element !== element;
      });
    } }, { key: "findItemsWithName", value: function findItemsWithName(

    element) {
      return this.items.filter(function (item) {
        return item.element === element;
      });
    } }, { key: "findItemWithId", value: function findItemWithId(

    element, id) {
      return this.items.find(function (item) {
        return item.element === element && item.id === id;
      });
    } }, { key: "removeItemWithId", value: function removeItemWithId(

    element, id) {
      this.items = this.items.filter(function (item) {
        item.element !== element && item.id !== id;
      });
    }

    /**
       * Finds items that have all of the attributes listed in the provided object.
       * If the object attribute's value is undefined, then only the attribute name
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
    } }]);return PackageMetadata;}(_packageElement["default"]);exports["default"] = PackageMetadata;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLW1ldGFkYXRhLmpzIl0sIm5hbWVzIjpbIlBhY2thZ2VNZXRhZGF0YSIsIml0ZW1zIiwiYXR0cmlidXRlcyIsImF0dHIiLCJPYmplY3QiLCJhc3NpZ24iLCJ1bmRlZmluZWQiLCJyZXF1aXJlZE1ldGFkYXRhIiwiZWxlbWVudCIsInZhbHVlIiwibmVlZGVkTWV0YWRhdGEiLCJmaWx0ZXIiLCJyZXF1aXJlZEl0ZW0iLCJmaW5kSW5kZXgiLCJpdGVtIiwiY29uY2F0IiwibWFwIiwiaXRlbURhdGEiLCJQYWNrYWdlTWV0YWRhdGFJdGVtIiwicHVzaCIsImlkIiwiZmluZCIsImtleXMiLCJldmVyeSIsImtleSIsImhhc093blByb3BlcnR5IiwiUGFja2FnZUVsZW1lbnQiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBO0FBQ0Esc0Y7O0FBRUE7O0FBRXFCQSxlO0FBQ25CLDZCQUF5QyxlQUE3QkMsS0FBNkIsdUVBQXJCLEVBQXFCLEtBQWpCQyxVQUFpQix1RUFBSixFQUFJO0FBQ3ZDLFFBQU1DLElBQUksR0FBR0MsTUFBTSxDQUFDQyxNQUFQO0FBQ1g7QUFDRSxrQkFBWSxrQ0FEZCxFQURXOztBQUlYSCxJQUFBQSxVQUpXLENBQWI7OztBQU9BLDhCQUFNLFVBQU4sRUFBa0JJLFNBQWxCLEVBQTZCSCxJQUE3Qjs7QUFFQSxRQUFNSSxnQkFBZ0IsR0FBRztBQUN2QjtBQUNBLE1BQUVDLE9BQU8sRUFBRSxVQUFYLEVBQXVCQyxLQUFLLEVBQUUsVUFBOUIsRUFGdUI7QUFHdkIsTUFBRUQsT0FBTyxFQUFFLGFBQVgsRUFBMEJDLEtBQUssRUFBRSxPQUFqQztBQUNBO0FBSnVCLEtBQXpCOztBQU9BLFFBQU1DLGNBQWMsR0FBR0gsZ0JBQWdCLENBQUNJLE1BQWpCLENBQXdCLFVBQUNDLFlBQUQsRUFBa0I7QUFDL0Q7QUFDRVgsUUFBQUEsS0FBSyxDQUFDWSxTQUFOLENBQWdCLFVBQUNDLElBQUQsRUFBVTtBQUN4QixpQkFBT0EsSUFBSSxDQUFDTixPQUFMLEtBQWlCSSxZQUFZLENBQUNKLE9BQXJDO0FBQ0QsU0FGRCxNQUVPLENBQUMsQ0FIVjs7QUFLRCxLQU5zQixDQUF2Qjs7QUFRQSxVQUFLUCxLQUFMLEdBQWFBLEtBQUssQ0FBQ2MsTUFBTixDQUFhTCxjQUFiLEVBQTZCTSxHQUE3QixDQUFpQyxVQUFDQyxRQUFELEVBQWM7QUFDMUQsYUFBTyxJQUFJQywrQkFBSjtBQUNMRCxNQUFBQSxRQUFRLENBQUNULE9BREo7QUFFTFMsTUFBQUEsUUFBUSxDQUFDUixLQUZKO0FBR0xRLE1BQUFBLFFBSEssYUFHTEEsUUFISyx1QkFHTEEsUUFBUSxDQUFFZixVQUhMLENBQVA7O0FBS0QsS0FOWSxDQUFiLENBekJ1QztBQWdDeEMsRzs7QUFFT00sSUFBQUEsTyxFQUFzQyxLQUE3QkMsS0FBNkIsdUVBQXJCLEVBQXFCLEtBQWpCUCxVQUFpQix1RUFBSixFQUFJO0FBQzVDLFdBQUtELEtBQUwsQ0FBV2tCLElBQVgsQ0FBZ0IsSUFBSUQsK0JBQUosQ0FBd0JWLE9BQXhCLEVBQWlDQyxLQUFqQyxFQUF3Q1AsVUFBeEMsQ0FBaEI7QUFDRCxLOztBQUVtQk0sSUFBQUEsTyxFQUFTO0FBQzNCLFdBQUtQLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdVLE1BQVgsQ0FBa0IsVUFBQ0csSUFBRCxFQUFVO0FBQ3ZDQSxRQUFBQSxJQUFJLENBQUNOLE9BQUwsS0FBaUJBLE9BQWpCO0FBQ0QsT0FGWSxDQUFiO0FBR0QsSzs7QUFFaUJBLElBQUFBLE8sRUFBUztBQUN6QixhQUFPLEtBQUtQLEtBQUwsQ0FBV1UsTUFBWCxDQUFrQixVQUFDRyxJQUFELEVBQVU7QUFDakMsZUFBT0EsSUFBSSxDQUFDTixPQUFMLEtBQWlCQSxPQUF4QjtBQUNELE9BRk0sQ0FBUDtBQUdELEs7O0FBRWNBLElBQUFBLE8sRUFBU1ksRSxFQUFJO0FBQzFCLGFBQU8sS0FBS25CLEtBQUwsQ0FBV29CLElBQVgsQ0FBZ0IsVUFBQ1AsSUFBRCxFQUFVO0FBQy9CLGVBQU9BLElBQUksQ0FBQ04sT0FBTCxLQUFpQkEsT0FBakIsSUFBNEJNLElBQUksQ0FBQ00sRUFBTCxLQUFZQSxFQUEvQztBQUNELE9BRk0sQ0FBUDtBQUdELEs7O0FBRWdCWixJQUFBQSxPLEVBQVNZLEUsRUFBSTtBQUM1QixXQUFLbkIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV1UsTUFBWCxDQUFrQixVQUFDRyxJQUFELEVBQVU7QUFDdkNBLFFBQUFBLElBQUksQ0FBQ04sT0FBTCxLQUFpQkEsT0FBakIsSUFBNEJNLElBQUksQ0FBQ00sRUFBTCxLQUFZQSxFQUF4QztBQUNELE9BRlksQ0FBYjtBQUdEOztBQUVEOzs7Ozs7QUFNd0JsQixJQUFBQSxVLEVBQVk7QUFDbEMsYUFBTyxLQUFLRCxLQUFMLENBQVdVLE1BQVgsQ0FBa0IsVUFBQ0csSUFBRCxFQUFVO0FBQ2pDLGVBQU9WLE1BQU0sQ0FBQ2tCLElBQVAsQ0FBWXBCLFVBQVosRUFBd0JxQixLQUF4QixDQUE4QixVQUFDQyxHQUFELEVBQVM7QUFDNUMsY0FBSVYsSUFBSSxDQUFDVyxjQUFMLENBQW9CRCxHQUFwQixDQUFKLEVBQThCO0FBQzVCLGdCQUFJdEIsVUFBVSxDQUFDc0IsR0FBRCxDQUFWLEtBQW9CbEIsU0FBeEIsRUFBbUM7QUFDakMscUJBQU9RLElBQUksQ0FBQ1UsR0FBRCxDQUFKLEtBQWN0QixVQUFVLENBQUNzQixHQUFELENBQS9CO0FBQ0QsYUFGRCxNQUVPO0FBQ0wscUJBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxpQkFBTyxLQUFQO0FBQ0QsU0FUTSxDQUFQO0FBVUQsT0FYTSxDQUFQO0FBWUQsSyw4QkFsRjBDRSwwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XG5pbXBvcnQgUGFja2FnZUVsZW1lbnQgZnJvbSBcIi4vcGFja2FnZS1lbGVtZW50XCI7XG5pbXBvcnQgUGFja2FnZU1ldGFkYXRhSXRlbSBmcm9tIFwiLi9wYWNrYWdlLW1ldGFkYXRhLWl0ZW1cIjtcblxuLy8gVE9ETzogYWRkIGRhdGUgbW9kaWZpZWQgbWV0YSBlbGVtZW50IG9uIHNhdmVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZU1ldGFkYXRhIGV4dGVuZHMgUGFja2FnZUVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihpdGVtcyA9IFtdLCBhdHRyaWJ1dGVzID0ge30pIHtcbiAgICBjb25zdCBhdHRyID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgXCJ4bWxuczpkY1wiOiBcImh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvXCIsXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlc1xuICAgICk7XG5cbiAgICBzdXBlcihcIm1ldGFkYXRhXCIsIHVuZGVmaW5lZCwgYXR0cik7XG5cbiAgICBjb25zdCByZXF1aXJlZE1ldGFkYXRhID0gW1xuICAgICAgLy8geyBlbGVtZW50OiBcImRjOmlkZW50aWZpZXJcIiwgdmFsdWU6IGB1cm46dXVpZDoke3V1aWR2NCgpfWAgfSxcbiAgICAgIHsgZWxlbWVudDogXCJkYzp0aXRsZVwiLCB2YWx1ZTogXCJVbnRpdGxlZFwiIH0sXG4gICAgICB7IGVsZW1lbnQ6IFwiZGM6bGFuZ3VhZ2VcIiwgdmFsdWU6IFwiZW4tVVNcIiB9LFxuICAgICAgLy8geyBlbGVtZW50OiBcIm1ldGFcIiwgdmFsdWU6IHVuZGVmaW5lZCwgYXR0cmlidXRlczoge3Byb3BlcnR5OiBcImRjdGVybXM6bW9kaWZpZWRcIn19XG4gICAgXTtcblxuICAgIGNvbnN0IG5lZWRlZE1ldGFkYXRhID0gcmVxdWlyZWRNZXRhZGF0YS5maWx0ZXIoKHJlcXVpcmVkSXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaXRlbXMuZmluZEluZGV4KChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uZWxlbWVudCA9PT0gcmVxdWlyZWRJdGVtLmVsZW1lbnQ7XG4gICAgICAgIH0pID09PSAtMVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaXRlbXMgPSBpdGVtcy5jb25jYXQobmVlZGVkTWV0YWRhdGEpLm1hcCgoaXRlbURhdGEpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUGFja2FnZU1ldGFkYXRhSXRlbShcbiAgICAgICAgaXRlbURhdGEuZWxlbWVudCxcbiAgICAgICAgaXRlbURhdGEudmFsdWUsXG4gICAgICAgIGl0ZW1EYXRhPy5hdHRyaWJ1dGVzXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkSXRlbShlbGVtZW50LCB2YWx1ZSA9IFwiXCIsIGF0dHJpYnV0ZXMgPSB7fSkge1xuICAgIHRoaXMuaXRlbXMucHVzaChuZXcgUGFja2FnZU1ldGFkYXRhSXRlbShlbGVtZW50LCB2YWx1ZSwgYXR0cmlidXRlcykpO1xuICB9XG5cbiAgcmVtb3ZlSXRlbXNXaXRoTmFtZShlbGVtZW50KSB7XG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmVsZW1lbnQgIT09IGVsZW1lbnQ7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kSXRlbXNXaXRoTmFtZShlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5lbGVtZW50ID09PSBlbGVtZW50O1xuICAgIH0pO1xuICB9XG5cbiAgZmluZEl0ZW1XaXRoSWQoZWxlbWVudCwgaWQpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5lbGVtZW50ID09PSBlbGVtZW50ICYmIGl0ZW0uaWQgPT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlSXRlbVdpdGhJZChlbGVtZW50LCBpZCkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5lbGVtZW50ICE9PSBlbGVtZW50ICYmIGl0ZW0uaWQgIT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGl0ZW1zIHRoYXQgaGF2ZSBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgbGlzdGVkIGluIHRoZSBwcm92aWRlZCBvYmplY3QuXG4gICAqIElmIHRoZSBvYmplY3QgYXR0cmlidXRlJ3MgdmFsdWUgaXMgdW5kZWZpbmVkLCB0aGVuIG9ubHkgdGhlIGF0dHJpYnV0ZSBuYW1lXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAqL1xuICBmaW5kSXRlbXNXaXRoQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZXZlcnkoKGtleSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtrZXldID09PSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19
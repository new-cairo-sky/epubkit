"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _xml = require("./utils/xml");function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _iterableToArrayLimit(arr, i) {if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var









DataElement = /*#__PURE__*/function () {








  function DataElement(element, value, attributes) {_classCallCheck(this, DataElement);_defineProperty(this, "_attributes", void 0);_defineProperty(this, "_children", void 0);_defineProperty(this, "_orderedChildren", void 0);_defineProperty(this, "element", void 0);_defineProperty(this, "value", void 0);
    this._attributes = {};

    // organizes children data-elements by element type
    this._children = {};

    // organizes flat list of children by absolut order
    this._orderedChildren = [];

    if (attributes) {
      this.addAttributes(attributes);
    }

    this.element = element;
    this.value = value;
  }_createClass(DataElement, [{ key: "loadXml",





    /**
                                                 * Load and parse xml
                                                 * @param {string} xml - the xml to parse
                                                 * @param {boolean} recursive - set true to recursively parse children elements
                                                 */value: function () {var _loadXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
      xml) {var recursive,xmlObj,_i,_Object$entries,_Object$entries$_i,_key,value,_args = arguments;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:recursive = _args.length > 1 && _args[1] !== undefined ? _args[1] : true;_context.next = 3;return (
                  (0, _xml.parseXml)(xml));case 3:xmlObj = _context.sent;_i = 0, _Object$entries =

                Object.entries(xmlObj);case 5:if (!(_i < _Object$entries.length)) {_context.next = 14;break;}_Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), _key = _Object$entries$_i[0], value = _Object$entries$_i[1];
                this.element = _key;
                if (value === null || value === void 0 ? void 0 : value.attr) {
                  this.addAttributes(value.attr);
                }_context.next = 11;return (
                  this.parseXmlObj(value, recursive));case 11:_i++;_context.next = 5;break;case 14:case "end":return _context.stop();}}}, _callee, this);}));function loadXml(_x) {return _loadXml.apply(this, arguments);}return loadXml;}()



    /**
                                                                                                                                                                                                                                               * Parse an xml2Js object - primarily intended for use by loadXml method only
                                                                                                                                                                                                                                               * @param {object} xmlObj - an xml2js object
                                                                                                                                                                                                                                               * @param {boolean} recursive - if it should recurse through the children
                                                                                                                                                                                                                                               */ }, { key: "parseXmlObj", value: function () {var _parseXmlObj = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(
      xmlObj) {var _this = this;var recursive,_loop,_i2,_Object$entries2,_args4 = arguments;return regeneratorRuntime.wrap(function _callee3$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:recursive = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : true;_loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {var _Object$entries2$_i, valKey, valValue;return regeneratorRuntime.wrap(function _loop$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                          valKey = _Object$entries2$_i[0], valValue = _Object$entries2$_i[1];if (!(
                          valKey === "attr")) {_context3.next = 5;break;}
                          _this.addAttributes(valValue);_context3.next = 19;break;case 5:if (!(
                          valKey === "val")) {_context3.next = 9;break;}
                          _this.value = valValue;_context3.next = 19;break;case 9:if (!
                          recursive) {_context3.next = 19;break;}if (!

                          Array.isArray(valValue)) {_context3.next = 15;break;}
                          _this[valKey] = [];
                          valValue.forEach( /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(child) {var length;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                                      length = _this[valKey].push(new DataElement(valKey)); //await this.parseXmlObj()
                                      _context2.next = 3;return _this[valKey][length - 1].parseXmlObj(child, recursive);case 3:case "end":return _context2.stop();}}}, _callee2);}));return function (_x3) {return _ref.apply(this, arguments);};}());_context3.next = 19;break;case 15:if (!(


                          Object.prototype.toString.call(valValue) === "[object Object]")) {_context3.next = 19;break;}

                          _this[valKey] = new DataElement(valKey);_context3.next = 19;return (
                            _this[valKey].parseXmlObj(valValue, recursive));case 19:case "end":return _context3.stop();}}}, _loop);});_i2 = 0, _Object$entries2 = Object.entries(xmlObj);case 3:if (!(_i2 < _Object$entries2.length)) {_context4.next = 8;break;}return _context4.delegateYield(_loop(), "t0", 5);case 5:_i2++;_context4.next = 3;break;case 8:case "end":return _context4.stop();}}}, _callee3);}));function parseXmlObj(_x2) {return _parseXmlObj.apply(this, arguments);}return parseXmlObj;}() }, { key: "addChild", value: function addChild(





    name, child) {
      var safeName = name.toLowerCase();
      var foundNames = Object.keys(this).filter(function (key) {
        return key.toLowerCase() === safeName;
      });
      var actualName = foundNames.length > 0 ? foundNames[0] : name;

      this._orderedChildren.push(child);

      if (this[safeName]) {
        // already exists
        this._children[safeName].push(child);
      } else {
        // does not already exist
        Object.defineProperty(this, safeName, {
          configurable: true,
          get: function get() {
            var foundChild = this._children[safeName];
            if (foundChild.length === 1) {
              // if there is only one element, return the single item instead of array
              return this._children[safeName][0];
            } else {
              return this._children[safeName];
            }
          },
          set: function set(val) {
            // is val is an array, assume that is meant to replace existing array
            if (Array.isArray(val)) {
              this._children[safeName] = val;
            } else {
              // otherwise add it the the array
              this._children[safeName] = [val];
            }
          } });

      }
    } }, { key: "getFilteredAttributes",





    /**
                                          * Get the attributes, filtering out any that are empty
                                          */value: function getFilteredAttributes()
    {
      var attributes = this._attributes;
      if (Object.keys(attributes).length) {
        var attr = Object.entries(attributes).
        filter(function (_ref2) {var _ref3 = _slicedToArray(_ref2, 2),key = _ref3[0],value = _ref3[1];
          return value !== undefined;
        }).
        reduce(function (obj, _ref4) {var _ref5 = _slicedToArray(_ref4, 2),key = _ref5[0],value = _ref5[1];
          obj[key] = attributes[key];
          return obj;
        }, {});

        if (Object.keys(attr).length) {
          return attr;
        }
      }
      return;
    } }, { key: "removeAttribute", value: function removeAttribute(

    key) {var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      if (this._attributes[key]) {
        if (value && this._attributes[key] === value) {
          delete this._attributes[key];
        } else if (!value) {
          delete this._attributes[key];
        }

        if (this.hasOwnProperty(key)) {
          if (value && this[key] === value) {
            delete this[key];
          } else if (!value) {
            delete this[key];
          }
        }
      }
    } }, { key: "addAttributes", value: function addAttributes(

    attributes) {var _this2 = this;
      Object.assign(this._attributes, attributes);
      Object.entries(attributes).forEach(function (_ref6) {var _ref7 = _slicedToArray(_ref6, 2),key = _ref7[0],value = _ref7[1];
        //this._attributes[key] = value;
        if (!_this2.hasOwnProperty(key)) {
          Object.defineProperty(_this2, key, {
            // see: https://stackoverflow.com/questions/7141210/how-do-i-undo-a-object-defineproperty-call
            configurable: true,
            get: function get() {
              return this._attributes[key];
            },
            set: function set(val) {
              this._attributes[key] = val;
            } });

        }
      });
    }

    /**
       * Generate the actual xml data
       */ }, { key: "getXml", value: function () {var _getXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {var isFragment,preparedObject,xml,_args5 = arguments;return regeneratorRuntime.wrap(function _callee4$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                isFragment = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : false;
                preparedObject = this.prepareForXml();_context5.next = 4;return (
                  (0, _xml.generateXml)(preparedObject, isFragment));case 4:xml = _context5.sent;return _context5.abrupt("return",
                xml);case 6:case "end":return _context5.stop();}}}, _callee4, this);}));function getXml() {return _getXml.apply(this, arguments);}return getXml;}()


    /**
                                                                                                                                                                     * Convert self into a plain data object, recursing children as needed.
                                                                                                                                                                     * This data can be passed to xml2Js builder method to convert to xml
                                                                                                                                                                     */ }, { key: "prepareForXml", value: function prepareForXml()
    {
      var data = {};

      var dataElement = this;

      for (var _i3 = 0, _Object$entries3 = Object.entries(dataElement); _i3 < _Object$entries3.length; _i3++) {var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),_key2 = _Object$entries3$_i[0],value = _Object$entries3$_i[1];
        if (_key2 === "_attributes") {
          var attr = this.getFilteredAttributes();
          if (attr) {
            data.attr = attr;
          }
        } else if (_key2 === "value" && value) {
          data.val = value;
        } else if (value instanceof DataElement) {
          // this is a child dataElement
          var childData = value.prepareForXml();
          data[value.element] = childData[value.element];
        } else if (Array.isArray(value) && value.length > 0) {(function () {
            // if entry is an array, recurse through it as children objects
            var children = {};
            value.forEach(function (child) {
              var childData = child.prepareForXml();

              // if children[child.element] array is already defined, add to it.
              if (Array.isArray(children[child.element])) {
                children[child.element].push(childData[child.element]);
              } else {
                // otherwise make a new array
                children[child.element] = [childData[child.element]];
              }
            });
            Object.assign(data, children);})();
        }
      }

      return _defineProperty({}, this.element, data);
    } }, { key: "attributes", get: function get() {return this._attributes;} }, { key: "children", get: function get() {return this._orderedChildren;} }]);return DataElement;}();exports["default"] = DataElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhLWVsZW1lbnQudHMiXSwibmFtZXMiOlsiRGF0YUVsZW1lbnQiLCJlbGVtZW50IiwidmFsdWUiLCJhdHRyaWJ1dGVzIiwiX2F0dHJpYnV0ZXMiLCJfY2hpbGRyZW4iLCJfb3JkZXJlZENoaWxkcmVuIiwiYWRkQXR0cmlidXRlcyIsInhtbCIsInJlY3Vyc2l2ZSIsInhtbE9iaiIsIk9iamVjdCIsImVudHJpZXMiLCJrZXkiLCJhdHRyIiwicGFyc2VYbWxPYmoiLCJ2YWxLZXkiLCJ2YWxWYWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJjaGlsZCIsImxlbmd0aCIsInB1c2giLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJuYW1lIiwic2FmZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImZvdW5kTmFtZXMiLCJrZXlzIiwiZmlsdGVyIiwiYWN0dWFsTmFtZSIsImRlZmluZVByb3BlcnR5IiwiY29uZmlndXJhYmxlIiwiZ2V0IiwiZm91bmRDaGlsZCIsInNldCIsInZhbCIsInVuZGVmaW5lZCIsInJlZHVjZSIsIm9iaiIsImhhc093blByb3BlcnR5IiwiYXNzaWduIiwiaXNGcmFnbWVudCIsInByZXBhcmVkT2JqZWN0IiwicHJlcGFyZUZvclhtbCIsImRhdGEiLCJkYXRhRWxlbWVudCIsImdldEZpbHRlcmVkQXR0cmlidXRlcyIsImNoaWxkRGF0YSIsImNoaWxkcmVuIl0sIm1hcHBpbmdzIjoidUdBQUEsa0M7Ozs7Ozs7Ozs7QUFVcUJBLFc7Ozs7Ozs7OztBQVNuQix1QkFBWUMsT0FBWixFQUE2QkMsS0FBN0IsRUFBNkNDLFVBQTdDLEVBQWtFO0FBQ2hFLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUE7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0IsRUFBeEI7O0FBRUEsUUFBSUgsVUFBSixFQUFnQjtBQUNkLFdBQUtJLGFBQUwsQ0FBbUJKLFVBQW5CO0FBQ0Q7O0FB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QVMsQ0FBQ2pELEtBQUssQ0FBQ0QsT0FBUCxDQUEvQjtBQUNELFNBSk0sTUFJQSxJQUFJaUIsS0FBSyxDQUFDQyxPQUFOLENBQWNqQixLQUFkLEtBQXdCQSxLQUFLLENBQUNvQixNQUFOLEdBQWUsQ0FBM0MsRUFBOEM7QUFDbkQ7QUFDQSxnQkFBTThCLFFBQWdDLEdBQUcsRUFBekM7QUFDQWxELFlBQUFBLEtBQUssQ0FBQ2tCLE9BQU4sQ0FBYyxVQUFDQyxLQUFELEVBQVc7QUFDdkIsa0JBQU04QixTQUFTLEdBQUc5QixLQUFLLENBQUMwQixhQUFOLEVBQWxCOztBQUVBO0FBQ0Esa0JBQUk3QixLQUFLLENBQUNDLE9BQU4sQ0FBY2lDLFFBQVEsQ0FBQy9CLEtBQUssQ0FBQ3BCLE9BQVAsQ0FBdEIsQ0FBSixFQUE0QztBQUMxQ21ELGdCQUFBQSxRQUFRLENBQUMvQixLQUFLLENBQUNwQixPQUFQLENBQVIsQ0FBd0JzQixJQUF4QixDQUE2QjRCLFNBQVMsQ0FBQzlCLEtBQUssQ0FBQ3BCLE9BQVAsQ0FBdEM7QUFDRCxlQUZELE1BRU87QUFDTDtBQUNBbUQsZ0JBQUFBLFFBQVEsQ0FBQy9CLEtBQUssQ0FBQ3BCLE9BQVAsQ0FBUixHQUEwQixDQUFDa0QsU0FBUyxDQUFDOUIsS0FBSyxDQUFDcEIsT0FBUCxDQUFWLENBQTFCO0FBQ0Q7QUFDRixhQVZEO0FBV0FVLFlBQUFBLE1BQU0sQ0FBQ2lDLE1BQVAsQ0FBY0ksSUFBZCxFQUFvQkksUUFBcEIsRUFkbUQ7QUFlcEQ7QUFDRjs7QUFFRCxpQ0FBVSxLQUFLbkQsT0FBZixFQUF5QitDLElBQXpCO0FBQ0QsSyw2Q0F4TWdCLENBQ2YsT0FBTyxLQUFLNUMsV0FBWixDQUNELEMsMkNBc0ZjLENBQ2IsT0FBTyxLQUFLRSxnQkFBWixDQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZVhtbCwgcGFyc2VYbWwgfSBmcm9tIFwiLi91dGlscy94bWxcIjtcblxuaW50ZXJmYWNlIF9jaGlsZHJlbiB7XG4gIFtrZXk6IHN0cmluZ106IERhdGFFbGVtZW50W107XG59XG5cbmludGVyZmFjZSBBdHRyaWJ1dGVzIHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhRWxlbWVudCB7XG4gIF9hdHRyaWJ1dGVzOiBBdHRyaWJ1dGVzO1xuICBfY2hpbGRyZW46IF9jaGlsZHJlbjtcbiAgX29yZGVyZWRDaGlsZHJlbjogRGF0YUVsZW1lbnRbXTtcbiAgZWxlbWVudDogc3RyaW5nO1xuICB2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAvLyBUT0RPIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgb25jZSBvYmplY3QgcHJvcGVydGllcyBhcmUgcmVmYWN0b3JlZCBhcyBtZW1iZXJzIG9mIGNoaWxkcmVuXG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nLCBhdHRyaWJ1dGVzPzogb2JqZWN0KSB7XG4gICAgdGhpcy5fYXR0cmlidXRlcyA9IHt9O1xuXG4gICAgLy8gb3JnYW5pemVzIGNoaWxkcmVuIGRhdGEtZWxlbWVudHMgYnkgZWxlbWVudCB0eXBlXG4gICAgdGhpcy5fY2hpbGRyZW4gPSB7fTtcblxuICAgIC8vIG9yZ2FuaXplcyBmbGF0IGxpc3Qgb2YgY2hpbGRyZW4gYnkgYWJzb2x1dCBvcmRlclxuICAgIHRoaXMuX29yZGVyZWRDaGlsZHJlbiA9IFtdO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgIHRoaXMuYWRkQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBhdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYW5kIHBhcnNlIHhtbFxuICAgKiBAcGFyYW0ge3N0cmluZ30geG1sIC0gdGhlIHhtbCB0byBwYXJzZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlY3Vyc2l2ZSAtIHNldCB0cnVlIHRvIHJlY3Vyc2l2ZWx5IHBhcnNlIGNoaWxkcmVuIGVsZW1lbnRzXG4gICAqL1xuICBhc3luYyBsb2FkWG1sKHhtbDogc3RyaW5nLCByZWN1cnNpdmU6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgY29uc3QgeG1sT2JqID0gYXdhaXQgcGFyc2VYbWwoeG1sKTtcblxuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh4bWxPYmopKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBrZXk7XG4gICAgICBpZiAodmFsdWU/LmF0dHIpIHtcbiAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVzKHZhbHVlLmF0dHIpO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5wYXJzZVhtbE9iaih2YWx1ZSwgcmVjdXJzaXZlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYW4geG1sMkpzIG9iamVjdCAtIHByaW1hcmlseSBpbnRlbmRlZCBmb3IgdXNlIGJ5IGxvYWRYbWwgbWV0aG9kIG9ubHlcbiAgICogQHBhcmFtIHtvYmplY3R9IHhtbE9iaiAtIGFuIHhtbDJqcyBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSByZWN1cnNpdmUgLSBpZiBpdCBzaG91bGQgcmVjdXJzZSB0aHJvdWdoIHRoZSBjaGlsZHJlblxuICAgKi9cbiAgYXN5bmMgcGFyc2VYbWxPYmooeG1sT2JqOiBvYmplY3QsIHJlY3Vyc2l2ZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICBmb3IgKGxldCBbdmFsS2V5LCB2YWxWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoeG1sT2JqKSkge1xuICAgICAgaWYgKHZhbEtleSA9PT0gXCJhdHRyXCIpIHtcbiAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVzKHZhbFZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsS2V5ID09PSBcInZhbFwiKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWxWYWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAocmVjdXJzaXZlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFyc2luZ1wiLCB2YWxLZXkpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxWYWx1ZSkpIHtcbiAgICAgICAgICB0aGlzW3ZhbEtleV0gPSBbXTtcbiAgICAgICAgICB2YWxWYWx1ZS5mb3JFYWNoKGFzeW5jIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpc1t2YWxLZXldLnB1c2gobmV3IERhdGFFbGVtZW50KHZhbEtleSkpOyAvL2F3YWl0IHRoaXMucGFyc2VYbWxPYmooKVxuICAgICAgICAgICAgYXdhaXQgdGhpc1t2YWxLZXldW2xlbmd0aCAtIDFdLnBhcnNlWG1sT2JqKGNoaWxkLCByZWN1cnNpdmUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWxWYWx1ZSkgPT09IFwiW29iamVjdCBPYmplY3RdXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpc1t2YWxLZXldID0gbmV3IERhdGFFbGVtZW50KHZhbEtleSk7XG4gICAgICAgICAgYXdhaXQgdGhpc1t2YWxLZXldLnBhcnNlWG1sT2JqKHZhbFZhbHVlLCByZWN1cnNpdmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkQ2hpbGQobmFtZTogc3RyaW5nLCBjaGlsZDogRGF0YUVsZW1lbnQpIHtcbiAgICBjb25zdCBzYWZlTmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBmb3VuZE5hbWVzID0gT2JqZWN0LmtleXModGhpcykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gc2FmZU5hbWU7XG4gICAgfSk7XG4gICAgY29uc3QgYWN0dWFsTmFtZSA9IGZvdW5kTmFtZXMubGVuZ3RoID4gMCA/IGZvdW5kTmFtZXNbMF0gOiBuYW1lO1xuXG4gICAgdGhpcy5fb3JkZXJlZENoaWxkcmVuLnB1c2goY2hpbGQpO1xuXG4gICAgaWYgKHRoaXNbc2FmZU5hbWVdKSB7XG4gICAgICAvLyBhbHJlYWR5IGV4aXN0c1xuICAgICAgdGhpcy5fY2hpbGRyZW5bc2FmZU5hbWVdLnB1c2goY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgc2FmZU5hbWUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgY29uc3QgZm91bmRDaGlsZCA9IHRoaXMuX2NoaWxkcmVuW3NhZmVOYW1lXTtcbiAgICAgICAgICBpZiAoZm91bmRDaGlsZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGVsZW1lbnQsIHJldHVybiB0aGUgc2luZ2xlIGl0ZW0gaW5zdGVhZCBvZiBhcnJheVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW3NhZmVOYW1lXVswXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW3NhZmVOYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWwpIHtcbiAgICAgICAgICAvLyBpcyB2YWwgaXMgYW4gYXJyYXksIGFzc3VtZSB0aGF0IGlzIG1lYW50IHRvIHJlcGxhY2UgZXhpc3RpbmcgYXJyYXlcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltzYWZlTmFtZV0gPSB2YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBhZGQgaXQgdGhlIHRoZSBhcnJheVxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5bc2FmZU5hbWVdID0gW3ZhbF07XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmRlcmVkQ2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBhdHRyaWJ1dGVzLCBmaWx0ZXJpbmcgb3V0IGFueSB0aGF0IGFyZSBlbXB0eVxuICAgKi9cbiAgZ2V0RmlsdGVyZWRBdHRyaWJ1dGVzKCk6IEF0dHJpYnV0ZXMgfCB2b2lkIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5fYXR0cmlidXRlcztcbiAgICBpZiAoT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhdHRyID0gT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcylcbiAgICAgICAgLmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pXG4gICAgICAgIC5yZWR1Y2UoKG9iaiwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgb2JqW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSwge30gYXMgQXR0cmlidXRlcyk7XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhhdHRyKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGF0dHI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIHJlbW92ZUF0dHJpYnV0ZShrZXk6IHN0cmluZywgdmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5fYXR0cmlidXRlc1trZXldKSB7XG4gICAgICBpZiAodmFsdWUgJiYgdGhpcy5fYXR0cmlidXRlc1trZXldID09PSB2YWx1ZSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fYXR0cmlidXRlc1trZXldO1xuICAgICAgfSBlbHNlIGlmICghdmFsdWUpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2F0dHJpYnV0ZXNba2V5XTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAodmFsdWUgJiYgdGhpc1trZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEF0dHJpYnV0ZXMoYXR0cmlidXRlczogb2JqZWN0KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLl9hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIC8vdGhpcy5fYXR0cmlidXRlc1trZXldID0gdmFsdWU7XG4gICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgICAgICAgLy8gc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MTQxMjEwL2hvdy1kby1pLXVuZG8tYS1vYmplY3QtZGVmaW5lcHJvcGVydHktY2FsbFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fYXR0cmlidXRlc1trZXldID0gdmFsO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBhY3R1YWwgeG1sIGRhdGFcbiAgICovXG4gIGFzeW5jIGdldFhtbChpc0ZyYWdtZW50ID0gZmFsc2UpIHtcbiAgICBjb25zdCBwcmVwYXJlZE9iamVjdCA9IHRoaXMucHJlcGFyZUZvclhtbCgpO1xuICAgIGNvbnN0IHhtbCA9IGF3YWl0IGdlbmVyYXRlWG1sKHByZXBhcmVkT2JqZWN0LCBpc0ZyYWdtZW50KTtcbiAgICByZXR1cm4geG1sO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgc2VsZiBpbnRvIGEgcGxhaW4gZGF0YSBvYmplY3QsIHJlY3Vyc2luZyBjaGlsZHJlbiBhcyBuZWVkZWQuXG4gICAqIFRoaXMgZGF0YSBjYW4gYmUgcGFzc2VkIHRvIHhtbDJKcyBidWlsZGVyIG1ldGhvZCB0byBjb252ZXJ0IHRvIHhtbFxuICAgKi9cbiAgcHJlcGFyZUZvclhtbCgpOiBvYmplY3Qge1xuICAgIGxldCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cbiAgICBjb25zdCBkYXRhRWxlbWVudCA9IHRoaXM7XG5cbiAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YUVsZW1lbnQpKSB7XG4gICAgICBpZiAoa2V5ID09PSBcIl9hdHRyaWJ1dGVzXCIpIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IHRoaXMuZ2V0RmlsdGVyZWRBdHRyaWJ1dGVzKCk7XG4gICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgZGF0YS5hdHRyID0gYXR0cjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwidmFsdWVcIiAmJiB2YWx1ZSkge1xuICAgICAgICBkYXRhLnZhbCA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGFFbGVtZW50KSB7XG4gICAgICAgIC8vIHRoaXMgaXMgYSBjaGlsZCBkYXRhRWxlbWVudFxuICAgICAgICBjb25zdCBjaGlsZERhdGE6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB2YWx1ZS5wcmVwYXJlRm9yWG1sKCk7XG4gICAgICAgIGRhdGFbdmFsdWUuZWxlbWVudF0gPSBjaGlsZERhdGFbdmFsdWUuZWxlbWVudF07XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gaWYgZW50cnkgaXMgYW4gYXJyYXksIHJlY3Vyc2UgdGhyb3VnaCBpdCBhcyBjaGlsZHJlbiBvYmplY3RzXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG4gICAgICAgIHZhbHVlLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hpbGREYXRhID0gY2hpbGQucHJlcGFyZUZvclhtbCgpO1xuXG4gICAgICAgICAgLy8gaWYgY2hpbGRyZW5bY2hpbGQuZWxlbWVudF0gYXJyYXkgaXMgYWxyZWFkeSBkZWZpbmVkLCBhZGQgdG8gaXQuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW5bY2hpbGQuZWxlbWVudF0pKSB7XG4gICAgICAgICAgICBjaGlsZHJlbltjaGlsZC5lbGVtZW50XS5wdXNoKGNoaWxkRGF0YVtjaGlsZC5lbGVtZW50XSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBtYWtlIGEgbmV3IGFycmF5XG4gICAgICAgICAgICBjaGlsZHJlbltjaGlsZC5lbGVtZW50XSA9IFtjaGlsZERhdGFbY2hpbGQuZWxlbWVudF1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGF0YSwgY2hpbGRyZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IFt0aGlzLmVsZW1lbnRdOiBkYXRhIH07XG4gIH1cbn1cbiJdfQ==
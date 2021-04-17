"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.parseXml = parseXml;exports.generateXml = generateXml;exports.filterAttributes = filterAttributes;exports.prepareItemsForXml = prepareItemsForXml;exports.prepareItemForXml = prepareItemForXml;var _xml2js = _interopRequireDefault(require("xml2js"));
var _es6Promisify = require("es6-promisify");
var _dataElement = _interopRequireDefault(require("../data-element.ts"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _iterableToArrayLimit(arr, i) {if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var parseOptions = {
  attrkey: "attr",
  charkey: "val",
  explicitCharkey: true,
  normalizeTags: true,
  trim: true,
  attrNameProcessors: [function (name) {return name.toLowerCase();}]

  // TODO: test async: true
};
var buildOptions = {
  attrkey: "attr",
  charkey: "val",
  xmldec: { version: "1.0", encoding: "UTF-8" } };function


parseXml(_x) {return _parseXml.apply(this, arguments);}function _parseXml() {_parseXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
  data) {var normalizeTagCase,normalizeAttrCase,result,options,_args = arguments;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            normalizeTagCase = _args.length > 1 && _args[1] !== undefined ? _args[1] : true;
            normalizeAttrCase = _args.length > 2 && _args[2] !== undefined ? _args[2] : true;


            options = parseOptions;

            if (!normalizeTagCase) {
              delete options.normalizeTags;
            }
            if (!normalizeAttrCase) {
              delete options.attrNameProcessors;
            }_context.prev = 5;_context.next = 8;return (


              (0, _es6Promisify.promisify)(_xml2js["default"].parseString)(data, parseOptions));case 8:result = _context.sent;return _context.abrupt("return",
            result);case 12:_context.prev = 12;_context.t0 = _context["catch"](5);

            console.warn("Error parsing xml:", _context.t0);return _context.abrupt("return");case 16:case "end":return _context.stop();}}}, _callee, null, [[5, 12]]);}));return _parseXml.apply(this, arguments);}function




generateXml(_x2) {return _generateXml.apply(this, arguments);}function _generateXml() {_generateXml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {var isFragment,options,builder,xml,_args2 = arguments;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:isFragment = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            if (isFragment) {
              options = Object.assign(buildOptions, {
                headless: true });

            }
            builder = new _xml2js["default"].Builder(buildOptions);
            xml = builder.buildObject(data);return _context2.abrupt("return",
            xml);case 5:case "end":return _context2.stop();}}}, _callee2);}));return _generateXml.apply(this, arguments);}


function filterAttributes(attributes) {
  if (Object.keys(attributes).length) {
    var attr = Object.entries(attributes).
    filter(function (_ref) {var _ref2 = _slicedToArray(_ref, 2),key = _ref2[0],value = _ref2[1];
      return value !== undefined;
    }).
    reduce(function (obj, _ref3) {var _ref4 = _slicedToArray(_ref3, 2),key = _ref4[0],value = _ref4[1];
      obj[key] = attributes[key];
      return obj;
    }, {});

    if (Object.keys(attr).length) {
      return attr;
    }
  }
  return undefined;
}

function prepareItemsForXml(items) {
  var dataList = {};
  items.forEach(function (item) {
    // const data = {};
    // if (item.attributes) {
    //   const attr = filterAttributes(item.attributes);
    //   if (attr) {
    //     data.attr = attr;
    //   }
    // }
    // if (item.value) {
    //   data.val = item.value;
    // }
    // if (Array.isArray(dataList[item.element])) {
    //   dataList[item.element].push(data);
    // } else {
    //   dataList[item.element] = [data];
    // }

    var preparedItem = prepareItemForXml(item);

    if (Array.isArray(dataList[item.element])) {
      dataList[item.element].push(preparedItem);
    } else {
      dataList[item.element] = [preparedItem];
    }
  });
  return dataList;
}

function prepareItemForXml(item) {
  var data = {};

  var entries = Object.entries(item);

  for (var _i2 = 0, _Object$entries = Object.entries(item); _i2 < _Object$entries.length; _i2++) {var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),key = _Object$entries$_i[0],value = _Object$entries$_i[1];
    //if (item.hasOwnProperty(key)) {
    if (key === "_attributes") {
      var attr = filterAttributes(value);
      if (attr) {
        data.attr = attr;
      }
    } else if (key === "value" && value) {
      data.val = value;
    } else if (value instanceof _dataElement["default"]) {
      // this is a child dataelement
      // TODO: handle recursion...
      //const child = value;

      data[value.element] = prepareItemForXml(value);
    } else if (Array.isArray(value) && value.length > 0) {
      var children = prepareItemsForXml(value);
      Object.assign(data, children);
    }
    //}
  }
  // if (item.attributes) {
  //   const attr = filterAttributes(item.attributes);
  //   if (attr) {
  //     data.attr = attr;
  //   }
  // }
  // if (item.value) {
  //   data.val = item.value;
  // }

  return data;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy94bWwuanMiXSwibmFtZXMiOlsicGFyc2VPcHRpb25zIiwiYXR0cmtleSIsImNoYXJrZXkiLCJleHBsaWNpdENoYXJrZXkiLCJub3JtYWxpemVUYWdzIiwidHJpbSIsImF0dHJOYW1lUHJvY2Vzc29ycyIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsImJ1aWxkT3B0aW9ucyIsInhtbGRlYyIsInZlcnNpb24iLCJlbmNvZGluZyIsInBhcnNlWG1sIiwiZGF0YSIsIm5vcm1hbGl6ZVRhZ0Nhc2UiLCJub3JtYWxpemVBdHRyQ2FzZSIsIm9wdGlvbnMiLCJ4bWwyanMiLCJwYXJzZVN0cmluZyIsInJlc3VsdCIsImNvbnNvbGUiLCJ3YXJuIiwiZ2VuZXJhdGVYbWwiLCJpc0ZyYWdtZW50IiwiT2JqZWN0IiwiYXNzaWduIiwiaGVhZGxlc3MiLCJidWlsZGVyIiwiQnVpbGRlciIsInhtbCIsImJ1aWxkT2JqZWN0IiwiZmlsdGVyQXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJrZXlzIiwibGVuZ3RoIiwiYXR0ciIsImVudHJpZXMiLCJmaWx0ZXIiLCJrZXkiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInJlZHVjZSIsIm9iaiIsInByZXBhcmVJdGVtc0ZvclhtbCIsIml0ZW1zIiwiZGF0YUxpc3QiLCJmb3JFYWNoIiwiaXRlbSIsInByZXBhcmVkSXRlbSIsInByZXBhcmVJdGVtRm9yWG1sIiwiQXJyYXkiLCJpc0FycmF5IiwiZWxlbWVudCIsInB1c2giLCJ2YWwiLCJEYXRhRWxlbWVudCIsImNoaWxkcmVuIl0sIm1hcHBpbmdzIjoibVJBQUE7QUFDQTtBQUNBLHlFOztBQUVBLElBQU1BLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsT0FBTyxFQUFFLE1BRFU7QUFFbkJDLEVBQUFBLE9BQU8sRUFBRSxLQUZVO0FBR25CQyxFQUFBQSxlQUFlLEVBQUUsSUFIRTtBQUluQkMsRUFBQUEsYUFBYSxFQUFFLElBSkk7QUFLbkJDLEVBQUFBLElBQUksRUFBRSxJQUxhO0FBTW5CQyxFQUFBQSxrQkFBa0IsRUFBRSxDQUFDLFVBQUNDLElBQUQsVUFBVUEsSUFBSSxDQUFDQyxXQUFMLEVBQVYsRUFBRDs7QUFFcEI7QUFSbUIsQ0FBckI7QUFVQSxJQUFNQyxZQUFZLEdBQUc7QUFDbkJSLEVBQUFBLE9BQU8sRUFBRSxNQURVO0FBRW5CQyxFQUFBQSxPQUFPLEVBQUUsS0FGVTtBQUduQlEsRUFBQUEsTUFBTSxFQUFFLEVBQUVDLE9BQU8sRUFBRSxLQUFYLEVBQWtCQyxRQUFRLEVBQUUsT0FBNUIsRUFIVyxFQUFyQixDOzs7QUFNc0JDLFEseUlBQWY7QUFDTEMsRUFBQUEsSUFESztBQUVMQyxZQUFBQSxnQkFGSywyREFFYyxJQUZkO0FBR0xDLFlBQUFBLGlCQUhLLDJEQUdlLElBSGY7OztBQU1EQyxZQUFBQSxPQU5DLEdBTVNqQixZQU5UOztBQVFMLGdCQUFJLENBQUNlLGdCQUFMLEVBQXVCO0FBQ3JCLHFCQUFPRSxPQUFPLENBQUNiLGFBQWY7QUFDRDtBQUNELGdCQUFJLENBQUNZLGlCQUFMLEVBQXdCO0FBQ3RCLHFCQUFPQyxPQUFPLENBQUNYLGtCQUFmO0FBQ0QsYUFiSTs7O0FBZ0JZLDJDQUFVWSxtQkFBT0MsV0FBakIsRUFBOEJMLElBQTlCLEVBQW9DZCxZQUFwQyxDQWhCWixTQWdCSG9CLE1BaEJHO0FBaUJJQSxZQUFBQSxNQWpCSjs7QUFtQkhDLFlBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG9CQUFiLGVBbkJHLDJHOzs7OztBQXdCZUMsVyxtSkFBZixrQkFBMkJULElBQTNCLG1MQUFpQ1UsVUFBakMsOERBQThDLEtBQTlDO0FBQ0wsZ0JBQUlBLFVBQUosRUFBZ0I7QUFDUlAsY0FBQUEsT0FEUSxHQUNFUSxNQUFNLENBQUNDLE1BQVAsQ0FBY2pCLFlBQWQsRUFBNEI7QUFDMUNrQixnQkFBQUEsUUFBUSxFQUFFLElBRGdDLEVBQTVCLENBREY7O0FBSWY7QUFDS0MsWUFBQUEsT0FORCxHQU1XLElBQUlWLG1CQUFPVyxPQUFYLENBQW1CcEIsWUFBbkIsQ0FOWDtBQU9DcUIsWUFBQUEsR0FQRCxHQU9PRixPQUFPLENBQUNHLFdBQVIsQ0FBb0JqQixJQUFwQixDQVBQO0FBUUVnQixZQUFBQSxHQVJGLDREOzs7QUFXQSxTQUFTRSxnQkFBVCxDQUEwQkMsVUFBMUIsRUFBc0M7QUFDM0MsTUFBSVIsTUFBTSxDQUFDUyxJQUFQLENBQVlELFVBQVosRUFBd0JFLE1BQTVCLEVBQW9DO0FBQ2xDLFFBQU1DLElBQUksR0FBR1gsTUFBTSxDQUFDWSxPQUFQLENBQWVKLFVBQWY7QUFDVkssSUFBQUEsTUFEVSxDQUNILGdCQUFrQixxQ0FBaEJDLEdBQWdCLFlBQVhDLEtBQVc7QUFDeEIsYUFBT0EsS0FBSyxLQUFLQyxTQUFqQjtBQUNELEtBSFU7QUFJVkMsSUFBQUEsTUFKVSxDQUlILFVBQUNDLEdBQUQsU0FBdUIsc0NBQWhCSixHQUFnQixZQUFYQyxLQUFXO0FBQzdCRyxNQUFBQSxHQUFHLENBQUNKLEdBQUQsQ0FBSCxHQUFXTixVQUFVLENBQUNNLEdBQUQsQ0FBckI7QUFDQSxhQUFPSSxHQUFQO0FBQ0QsS0FQVSxFQU9SLEVBUFEsQ0FBYjs7QUFTQSxRQUFJbEIsTUFBTSxDQUFDUyxJQUFQLENBQVlFLElBQVosRUFBa0JELE1BQXRCLEVBQThCO0FBQzVCLGFBQU9DLElBQVA7QUFDRDtBQUNGO0FBQ0QsU0FBT0ssU0FBUDtBQUNEOztBQUVNLFNBQVNHLGtCQUFULENBQTRCQyxLQUE1QixFQUFtQztBQUN4QyxNQUFNQyxRQUFRLEdBQUcsRUFBakI7QUFDQUQsRUFBQUEsS0FBSyxDQUFDRSxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFNQyxZQUFZLEdBQUdDLGlCQUFpQixDQUFDRixJQUFELENBQXRDOztBQUVBLFFBQUlHLEtBQUssQ0FBQ0MsT0FBTixDQUFjTixRQUFRLENBQUNFLElBQUksQ0FBQ0ssT0FBTixDQUF0QixDQUFKLEVBQTJDO0FBQ3pDUCxNQUFBQSxRQUFRLENBQUNFLElBQUksQ0FBQ0ssT0FBTixDQUFSLENBQXVCQyxJQUF2QixDQUE0QkwsWUFBNUI7QUFDRCxLQUZELE1BRU87QUFDTEgsTUFBQUEsUUFBUSxDQUFDRSxJQUFJLENBQUNLLE9BQU4sQ0FBUixHQUF5QixDQUFDSixZQUFELENBQXpCO0FBQ0Q7QUFDRixHQXhCRDtBQXlCQSxTQUFPSCxRQUFQO0FBQ0Q7O0FBRU0sU0FBU0ksaUJBQVQsQ0FBMkJGLElBQTNCLEVBQWlDO0FBQ3RDLE1BQUlsQyxJQUFJLEdBQUcsRUFBWDs7QUFFQSxNQUFNdUIsT0FBTyxHQUFHWixNQUFNLENBQUNZLE9BQVAsQ0FBZVcsSUFBZixDQUFoQjs7QUFFQSxzQ0FBeUJ2QixNQUFNLENBQUNZLE9BQVAsQ0FBZVcsSUFBZixDQUF6Qix1Q0FBK0Msa0VBQXJDVCxHQUFxQyx5QkFBaENDLEtBQWdDO0FBQzdDO0FBQ0EsUUFBSUQsR0FBRyxLQUFLLGFBQVosRUFBMkI7QUFDekIsVUFBTUgsSUFBSSxHQUFHSixnQkFBZ0IsQ0FBQ1EsS0FBRCxDQUE3QjtBQUNBLFVBQUlKLElBQUosRUFBVTtBQUNSdEIsUUFBQUEsSUFBSSxDQUFDc0IsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7QUFDRixLQUxELE1BS08sSUFBSUcsR0FBRyxLQUFLLE9BQVIsSUFBbUJDLEtBQXZCLEVBQThCO0FBQ25DMUIsTUFBQUEsSUFBSSxDQUFDeUMsR0FBTCxHQUFXZixLQUFYO0FBQ0QsS0FGTSxNQUVBLElBQUlBLEtBQUssWUFBWWdCLHVCQUFyQixFQUFrQztBQUN2QztBQUNBO0FBQ0E7O0FBRUExQyxNQUFBQSxJQUFJLENBQUMwQixLQUFLLENBQUNhLE9BQVAsQ0FBSixHQUFzQkgsaUJBQWlCLENBQUNWLEtBQUQsQ0FBdkM7QUFDRCxLQU5NLE1BTUEsSUFBSVcsS0FBSyxDQUFDQyxPQUFOLENBQWNaLEtBQWQsS0FBd0JBLEtBQUssQ0FBQ0wsTUFBTixHQUFlLENBQTNDLEVBQThDO0FBQ25ELFVBQU1zQixRQUFRLEdBQUdiLGtCQUFrQixDQUFDSixLQUFELENBQW5DO0FBQ0FmLE1BQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjWixJQUFkLEVBQW9CMkMsUUFBcEI7QUFDRDtBQUNEO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBTzNDLElBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB4bWwyanMgZnJvbSBcInhtbDJqc1wiO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcImVzNi1wcm9taXNpZnlcIjtcbmltcG9ydCBEYXRhRWxlbWVudCBmcm9tIFwiLi4vZGF0YS1lbGVtZW50LnRzXCI7XG5cbmNvbnN0IHBhcnNlT3B0aW9ucyA9IHtcbiAgYXR0cmtleTogXCJhdHRyXCIsXG4gIGNoYXJrZXk6IFwidmFsXCIsXG4gIGV4cGxpY2l0Q2hhcmtleTogdHJ1ZSxcbiAgbm9ybWFsaXplVGFnczogdHJ1ZSxcbiAgdHJpbTogdHJ1ZSxcbiAgYXR0ck5hbWVQcm9jZXNzb3JzOiBbKG5hbWUpID0+IG5hbWUudG9Mb3dlckNhc2UoKV0sXG5cbiAgLy8gVE9ETzogdGVzdCBhc3luYzogdHJ1ZVxufTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHtcbiAgYXR0cmtleTogXCJhdHRyXCIsXG4gIGNoYXJrZXk6IFwidmFsXCIsXG4gIHhtbGRlYzogeyB2ZXJzaW9uOiBcIjEuMFwiLCBlbmNvZGluZzogXCJVVEYtOFwiIH0sXG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGFyc2VYbWwoXG4gIGRhdGEsXG4gIG5vcm1hbGl6ZVRhZ0Nhc2UgPSB0cnVlLFxuICBub3JtYWxpemVBdHRyQ2FzZSA9IHRydWVcbikge1xuICBsZXQgcmVzdWx0O1xuICBsZXQgb3B0aW9ucyA9IHBhcnNlT3B0aW9ucztcblxuICBpZiAoIW5vcm1hbGl6ZVRhZ0Nhc2UpIHtcbiAgICBkZWxldGUgb3B0aW9ucy5ub3JtYWxpemVUYWdzO1xuICB9XG4gIGlmICghbm9ybWFsaXplQXR0ckNhc2UpIHtcbiAgICBkZWxldGUgb3B0aW9ucy5hdHRyTmFtZVByb2Nlc3NvcnM7XG4gIH1cblxuICB0cnkge1xuICAgIHJlc3VsdCA9IGF3YWl0IHByb21pc2lmeSh4bWwyanMucGFyc2VTdHJpbmcpKGRhdGEsIHBhcnNlT3B0aW9ucyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS53YXJuKFwiRXJyb3IgcGFyc2luZyB4bWw6XCIsIGVycik7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVhtbChkYXRhLCBpc0ZyYWdtZW50ID0gZmFsc2UpIHtcbiAgaWYgKGlzRnJhZ21lbnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihidWlsZE9wdGlvbnMsIHtcbiAgICAgIGhlYWRsZXNzOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoYnVpbGRPcHRpb25zKTtcbiAgY29uc3QgeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChkYXRhKTtcbiAgcmV0dXJuIHhtbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICBpZiAoT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgY29uc3QgYXR0ciA9IE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpXG4gICAgICAuZmlsdGVyKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZSgob2JqLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgb2JqW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LCB7fSk7XG5cbiAgICBpZiAoT2JqZWN0LmtleXMoYXR0cikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gYXR0cjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVJdGVtc0ZvclhtbChpdGVtcykge1xuICBjb25zdCBkYXRhTGlzdCA9IHt9O1xuICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgLy8gY29uc3QgZGF0YSA9IHt9O1xuICAgIC8vIGlmIChpdGVtLmF0dHJpYnV0ZXMpIHtcbiAgICAvLyAgIGNvbnN0IGF0dHIgPSBmaWx0ZXJBdHRyaWJ1dGVzKGl0ZW0uYXR0cmlidXRlcyk7XG4gICAgLy8gICBpZiAoYXR0cikge1xuICAgIC8vICAgICBkYXRhLmF0dHIgPSBhdHRyO1xuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgICAvLyBpZiAoaXRlbS52YWx1ZSkge1xuICAgIC8vICAgZGF0YS52YWwgPSBpdGVtLnZhbHVlO1xuICAgIC8vIH1cbiAgICAvLyBpZiAoQXJyYXkuaXNBcnJheShkYXRhTGlzdFtpdGVtLmVsZW1lbnRdKSkge1xuICAgIC8vICAgZGF0YUxpc3RbaXRlbS5lbGVtZW50XS5wdXNoKGRhdGEpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICBkYXRhTGlzdFtpdGVtLmVsZW1lbnRdID0gW2RhdGFdO1xuICAgIC8vIH1cblxuICAgIGNvbnN0IHByZXBhcmVkSXRlbSA9IHByZXBhcmVJdGVtRm9yWG1sKGl0ZW0pO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YUxpc3RbaXRlbS5lbGVtZW50XSkpIHtcbiAgICAgIGRhdGFMaXN0W2l0ZW0uZWxlbWVudF0ucHVzaChwcmVwYXJlZEl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhTGlzdFtpdGVtLmVsZW1lbnRdID0gW3ByZXBhcmVkSXRlbV07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhdGFMaXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUl0ZW1Gb3JYbWwoaXRlbSkge1xuICBsZXQgZGF0YSA9IHt9O1xuXG4gIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhpdGVtKTtcblxuICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoaXRlbSkpIHtcbiAgICAvL2lmIChpdGVtLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICBpZiAoa2V5ID09PSBcIl9hdHRyaWJ1dGVzXCIpIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBmaWx0ZXJBdHRyaWJ1dGVzKHZhbHVlKTtcbiAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgIGRhdGEuYXR0ciA9IGF0dHI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwidmFsdWVcIiAmJiB2YWx1ZSkge1xuICAgICAgZGF0YS52YWwgPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0YUVsZW1lbnQpIHtcbiAgICAgIC8vIHRoaXMgaXMgYSBjaGlsZCBkYXRhZWxlbWVudFxuICAgICAgLy8gVE9ETzogaGFuZGxlIHJlY3Vyc2lvbi4uLlxuICAgICAgLy9jb25zdCBjaGlsZCA9IHZhbHVlO1xuXG4gICAgICBkYXRhW3ZhbHVlLmVsZW1lbnRdID0gcHJlcGFyZUl0ZW1Gb3JYbWwodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBwcmVwYXJlSXRlbXNGb3JYbWwodmFsdWUpO1xuICAgICAgT2JqZWN0LmFzc2lnbihkYXRhLCBjaGlsZHJlbik7XG4gICAgfVxuICAgIC8vfVxuICB9XG4gIC8vIGlmIChpdGVtLmF0dHJpYnV0ZXMpIHtcbiAgLy8gICBjb25zdCBhdHRyID0gZmlsdGVyQXR0cmlidXRlcyhpdGVtLmF0dHJpYnV0ZXMpO1xuICAvLyAgIGlmIChhdHRyKSB7XG4gIC8vICAgICBkYXRhLmF0dHIgPSBhdHRyO1xuICAvLyAgIH1cbiAgLy8gfVxuICAvLyBpZiAoaXRlbS52YWx1ZSkge1xuICAvLyAgIGRhdGEudmFsID0gaXRlbS52YWx1ZTtcbiAgLy8gfVxuXG4gIHJldHVybiBkYXRhO1xufVxuIl19
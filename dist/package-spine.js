"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageSpineItem = _interopRequireDefault(require("./package-spine-item"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _objectWithoutProperties(source, excluded) {if (source == null) return {};var target = _objectWithoutPropertiesLoose(source, excluded);var key, i;if (Object.getOwnPropertySymbols) {var sourceSymbolKeys = Object.getOwnPropertySymbols(source);for (i = 0; i < sourceSymbolKeys.length; i++) {key = sourceSymbolKeys[i];if (excluded.indexOf(key) >= 0) continue;if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;target[key] = source[key];}}return target;}function _objectWithoutPropertiesLoose(source, excluded) {if (source == null) return {};var target = {};var sourceKeys = Object.keys(source);var key, i;for (i = 0; i < sourceKeys.length; i++) {key = sourceKeys[i];if (excluded.indexOf(key) >= 0) continue;target[key] = source[key];}return target;}

class PackageSpine extends _packageElement.default {
  constructor(items = [], options = {}) {
    const attr = Object.assign(
    {
      id: undefined,
      "page-progression-direction": undefined,
      toc: undefined },

    options);


    super("spine", undefined, attr);

    this.items = [];

    items.forEach(itemData => {
      const { idref } = itemData,options = _objectWithoutProperties(itemData, ["idref"]);
      this.addItem(idref, options);
    });
  }

  addItem(idref, options = {}) {
    this.items.push(new _packageSpineItem.default(idref, options));
  }

  findItemWithId(id) {
    return this.items.find(item => {
      return item.id === id;
    });
  }

  removeItemWithId(id) {
    this.items = this.items.filter(item => {
      return item.id !== id;
    });
  }

  findItemWithIdref(idref) {
    return this.items.find(item => {
      return item.idref === idref;
    });
  }

  removeItemWithIdref(idref) {
    this.items = this.items.filter(item => {
      return item.idref !== idref;
    });
  }

  findItemsWithLinear(value) {
    return this.items.filter(item => {
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
  }}exports.default = PackageSpine;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLXNwaW5lLmpzIl0sIm5hbWVzIjpbIlBhY2thZ2VTcGluZSIsIlBhY2thZ2VFbGVtZW50IiwiY29uc3RydWN0b3IiLCJpdGVtcyIsIm9wdGlvbnMiLCJhdHRyIiwiT2JqZWN0IiwiYXNzaWduIiwiaWQiLCJ1bmRlZmluZWQiLCJ0b2MiLCJmb3JFYWNoIiwiaXRlbURhdGEiLCJpZHJlZiIsImFkZEl0ZW0iLCJwdXNoIiwiUGFja2FnZVNwaW5lSXRlbSIsImZpbmRJdGVtV2l0aElkIiwiZmluZCIsIml0ZW0iLCJyZW1vdmVJdGVtV2l0aElkIiwiZmlsdGVyIiwiZmluZEl0ZW1XaXRoSWRyZWYiLCJyZW1vdmVJdGVtV2l0aElkcmVmIiwiZmluZEl0ZW1zV2l0aExpbmVhciIsInZhbHVlIiwibGluZWFyIiwiZmluZEl0ZW1zV2l0aEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwia2V5cyIsImV2ZXJ5Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiXSwibWFwcGluZ3MiOiJvR0FBQTtBQUNBLGdGOztBQUVlLE1BQU1BLFlBQU4sU0FBMkJDLHVCQUEzQixDQUEwQztBQUN2REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFLLEdBQUcsRUFBVCxFQUFhQyxPQUFPLEdBQUcsRUFBdkIsRUFBMkI7QUFDcEMsVUFBTUMsSUFBSSxHQUFHQyxNQUFNLENBQUNDLE1BQVA7QUFDWDtBQUNFQyxNQUFBQSxFQUFFLEVBQUVDLFNBRE47QUFFRSxvQ0FBOEJBLFNBRmhDO0FBR0VDLE1BQUFBLEdBQUcsRUFBRUQsU0FIUCxFQURXOztBQU1YTCxJQUFBQSxPQU5XLENBQWI7OztBQVNBLFVBQU0sT0FBTixFQUFlSyxTQUFmLEVBQTBCSixJQUExQjs7QUFFQSxTQUFLRixLQUFMLEdBQWEsRUFBYjs7QUFFQUEsSUFBQUEsS0FBSyxDQUFDUSxPQUFOLENBQWVDLFFBQUQsSUFBYztBQUMxQixZQUFNLEVBQUVDLEtBQUYsS0FBd0JELFFBQTlCLENBQWtCUixPQUFsQiw0QkFBOEJRLFFBQTlCO0FBQ0EsV0FBS0UsT0FBTCxDQUFhRCxLQUFiLEVBQW9CVCxPQUFwQjtBQUNELEtBSEQ7QUFJRDs7QUFFRFUsRUFBQUEsT0FBTyxDQUFDRCxLQUFELEVBQVFULE9BQU8sR0FBRyxFQUFsQixFQUFzQjtBQUMzQixTQUFLRCxLQUFMLENBQVdZLElBQVgsQ0FBZ0IsSUFBSUMseUJBQUosQ0FBcUJILEtBQXJCLEVBQTRCVCxPQUE1QixDQUFoQjtBQUNEOztBQUVEYSxFQUFBQSxjQUFjLENBQUNULEVBQUQsRUFBSztBQUNqQixXQUFPLEtBQUtMLEtBQUwsQ0FBV2UsSUFBWCxDQUFpQkMsSUFBRCxJQUFVO0FBQy9CLGFBQU9BLElBQUksQ0FBQ1gsRUFBTCxLQUFZQSxFQUFuQjtBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVEWSxFQUFBQSxnQkFBZ0IsQ0FBQ1osRUFBRCxFQUFLO0FBQ25CLFNBQUtMLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdrQixNQUFYLENBQW1CRixJQUFELElBQVU7QUFDdkMsYUFBT0EsSUFBSSxDQUFDWCxFQUFMLEtBQVlBLEVBQW5CO0FBQ0QsS0FGWSxDQUFiO0FBR0Q7O0FBRURjLEVBQUFBLGlCQUFpQixDQUFDVCxLQUFELEVBQVE7QUFDdkIsV0FBTyxLQUFLVixLQUFMLENBQVdlLElBQVgsQ0FBaUJDLElBQUQsSUFBVTtBQUMvQixhQUFPQSxJQUFJLENBQUNOLEtBQUwsS0FBZUEsS0FBdEI7QUFDRCxLQUZNLENBQVA7QUFHRDs7QUFFRFUsRUFBQUEsbUJBQW1CLENBQUNWLEtBQUQsRUFBUTtBQUN6QixTQUFLVixLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFXa0IsTUFBWCxDQUFtQkYsSUFBRCxJQUFVO0FBQ3ZDLGFBQU9BLElBQUksQ0FBQ04sS0FBTCxLQUFlQSxLQUF0QjtBQUNELEtBRlksQ0FBYjtBQUdEOztBQUVEVyxFQUFBQSxtQkFBbUIsQ0FBQ0MsS0FBRCxFQUFRO0FBQ3pCLFdBQU8sS0FBS3RCLEtBQUwsQ0FBV2tCLE1BQVgsQ0FBbUJGLElBQUQsSUFBVTtBQUNqQyxVQUFJTSxLQUFLLEtBQUssSUFBZCxFQUFvQjtBQUNsQixlQUFPTixJQUFJLENBQUNPLE1BQUwsS0FBZ0IsSUFBdkI7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPUCxJQUFJLENBQUNPLE1BQUwsS0FBZ0IsSUFBdkI7QUFDRDtBQUNGLEtBTk0sQ0FBUDtBQU9EOztBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFQyxFQUFBQSx1QkFBdUIsQ0FBQ0MsVUFBRCxFQUFhO0FBQ2xDLFdBQU8sS0FBS3pCLEtBQUwsQ0FBV2tCLE1BQVgsQ0FBbUJGLElBQUQsSUFBVTtBQUNqQyxhQUFPYixNQUFNLENBQUN1QixJQUFQLENBQVlELFVBQVosRUFBd0JFLEtBQXhCLENBQStCQyxHQUFELElBQVM7QUFDNUMsWUFBSVosSUFBSSxDQUFDYSxjQUFMLENBQW9CRCxHQUFwQixDQUFKLEVBQThCO0FBQzVCLGNBQUlILFVBQVUsQ0FBQ0csR0FBRCxDQUFWLEtBQW9CdEIsU0FBeEIsRUFBbUM7QUFDakMsbUJBQU9VLElBQUksQ0FBQ1ksR0FBRCxDQUFKLEtBQWNILFVBQVUsQ0FBQ0csR0FBRCxDQUEvQjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsZUFBTyxLQUFQO0FBQ0QsT0FUTSxDQUFQO0FBVUQsS0FYTSxDQUFQO0FBWUQsR0E5RXNELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFja2FnZUVsZW1lbnQgZnJvbSBcIi4vcGFja2FnZS1lbGVtZW50XCI7XG5pbXBvcnQgUGFja2FnZVNwaW5lSXRlbSBmcm9tIFwiLi9wYWNrYWdlLXNwaW5lLWl0ZW1cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZVNwaW5lIGV4dGVuZHMgUGFja2FnZUVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihpdGVtcyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhdHRyID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgXCJwYWdlLXByb2dyZXNzaW9uLWRpcmVjdGlvblwiOiB1bmRlZmluZWQsXG4gICAgICAgIHRvYzogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuXG4gICAgc3VwZXIoXCJzcGluZVwiLCB1bmRlZmluZWQsIGF0dHIpO1xuXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbURhdGEpID0+IHtcbiAgICAgIGNvbnN0IHsgaWRyZWYsIC4uLm9wdGlvbnMgfSA9IGl0ZW1EYXRhO1xuICAgICAgdGhpcy5hZGRJdGVtKGlkcmVmLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZEl0ZW0oaWRyZWYsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuaXRlbXMucHVzaChuZXcgUGFja2FnZVNwaW5lSXRlbShpZHJlZiwgb3B0aW9ucykpO1xuICB9XG5cbiAgZmluZEl0ZW1XaXRoSWQoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5pZCA9PT0gaWQ7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVJdGVtV2l0aElkKGlkKSB7XG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5pZCAhPT0gaWQ7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kSXRlbVdpdGhJZHJlZihpZHJlZikge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmlkcmVmID09PSBpZHJlZjtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZUl0ZW1XaXRoSWRyZWYoaWRyZWYpIHtcbiAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmlkcmVmICE9PSBpZHJlZjtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRJdGVtc1dpdGhMaW5lYXIodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gXCJub1wiKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmxpbmVhciA9PT0gXCJub1wiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0ubGluZWFyICE9PSBcIm5vXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgaXRlbXMgdGhhdCBoYXZlIGFsbCBvZiB0aGUgYXR0cmlidXRlcyBsaXN0ZWQgaW4gdGhlIHByb3ZpZGVkIG9iamVjdC5cbiAgICogSWYgdGhlIG9uamVjdCBhdHRyaWJ1dGUncyB2YWx1ZSBpcyB1bmRlZmluZWQsIHRoZW4gb25seSB0aGUgYXR0cmlidXRlIG5hbWVcbiAgICogaXMgbWF0Y2hlZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGF0dHJpYnV0ZXNcbiAgICovXG4gIGZpbmRJdGVtc1dpdGhBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5ldmVyeSgoa2V5KSA9PiB7XG4gICAgICAgIGlmIChpdGVtLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAoYXR0cmlidXRlc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2tleV0gPT09IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=
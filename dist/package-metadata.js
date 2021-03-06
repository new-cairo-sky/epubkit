"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _uuid = require("uuid");
var _packageElement = _interopRequireDefault(require("./package-element"));
var _packageMetadataItem = _interopRequireDefault(require("./package-metadata-item"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// TODO: add date modified meta element on save

class PackageMetadata extends _packageElement.default {
  constructor(items = [], attributes = {}) {
    const attr = Object.assign(
    {
      "xmlns:dc": "http://purl.org/dc/elements/1.1/" },

    attributes);


    super("metadata", undefined, attr);

    const requiredMetadata = [
    // { element: "dc:identifier", value: `urn:uuid:${uuidv4()}` },
    { element: "dc:title", value: "Untitled" },
    { element: "dc:language", value: "en-US" }
    // { element: "meta", value: undefined, attributes: {property: "dcterms:modified"}}
    ];

    const neededMetadata = requiredMetadata.filter(requiredItem => {
      return (
        items.findIndex(item => {
          return item.element === requiredItem.element;
        }) === -1);

    });

    this.items = items.concat(neededMetadata).map(itemData => {
      return new _packageMetadataItem.default(
      itemData.element,
      itemData.value,
      itemData === null || itemData === void 0 ? void 0 : itemData.attributes);

    });
  }

  addItem(element, value = "", attributes = {}) {
    this.items.push(new _packageMetadataItem.default(element, value, attributes));
  }

  removeItemsWithName(element) {
    this.items = this.items.filter(item => {
      item.element !== element;
    });
  }

  findItemsWithName(element) {
    return this.items.filter(item => {
      return item.element === element;
    });
  }

  findItemWithId(element, id) {
    return this.items.find(item => {
      return item.element === element && item.id === id;
    });
  }

  removeItemWithId(element, id) {
    this.items = this.items.filter(item => {
      item.element !== element && item.id !== id;
    });
  }

  /**
   * Finds items that have all of the attributes listed in the provided object.
   * If the object attribute's value is undefined, then only the attribute name
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
  }}exports.default = PackageMetadata;module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLW1ldGFkYXRhLmpzIl0sIm5hbWVzIjpbIlBhY2thZ2VNZXRhZGF0YSIsIlBhY2thZ2VFbGVtZW50IiwiY29uc3RydWN0b3IiLCJpdGVtcyIsImF0dHJpYnV0ZXMiLCJhdHRyIiwiT2JqZWN0IiwiYXNzaWduIiwidW5kZWZpbmVkIiwicmVxdWlyZWRNZXRhZGF0YSIsImVsZW1lbnQiLCJ2YWx1ZSIsIm5lZWRlZE1ldGFkYXRhIiwiZmlsdGVyIiwicmVxdWlyZWRJdGVtIiwiZmluZEluZGV4IiwiaXRlbSIsImNvbmNhdCIsIm1hcCIsIml0ZW1EYXRhIiwiUGFja2FnZU1ldGFkYXRhSXRlbSIsImFkZEl0ZW0iLCJwdXNoIiwicmVtb3ZlSXRlbXNXaXRoTmFtZSIsImZpbmRJdGVtc1dpdGhOYW1lIiwiZmluZEl0ZW1XaXRoSWQiLCJpZCIsImZpbmQiLCJyZW1vdmVJdGVtV2l0aElkIiwiZmluZEl0ZW1zV2l0aEF0dHJpYnV0ZXMiLCJrZXlzIiwiZXZlcnkiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Im9HQUFBO0FBQ0E7QUFDQSxzRjs7QUFFQTs7QUFFZSxNQUFNQSxlQUFOLFNBQThCQyx1QkFBOUIsQ0FBNkM7QUFDMURDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBSyxHQUFHLEVBQVQsRUFBYUMsVUFBVSxHQUFHLEVBQTFCLEVBQThCO0FBQ3ZDLFVBQU1DLElBQUksR0FBR0MsTUFBTSxDQUFDQyxNQUFQO0FBQ1g7QUFDRSxrQkFBWSxrQ0FEZCxFQURXOztBQUlYSCxJQUFBQSxVQUpXLENBQWI7OztBQU9BLFVBQU0sVUFBTixFQUFrQkksU0FBbEIsRUFBNkJILElBQTdCOztBQUVBLFVBQU1JLGdCQUFnQixHQUFHO0FBQ3ZCO0FBQ0EsTUFBRUMsT0FBTyxFQUFFLFVBQVgsRUFBdUJDLEtBQUssRUFBRSxVQUE5QixFQUZ1QjtBQUd2QixNQUFFRCxPQUFPLEVBQUUsYUFBWCxFQUEwQkMsS0FBSyxFQUFFLE9BQWpDO0FBQ0E7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eUQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XG5pbXBvcnQgUGFja2FnZUVsZW1lbnQgZnJvbSBcIi4vcGFja2FnZS1lbGVtZW50XCI7XG5pbXBvcnQgUGFja2FnZU1ldGFkYXRhSXRlbSBmcm9tIFwiLi9wYWNrYWdlLW1ldGFkYXRhLWl0ZW1cIjtcblxuLy8gVE9ETzogYWRkIGRhdGUgbW9kaWZpZWQgbWV0YSBlbGVtZW50IG9uIHNhdmVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZU1ldGFkYXRhIGV4dGVuZHMgUGFja2FnZUVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihpdGVtcyA9IFtdLCBhdHRyaWJ1dGVzID0ge30pIHtcbiAgICBjb25zdCBhdHRyID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgXCJ4bWxuczpkY1wiOiBcImh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvXCIsXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlc1xuICAgICk7XG5cbiAgICBzdXBlcihcIm1ldGFkYXRhXCIsIHVuZGVmaW5lZCwgYXR0cik7XG5cbiAgICBjb25zdCByZXF1aXJlZE1ldGFkYXRhID0gW1xuICAgICAgLy8geyBlbGVtZW50OiBcImRjOmlkZW50aWZpZXJcIiwgdmFsdWU6IGB1cm46dXVpZDoke3V1aWR2NCgpfWAgfSxcbiAgICAgIHsgZWxlbWVudDogXCJkYzp0aXRsZVwiLCB2YWx1ZTogXCJVbnRpdGxlZFwiIH0sXG4gICAgICB7IGVsZW1lbnQ6IFwiZGM6bGFuZ3VhZ2VcIiwgdmFsdWU6IFwiZW4tVVNcIiB9LFxuICAgICAgLy8geyBlbGVtZW50OiBcIm1ldGFcIiwgdmFsdWU6IHVuZGVmaW5lZCwgYXR0cmlidXRlczoge3Byb3BlcnR5OiBcImRjdGVybXM6bW9kaWZpZWRcIn19XG4gICAgXTtcblxuICAgIGNvbnN0IG5lZWRlZE1ldGFkYXRhID0gcmVxdWlyZWRNZXRhZGF0YS5maWx0ZXIoKHJlcXVpcmVkSXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaXRlbXMuZmluZEluZGV4KChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uZWxlbWVudCA9PT0gcmVxdWlyZWRJdGVtLmVsZW1lbnQ7XG4gICAgICAgIH0pID09PSAtMVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaXRlbXMgPSBpdGVtcy5jb25jYXQobmVlZGVkTWV0YWRhdGEpLm1hcCgoaXRlbURhdGEpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUGFja2FnZU1ldGFkYXRhSXRlbShcbiAgICAgICAgaXRlbURhdGEuZWxlbWVudCxcbiAgICAgICAgaXRlbURhdGEudmFsdWUsXG4gICAgICAgIGl0ZW1EYXRhPy5hdHRyaWJ1dGVzXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkSXRlbShlbGVtZW50LCB2YWx1ZSA9IFwiXCIsIGF0dHJpYnV0ZXMgPSB7fSkge1xuICAgIHRoaXMuaXRlbXMucHVzaChuZXcgUGFja2FnZU1ldGFkYXRhSXRlbShlbGVtZW50LCB2YWx1ZSwgYXR0cmlidXRlcykpO1xuICB9XG5cbiAgcmVtb3ZlSXRlbXNXaXRoTmFtZShlbGVtZW50KSB7XG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmVsZW1lbnQgIT09IGVsZW1lbnQ7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kSXRlbXNXaXRoTmFtZShlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5lbGVtZW50ID09PSBlbGVtZW50O1xuICAgIH0pO1xuICB9XG5cbiAgZmluZEl0ZW1XaXRoSWQoZWxlbWVudCwgaWQpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5lbGVtZW50ID09PSBlbGVtZW50ICYmIGl0ZW0uaWQgPT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlSXRlbVdpdGhJZChlbGVtZW50LCBpZCkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5lbGVtZW50ICE9PSBlbGVtZW50ICYmIGl0ZW0uaWQgIT09IGlkO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGl0ZW1zIHRoYXQgaGF2ZSBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgbGlzdGVkIGluIHRoZSBwcm92aWRlZCBvYmplY3QuXG4gICAqIElmIHRoZSBvYmplY3QgYXR0cmlidXRlJ3MgdmFsdWUgaXMgdW5kZWZpbmVkLCB0aGVuIG9ubHkgdGhlIGF0dHJpYnV0ZSBuYW1lXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAqL1xuICBmaW5kSXRlbXNXaXRoQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZXZlcnkoKGtleSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtrZXldID09PSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19
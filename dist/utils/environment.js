"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = environment; /**
 * get operating environment.
 * environment indicates if we are running in a browser or not.
 * @returns {string} - one of "browser" or "node"
 */
function environment() {var _process, _process$env;
  // for testing in jest we sometimes need to force the env node_env
  if ((_process = process) !== null && _process !== void 0 && (_process$env = _process.env) !== null && _process$env !== void 0 && _process$env.MOCK_ENV) {
    return process.env.MOCK_ENV;
  }
  return typeof window === "undefined" ? "node" : "browser";
}module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9lbnZpcm9ubWVudC5qcyJdLCJuYW1lcyI6WyJlbnZpcm9ubWVudCIsInByb2Nlc3MiLCJlbnYiLCJNT0NLX0VOViIsIndpbmRvdyJdLCJtYXBwaW5ncyI6IjBHQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxTQUFTQSxXQUFULEdBQXVCO0FBQ3BDO0FBQ0Esa0JBQUlDLE9BQUoscURBQUksU0FBU0MsR0FBYix5Q0FBSSxhQUFjQyxRQUFsQixFQUE0QjtBQUMxQixXQUFPRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBbkI7QUFDRDtBQUNELFNBQU8sT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQyxNQUFoQyxHQUF5QyxTQUFoRDtBQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGdldCBvcGVyYXRpbmcgZW52aXJvbm1lbnQuXG4gKiBlbnZpcm9ubWVudCBpbmRpY2F0ZXMgaWYgd2UgYXJlIHJ1bm5pbmcgaW4gYSBicm93c2VyIG9yIG5vdC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IC0gb25lIG9mIFwiYnJvd3NlclwiIG9yIFwibm9kZVwiXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVudmlyb25tZW50KCkge1xuICAvLyBmb3IgdGVzdGluZyBpbiBqZXN0IHdlIHNvbWV0aW1lcyBuZWVkIHRvIGZvcmNlIHRoZSBlbnYgbm9kZV9lbnZcbiAgaWYgKHByb2Nlc3M/LmVudj8uTU9DS19FTlYpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuTU9DS19FTlY7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBcIm5vZGVcIiA6IFwiYnJvd3NlclwiO1xufVxuIl19
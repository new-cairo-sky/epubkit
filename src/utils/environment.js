/**
 * get operating environment.
 * environment indicates if we are running in a browser or not.
 * @returns {string} - one of "browser" or "node"
 */
export default function environment() {
  // for testing in jest we sometimes need to force the env node_env
  if (process?.env?.MOCK_ENV) {
    return process.env.MOCK_ENV;
  }
  return typeof window === "undefined" ? "node" : "browser";
}

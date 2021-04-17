/**
 * BrowserFS's HTTPRequest backend requires a file index. This function takes a
 * epub's opf manifest and converts it a nested object in the form used by browserFS, eg:
  {
    "home": {
      "jvilk": {
      "someFile.txt": null,
      "someDir": {
          // Empty directory
        }
      }
    }
  }
 * NOTE: The path structure must be relative to the fetch relative operating path.

 * @param {array} manifest - an array of items returned from OpfManager.manifestItems
 * @param {string} epubPath - path to the epub dir
 * @param {string} manifestPath - path to the opf, relative to the epub base dir
 */
export function opfManifestToBrowserFsIndex(manifest: any, manifestEpubLocation: any): object;
/**
 * Converts a path string to a nested object
 * @param {string} pathString - the path to be converted
 * @param {object} fileIndex - the BrowserFS file index object to add file path to
 */
export function pathToObject(pathString: string, fileIndex?: object): object;

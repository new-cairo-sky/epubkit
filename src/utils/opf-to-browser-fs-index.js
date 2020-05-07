import path from "path";

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
export function opfManifestToBrowserFsIndex(manifest, manifestEpubLocation) {
  // the opf file itself is not in the manifest - add that frist

  const fileIndex = pathToObject(path.normalize(manifestEpubLocation));
  const mimetypePath = "mimetype";
  pathToObject(mimetypePath, fileIndex);
  const containerPath = "META-INF/container.xml";
  pathToObject(containerPath, fileIndex);

  // add all the files listed in the manifest.
  // const basePath = path.dirname(path.normalize(manifestPath));

  manifest.forEach((item) => {
    // const href = item.href;
    // const resolvedPath = path.join(basePath, href);
    pathToObject(item.location, fileIndex);
  });

  return fileIndex;
}

/**
 * Converts a path string to a nested object
 * @param {string} pathString - the path to be converted
 * @param {object} fileIndex - the BrowserFS file index object to add file path to
 */
export function pathToObject(pathString, fileIndex = {}) {
  let ref = fileIndex;
  const pathArray = path
    .normalize(path.dirname(pathString))
    .split(path.sep)
    .filter((part) => part !== ".");

  const fileName = path.basename(pathString);

  pathArray.forEach((pathPart, i) => {
    if (!!pathPart) {
      if (ref[pathPart]) {
        ref = ref[pathPart];
      } else {
        ref[pathPart] = {};
        ref = ref[pathPart];
      }
    }
  });
  ref[fileName] = null;
  return fileIndex;
}

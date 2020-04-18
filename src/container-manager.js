/**
 * Manager for the container.xml file
 * https://www.w3.org/publishing/epub32/epub-ocf.html
 */
class ContainerManager {
  constructor(path) {
    this._path = path;
    this._content = undefined;
  }

  init(data) {
    this._content = data;
  }

  get rootFilePath() {
    if (!this._content) {
      return;
    }
    const rootPath = this._content?.container?.rootfiles[0].rootfile[0]?.attr[
      "full-path"
    ];
    return rootPath;
  }

  get path() {
    return this._path;
  }

  get content() {
    return this._content;
  }
}

export default ContainerManager;

import path from "path";
import ContainerManager from "./container-manager";
import OpfManager from "./opf-manager";
import NcxManager from "./ncx-manager";
import FileManager from "./file-manager";

class EpubKit {
  constructor() {
    this._pathToSource = undefined;
    this._pathToEpubDir = undefined;

    this._loaded = false;

    /* paths to epub's internal files */
    this._containerPath = undefined;
    this._opfFilePath = undefined;
    this._ncxFilePath = undefined;
    this._navPath = undefined;

    /* managers */
    this._containerManager = new ContainerManager();
    this._opfManager = new OpfManager();
    this._ncxManager = new NcxManager();
  }

  /**
   * Load an epub archive file or directory
   * @param {string} location
   */
  async load(location) {
    this._pathToSource = path.resolve(location);

    const fileManager = new FileManager();
    console.log("pathToSource", this._pathToSource);

    // check if epub is an archive or a directory.
    if (fileManager.isEpubArchive(this._pathToSource)) {
      this._pathToEpubDir = await fileManager.prepareEpubArchive(
        this._pathToSource
      );
      console.log("pathToEpub", this._pathToEpubDir);
      if (!this._pathToEpubDir) {
        return;
      }
    } else {
      this._pathToEpubDir = this._pathToSource;
    }

    // find the container.xml file.
    const containerFilePath = path.resolve(
      this._pathToEpubDir,
      "./META-INF/container.xml"
    );
    const containerExists = await fileManager.fileExists(containerFilePath);

    if (!containerExists) {
      console.warn("container.xml not found at : ", containerFilePath);
      return;
    }

    await this._containerManager.loadFile(containerFilePath);

    const rootPath = this._containerManager.rootFilePath;

    // find the OPF file

    if (rootPath) {
      // if rootPath is found in the container.xml use that.
      this._opfFilePath = path.resolve(this._pathToEpubDir, rootPath);
    } else {
      // if containerXml is missing or is missing the rootFile, do a file search for the opf.
      const opfFilePath = await fileManager.findFilesWithExt(
        this._pathToEpubDir,
        "opf"
      );
      if (opfFilePath.length > 1) {
        console.warn("More than one OPF file found: ", opfFilePath);
      }
      this._opfFilePath = opfFilePath[0];
    }

    // load the OPF file
    if (!this._opfFilePath) {
      this._opfFilePath = undefined;
      throw "Opf file not found.";
    }

    try {
      await this._opfManager.loadFile(this._opfFilePath);
    } catch (e) {
      this._opfManager = undefined;
      throw e;
    }

    if (this._opfManager) {
      const tocPath = this._opfManager.findTocPath();
      if (tocPath && path.extname(tocPath) === ".ncx") {
        await this._ncxManager.loadFile(tocPath);
      }
    }

    // Load the NCX, if any
    try {
      this._ncxFilePath = this._opfManager.findNcxPath();
    } catch (e) {
      // epub may not have an ncx file.
      this._ncxFilePath = undefined;
      return;
    }

    if (this._ncxFilePath) {
      try {
        await this._ncxManager.loadFile(this._ncxFilePath);
      } catch (e) {
        this._ncxManager = undefined;
      }
    }

    this._loaded = true;
  }

  /**
   * Public Getters and Setters
   */

  /**
   * Get the epub input path
   */
  get pathToSource() {
    return this._pathToSource;
  }

  /**
   * Get the epub working directory.
   * Node: When epub is an archive, it will be decompressed to this tmp location.
   * Client: When epub is an archive, BrowserFS will load the zip at this virtual path.
   */
  get pathToEpubDir() {
    return this._pathToEpubDir;
  }

  get ncx() {
    return this._ncxManager;
  }

  get opfFilePath() {
    return this._opfFilePath;
  }

  get ncxFilePath() {
    return this._ncxFilePath;
  }
}

export default EpubKit;

import path from "path";
import ContainerManager from "./container-manager";
import OpfManager from "./opf-manager";
import NcxManager from "./ncx-manager";
import FileManager from "./file-manager";

class EpubKit {
  constructor(environment = "auto") {
    if (environment === "auto") {
      this._environment = typeof window === "undefined" ? "node" : "browser";
    } else {
      this._environment = environment;
    }

    this._pathToSource = undefined;
    this._pathToEpubDir = undefined;

    this._loaded = false;

    /* paths to epub's internal files */
    this._containerPath = undefined;
    this._opfFilePath = undefined;
    this._ncxFilePath = undefined;
    this._navPath = undefined;

    /* managers */
    this._fileManager = new FileManager(this._environment);

    this._containerManager = new ContainerManager();
    this._opfManager = new OpfManager();
    this._ncxManager = new NcxManager();
  }

  get fileManager() {
    return this._fileManager;
  }

  /**
   * Load an epub archive file or directory
   * @param {string} location
   */
  async load(location) {
    this._pathToSource = path.resolve(location);

    console.log("pathToSource", this._pathToSource);

    // check if epub is an archive or a directory.
    if (this._fileManager.isEpubArchive(this._pathToSource)) {
      this._pathToEpubDir = await this._fileManager.prepareEpubArchive(
        this._pathToSource
      );
    } else {
      this._pathToEpubDir = await this._fileManager.prepareEpubDir(
        this._pathToSource
      );
    }
    console.log("pathToEpub", this._pathToEpubDir);
    if (!this._pathToEpubDir) {
      return;
    }

    // find the container.xml file.
    const containerFilePath = path.resolve(
      this._pathToEpubDir,
      "./META-INF/container.xml"
    );
    const containerExists = await this._fileManager.fileExists(
      containerFilePath
    );

    if (!containerExists) {
      console.warn("container.xml not found at : ", containerFilePath);
      return;
    }

    const containerData = await this._fileManager.readXmlFile(
      containerFilePath
    );
    if (containerData) {
      this._containerManager.init(containerData);
    } else {
      console.error("Error reading container.xml file.");
      return;
    }

    const rootPath = this._containerManager.rootFilePath;

    /**
     * Find the OPF file
     */
    if (rootPath) {
      // if rootPath is found in the container.xml use that.
      this._opfFilePath = path.resolve(this._pathToEpubDir, rootPath);
    } else {
      // if containerXml is missing or is missing the rootFile, do a file search for the opf.
      const opfFilePath = await this._fileManager.findFilesWithExt(
        this._pathToEpubDir,
        "opf"
      );
      if (opfFilePath.length > 1) {
        console.warn("More than one OPF file found: ", opfFilePath);
      }
      this._opfFilePath = opfFilePath[0];
    }

    /**
     * load the OPF file
     */
    if (!this._opfFilePath) {
      this._opfFilePath = undefined;
      throw "Opf file not found.";
    }

    try {
      const opfData = await this._fileManager.readXmlFile(this._opfFilePath);
      await this._opfManager.init(opfData);
    } catch (e) {
      this._opfManager = undefined;
      throw e;
    }

    /**
     * If ncx file exists, initialize the NCX manager
     */
    if (this._opfManager) {
      const tocPath = this._opfManager.findTocPath();
      if (tocPath && path.extname(tocPath) === ".ncx") {
        this._ncxFilePath = path.join(path.dirname(this._opfFilePath), tocPath);
      }
    }

    // ncx is not listed in the TOC in the opf. look for ncx specifically.
    if (!this._ncxFilePath) {
      try {
        this._ncxFilePath = this._opfManager.findNcxPath();
      } catch (e) {
        // epub may not have an ncx file.
        this._ncxFilePath = undefined;
      }
    }

    if (this._ncxFilePath) {
      const ncxData = await this._fileManager.readXmlFile(this._ncxFilePath);
      if (ncxData) {
        this._ncxManager.init(ncxData);
      } else {
        this._ncxManager = undefined;
      }
    }

    this._loaded = true;
  }

  async saveAs(location) {
    await this._fileManager.saveEpubArchive(location);
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

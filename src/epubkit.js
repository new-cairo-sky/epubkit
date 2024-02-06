import path from "path";
import ContainerManager from "./container-manager";
import PackageManager from "./package-manager";
import NcxManager from "./ncx-manager";
import FileManager from "./file-manager";
import uniqWith from "lodash/uniqWith";

export default class Epubkit {
  constructor(environment = "auto") {
    if (environment === "auto") {
      this._environment = typeof window === "undefined" ? "node" : "browser";
    } else {
      this._environment = environment;
    }

    this._pathToSource = undefined;
    this._pathToEpubDir = undefined;

    this._loaded = false;

    /* paths to epub's internal files - all paths should be relative to the epub root */
    this._containerPath = undefined;
    this._opfFilePath = undefined;
    this._navigationFilePath = undefined;
    this._ncxFilePath = undefined;
    this._navPath = undefined;

    /* managers */
    this._containerManager = new ContainerManager();
    this._packageManager = new PackageManager();
    this._ncxManager = new NcxManager();
  }

  /**
   * Load an epub archive file or directory
   * @param {string} location - path to the epub file or directory
   */
  async load(location) {
    this._pathToSource = path.resolve(location);

    console.log("pathToSource", this._pathToSource);

    this._pathToEpubDir = await FileManager.loadEpub(this._pathToSource);

    console.log("pathToEpub", this._pathToEpubDir);
    if (!this._pathToEpubDir) {
      return;
    }

    // find the container.xml file.
    const containerFilePath = path.resolve(
      this._pathToEpubDir,
      "./META-INF/container.xml"
    );
    const containerExists = await FileManager.fileExists(containerFilePath);

    if (!containerExists) {
      console.warn("container.xml not found at : ", containerFilePath);
      return;
    }

    const containerData = await FileManager.readFile(containerFilePath);
    if (containerData) {
      await this._containerManager.loadXml(containerData);
    } else {
      console.error("Error reading container.xml file.");
      return;
    }

    this._containerPath = containerFilePath;

    const rootPath = this._containerManager.rootFilePath;

    /**
     * Find the OPF file
     */
    if (rootPath) {
      // if rootPath is found in the container.xml use that.
      this._opfFilePath = path.resolve(this._pathToEpubDir, rootPath);
    } else {
      // if containerXml is missing or is missing the rootFile, do a file search for the opf.
      const opfFilePath = await FileManager.findFilesWithExt(
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
      const opfData = await FileManager.readFile(this._opfFilePath);
      this._packageManager.location = FileManager.absolutePathToEpubLocation(
        this._pathToEpubDir,
        this._opfFilePath
      );
      await this._packageManager.loadXml(opfData);
    } catch (e) {
      this._packageManager = undefined;
      throw e;
    }

    /**
     * If ncx file exists, initialize the NCX manager
     */
    if (this._packageManager) {
      const tocLocation = this._packageManager.findNavigationFileLocation();
      if (tocLocation) {
        this._navigationFilePath = FileManager.epubLocationToAbsolutePath(
          this._pathToEpubDir,
          tocLocation
        );
        if (path.extname(this._navigationFilePath) === ".ncx") {
          this._ncxFilePath = this._navigationFilePath;
        }
      }
    }

    // ncx is not listed in the TOC in the opf. look for ncx specifically.
    if (!this._ncxFilePath) {
      try {
        const ncxLocation = this._packageManager.findNcxFileLocation();
        this._ncxFilePath = FileManager.epubLocationToAbsolutePath(
          this._pathToEpubDir,
          ncxLocation
        );
      } catch (e) {
        // epub may not have an ncx file.
        this._ncxFilePath = undefined;
      }
    }

    if (this._ncxFilePath) {
      const ncxData = await FileManager.readXmlFile(this._ncxFilePath);
      if (ncxData) {
        this._ncxManager.init(ncxData);
      } else {
        this._ncxManager = undefined;
      }
    }

    this._loaded = true;
  }

  /**
   * SaveAs the epub archive
   * @param {Promise<string>} location save epub at the give location
   */
  async saveAs(location) {
    await FileManager.saveEpubArchive(this._pathToEpubDir, location);
  }

  /**
   * Find all resources in the epub, excluding the epub's internal files.
   * This finds all files in the epub's root directory and subdirectories.
   * As well as all files listed in the manifest.
   * If a file is missing, the location will be undefined.
   * If a manifest item is missing, the id, href, mediaType, fallback, and mediaOverlay will be undefined.
   * @returns{Promise<{
   *  location: string|undefined,
   *  id: string|undefined,
   *  href: string|undefined,
   *  mediaType: string|undefined,
   *  fallback: string|undefined,
   *  mediaOverlay: string|undefined
   * }[]>}
   */
  async findAllResources() {
    // find all files in the epub
    const allFiles = await FileManager.findAllFiles(this._pathToEpubDir);
    // filter out the epub's internal files
    const internalFiles = [
      this._containerPath,
      this._opfFilePath,
      this._ncxFilePath,
      this._navPath,
    ];
    const resources = allFiles.filter((file) => {
      return internalFiles.indexOf(file) === -1;
    });

    const resourceData = resources.map((resource) => {
      const location = FileManager.absolutePathToEpubLocation(
        this._pathToEpubDir,
        resource
      );
      const opfLocation = FileManager.absolutePathToEpubLocation(
        this._pathToEpubDir,
        this._opfFilePath
      );
      const iri = FileManager.resolveEpubLocationToIri(location, opfLocation);

      const manifestItem = this._packageManager.manifest.findItemWithHref(iri);
      const data = {
        location,
        id: manifestItem?.id,
        href: manifestItem?.href,
        mediaType: manifestItem?.["media-type"],
        fallback: manifestItem?.fallback,
        mediaOverlay: manifestItem?.["media-overlay"],
      };
      return data;
    });
    const manifestData = this._packageManager.manifest.items.map((item) => {
      const data = {
        location: item.location,
        id: item.id,
        href: item.href,
        mediaType: item["media-type"],
        fallback: item.fallback,
        mediaOverlay: item["media-overlay"],
      };
      return data;
    });

    const allData = uniqWith(resourceData.concat(manifestData), (a, b) => {
      return a.location === b.location && a.id === b.id;
    });

    return allData;
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

  get opf() {
    return this._packageManager;
  }

  get opfFilePath() {
    return this._opfFilePath;
  }

  get ncxFilePath() {
    return this._ncxFilePath;
  }
}

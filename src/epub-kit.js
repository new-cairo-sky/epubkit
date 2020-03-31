//import fs from "fs";
import path from "path";
//import os from "os";

import ContainerManager from "./container-manager";
import OpfManager from "./opf-manager";
import NcxManager from "./ncx-manager";
import FileManager from "./file-manager";

class EpubKit {
  constructor(pathToEpub) {
    this.pathToSource = path.resolve(pathToEpub);
    this.pathToEpubDir = undefined;

    this._loaded = false;

    /* paths to epub's internal files */
    this._containerPath = undefined;
    this._opfFilePath = undefined;
    this._ncxFilePath = undefined;

    /* managers */
    this._containerManager = new ContainerManager();
    this._opfManager = new OpfManager();
    this._ncxManager = new NcxManager();
  }

  async load() {
    // check if epub is an archive or a directory.
    const fileManager = new FileManager();
    console.log("pathToSource", this.pathToSource);

    if (fileManager.isEpubArchive(this.pathToSource)) {
      this.pathToEpubDir = await fileManager.prepareEpubArchive(
        this.pathToSource
      );
      console.log("pathToEpub", this.pathToEpubDir);
      if (!this.pathToEpubDir) {
        return;
      }
    } else {
      this.pathToEpubDir = this.pathToSource;
    }

    const containerFilePath = path.resolve(
      this.pathToEpubDir,
      "./META-INF/container.xml"
    );
    const containerExists = await fileManager.fileExists(containerFilePath);

    if (!containerExists) {
      console.warn("container.xml not found at : ", containerFilePath);
    }

    await this._containerManager.loadFile(containerFilePath);

    const rootPath = this._containerManager.rootFilePath;

    if (rootPath) {
      // if rootPath is found in the container.xml use that.
      this._opfFilePath = path.resolve(this.pathToEpubDir, rootPath);
    } else {
      // if containerXml is missing or is missing the rootFile, do a file search for the opf.
      const opfFilePath = await fileManager.findFilesWithExt(
        this.pathToEpubDir,
        "opf"
      );
      if (opfFilePath.length > 1) {
        console.warn("More than one OPF file found: ", opfFilePath);
      }
      this._opfFilePath = opfFilePath[0];
    }

    if (this._opfFilePath) {
      await this._opfManager.loadFile(this._opfFilePath);
    }

    if (this._opfManager) {
      const tocPath = this._opfManager.findTocPath();
      if (tocPath && path.extname(tocPath) === ".ncx") {
        await this._ncxManager.loadFile(tocPath);
      }
    }

    this._loaded = true;
  }

  get ncx() {
    return this._ncxManager;
  }

  get opfFilePath() {
    return this._opfFilePath;
  }

  findNavFile() {
    if (!this._loaded) {
      return;
    }

    let tocHref = this._opfManager.findTocHref;
    if (!tocHref) {
      // toc property may be missing from OPF - look for the ncx
    }
  }
}

export default EpubKit;

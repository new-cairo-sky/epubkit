import fs from "fs";
import path from "path";
import os from "os";

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

    // check if epub is an archive or a directory.
    const stats = fs.statSync(this.pathToSource);
    if (stats.isFile()) {
      const tmpDir = os.tmpdir();
      const tmpPath = path.resolve(tmpDir, path.basename(this.pathToSource));
      const AdmZip = new AdmZip(this.pathToSource);
      AdmZip.extractAllTo(tmpPath, true);
      this.pathToEpubDir = tmpPath;
    } else {
      this.pathToEpubDir = this.pathToSource;
    }
  }

  async load() {
    const tmpPath = path.resolve(this.pathToEpubDir, "./3174/toc.ncx");
    const fileManager = new FileManager();

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

    await this._ncxManager.loadFile(tmpPath);

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
      // toc property may be missing from OPF
    }
  }
}

export default EpubKit;

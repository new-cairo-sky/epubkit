import fs from "fs";
import path from "path";
import os from "os";

import NcxManager from "./ncx-manager";
import FileManager from "./file-manager";

class EpubKit {
  constructor(pathToEpub) {
    this.pathToSource = path.resolve(pathToEpub);
    this.pathToEpubDir = undefined;

    this._opfFilePath = undefined;
    this._ncxFilePath = undefined;
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
    const opfFilePath = await fileManager.findFilesWithExt(
      this.pathToEpubDir,
      "opf"
    );
    if (opfFilePath.length > 1) {
      console.warn("More than one OPF file found: ", opfFilePath);
    }
    this._opfFilePath = opfFilePath[0];

    await this._ncxManager.loadFile(tmpPath);
  }

  get ncx() {
    return this._ncxManager;
  }

  get opfFilePath() {
    return this._opfFilePath;
  }
}

export default EpubKit;

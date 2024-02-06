import FileManager from "./file-manager";

class Resources {
  private fileManager: FileManager;

  constructor() {
    this.fileManager = new FileManager();
  }

  public async getResource(path: string) {
    return this.fileManager.readFile(path);
  }

  public async findAllResources() {
    const allFiles = await this.fileManager.findAllFiles();
  }
}

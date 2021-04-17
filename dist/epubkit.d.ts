export default class Epubkit {
    constructor(environment?: string);
    _environment: string;
    _pathToSource: string | undefined;
    _pathToEpubDir: string | undefined;
    _loaded: boolean;
    _containerPath: any;
    _opfFilePath: any;
    _navigationFilePath: string | undefined;
    _ncxFilePath: any;
    _navPath: any;
    _containerManager: ContainerManager;
    _packageManager: PackageManager;
    _ncxManager: NcxManager;
    /**
     * Load an epub archive file or directory
     * @param {string} location
     */
    load(location: string): Promise<void>;
    saveAs(location: any): Promise<void>;
    /**
     * Public Getters and Setters
     */
    /**
     * Get the epub input path
     */
    get pathToSource(): string | undefined;
    /**
     * Get the epub working directory.
     * Node: When epub is an archive, it will be decompressed to this tmp location.
     * Client: When epub is an archive, BrowserFS will load the zip at this virtual path.
     */
    get pathToEpubDir(): string | undefined;
    get ncx(): NcxManager;
    get opf(): PackageManager;
    get opfFilePath(): any;
    get ncxFilePath(): any;
}
import ContainerManager from "./container-manager";
import PackageManager from "./package-manager";
import NcxManager from "./ncx-manager";

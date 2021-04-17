export default FileManager;
/**
 * Most of the nasty details in managing the different environments is
 * contained in here.
 * This class wraps a lot of the node fs file system library methods.
 * For browser clients, the BroswerFS module is used to emulate Node FS and
 * FileSaver is used to enable client's to download documents for saving.
 * BrowserFS does not pollyfill the fs native promises, so many fs methods
 * are wrapped with promisify below.
 *
 * see also:
 * https://github.com/jvilk/BrowserFS
 * https://github.com/browserify/path-browserify
 *
 */
declare class FileManager {
    static get virtualPath(): string;
    /**
     * Public class property environment.
     * environment indicates if we are running in a browser or not.
     * @returns {string} - one of "browser" or "node"
     */
    static get environment(): string;
    static loadEpub(location: any, fetchOptions?: {}): Promise<string | undefined>;
    /**
     * Saves the epub archive to the given location. In the browser,
     * the user will be prompted to set the file download location.
     * This method relies on JSZip for ziping the archive in both client and node
     * TODO: if testing shows that JSZip is not best for node, consider using
     * archiver: https://github.com/archiverjs/node-archiver
     * epub zip spec: https://www.w3.org/publishing/epub3/epub-ocf.html#sec-zip-container-zipreqs
     * @param {string} location - destination path to save epub to
     * @param {boolean} compress - flag to enable archive compression
     */
    static saveEpubArchive(sourceLocation: any, saveLocation: any, compress?: boolean): Promise<void>;
    /**
     * When loading an Epub directory in a browser client, the files
     * are fetched lazily by BrowserFS and saved to localStorage.
     *
     * @param {string} location
     */
    static prepareEpubDir(location: string, fetchOptions?: {}): Promise<string | undefined>;
    /**
     * Loads and unarchives an .epub file to a tmp working directory
     * When in browser client, BrowserFS will unzip the archive to the virtual path `${FileManager.virtualPath}/zip`
     *
     * @param {string} location - the url or path to an .epub file
     * @returns {string} - the path to the tmp location
     */
    static prepareEpubArchive(location: string, fetchOptions?: {}): string;
    /**
     * Test if file is a .epub archive
     * @param {string} location - path to file
     * @returns {boolean}
     */
    static isEpubArchive(location: string): boolean;
    /**
     * A wrapepr for the fs.stat method
     * @param {string} location
     * @returns {object} - stats object
     */
    static getStats(location: string): object;
    /**
     * Wrapper for stats isDirectory()
     * @param {string} location
     * @returns {boolean}
     */
    static isDir(location: string): boolean;
    /**
     * Wrapper for stats isFile()
     * @param {string} location
     * @returns {boolean}
     */
    static isFile(location: string): boolean;
    /**
     * Read entire file and return the data
     * if no encoding is set, a raw buffer is returned.
     * Use 'utf8' for string
     * @param {string} location
     */
    static readFile(location: string, encoding?: any): Promise<any>;
    /**
     * Read a XML file and parse it into a json object using xml2js
     * @param {string} - location
     * @returns {object} - a json object
     */
    static readXmlFile(location: any): object;
    /**
     * Recursively searches a directory and returns a flat array of all files
     *
     * @param {string} directoryName - the base directory to search
     * @param {array} _results - private. holds _results for recursive search
     * @returns {array} - an array of file path strings
     */
    static findAllFiles(directoryName: string, _results?: any): any;
    /**
     * Get the contents of a directory
     * @param {string} directory
     * @returns {array}
     */
    static readDir(directory: string): any;
    /**
     * Recursively search directory for files with the given extension
     *
     * @param {string} directoryName - the dir to start search in
     * @param {string} findExt - the file extension to search for
     * @param {array} _results - private. holds results for recursive search
     * @returns {array} - an array of file path strings
     */
    static findFilesWithExt(directoryName: string, findExt: string, _results?: any): any;
    /**
     * Checks if a file already exists at the given location
     *
     * @param {string} path - file path to test
     * @returns {boolean}
     */
    static fileExists(path: string): boolean;
    /**
     * Checks if a directory already exists at the given location
     * @param {string} path - dir to test
     * @returns {boolean}
     */
    static dirExists(path: string): boolean;
    /**
     * Recursive directory copy
     * @param {string} src - path to the directory to copy
     * @param {string} dest - path to the copy destination
     */
    static copyDir(src: string, dest: string): Promise<void>;
    /**
     * A wrapper for os.tmpdir that resolves symlinks
     * see: https://github.com/nodejs/node/issues/11422
     */
    static getTmpDir(): Promise<any>;
    static resolveIriToEpubLocation(iri: any, referencePath: any): any;
    static absolutePathToEpubLocation(epubPath: any, resourcePath: any): string;
    static epubLocationToAbsolutePath(epubPath: any, resourcePath: any): string;
}

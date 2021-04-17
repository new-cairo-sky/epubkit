export default NcxManager;
declare class NcxManager {
    _content: any;
    init(jsonData: any): void;
    loadXml(): Promise<void>;
    rawData: object | undefined;
    oldloadFile(newPath: any): Promise<any>;
    _path: any;
    get content(): any;
}

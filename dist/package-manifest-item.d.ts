export default class PackageManifestItem extends PackageElement {
    constructor(id: any, href: any, mediaType: any, options?: {}, opfLocation?: string);
    _opfLocation: string;
    set opfLocation(arg: string);
    get opfLocation(): string;
    /**
     * If href is relative, get's the href location as relative to the epub's root.
     */
    get location(): any;
}
import PackageElement from "./package-element";

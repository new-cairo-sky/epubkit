import PackageElement from "./package-element";
import PackageMetadata from "./package-metadata";
import PackageManifest from "./package-manifest";
import PackageSpine from "./package-spine";
import { parseXml } from "./utils/xml";

export default class PackageManager extends PackageElement {
  constructor() {
    super("package");
    this.metadata = undefined;
    this.manifest = undefined;
    this.spine = undefined;
    this.rawData = undefined;
  }

  async loadXml(data) {
    const result = await parseXml(data);

    if (result) {
      this.rawData = result;

      if (this.rawData.package.attr) {
        this.addAttributes(this.rawData.package.attr);
      }

      // construct metadata section
      const rawMetadata = result.package.metadata[0];
      const formatedMetadata = Object.entries(rawMetadata).flatMap(
        ([key, value]) => {
          if (key === "attr") return [];
          if (Array.isArray(value)) {
            return value.flatMap((entry) => {
              return { name: key, value: entry?.val, attributes: entry?.attr };
            });
          }
        }
      );

      this.metadata = new PackageMetadata(formatedMetadata, rawMetadata?.attr);

      // construct the manifest section
      const rawManifest = result.package.manifest[0];
      const manifestItems = Object.entries(rawManifest).flatMap(
        ([key, value]) => {
          if (key === "attr") return [];
          if (Array.isArray(value)) {
            return value.flatMap((entry) => {
              return entry.attr;
            });
          }
        }
      );

      this.manifest = new PackageManifest(manifestItems, rawManifest?.attr);

      // construct the manifest section
      const rawSpine = result.package.spine[0];
      const spineItems = Object.entries(rawSpine).flatMap(([key, value]) => {
        if (key === "attr") return [];
        if (Array.isArray(value)) {
          return value.flatMap((entry) => {
            return entry.attr;
          });
        }
      });

      this.spine = new PackageSpine(spineItems, rawSpine?.attr);
    }
  }

  get xml() {
    const filterAttributes = (attributes) => {
      if (Object.keys(attributes).length) {
        const attr = Object.entries(attributes)
          .filter(([key, value]) => {
            return value !== undefined;
          })
          .reduce((obj, [key, value]) => {
            obj[key] = attributes[key];
            return obj;
          }, {});

        if (Object.keys(attr).length) {
          return attr;
        }
      }
      return undefined;
    };

    const prepareChildrenForXml = (items) => {
      const dataList = {};
      items.forEach((item) => {
        const data = {};
        if (item.attributes) {
          const attr = filterAttributes(item.attributes);
          if (attr) {
            data.attr = attr;
          }
        }
        if (item.value) {
          data.val = item.value;
        }
        if (Array.isArray(dataList[item.element])) {
          dataList[item.element].push(data);
        } else {
          dataList[item.element] = [data];
        }
      });
      return dataList;
    };

    /* Metadata */
    let xmlJsMetadata = prepareChildrenForXml(this.metadata.items);
    const metadataAttr = filterAttributes(this.metadata.attributes);

    if (metadataAttr) {
      xmlJsMetadata.attr = metadataAttr;
    }

    /* Manifest */
    let xmlJsManifest = prepareChildrenForXml(this.manifest.items);
    const manifestAttr = filterAttributes(this.manifest.attributes);

    if (manifestAttr) {
      xmlJsManifest.attr = manifestAttr;
    }

    /* Spine */
    let xmlJsSpine = prepareChildrenForXml(this.spine.items);
    const spineAttr = filterAttributes(this.manifest.attributes);

    if (spineAttr) {
      xmlJsSpine.attr = spineAttr;
    }

    return {
      package: {
        attr: filterAttributes(this.attributes),
        metadata: [xmlJsMetadata],
        manifest: [xmlJsManifest],
        spine: [xmlJsSpine],
      },
    };
  }
}

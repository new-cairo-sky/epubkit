import xml2js from "xml2js";
import { promisify } from "es6-promisify";
import PackageMetadata from "./package-metadata";

export default class PackageManager {
  constructor() {
    this.metadata = undefined;
    this.rawData = undefined;
  }

  async parseXml(data) {
    let result;
    try {
      result = await promisify(xml2js.parseString)(data, {
        attrkey: "attr",
        charkey: "val",
        explicitCharkey: true,
        trim: true,
      });
    } catch (err) {
      console.warn("Error parsing xml:", err);
      return;
    }

    if (result) {
      this.rawData = result;

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

      this.metadata = new PackageMetadata(formatedMetadata);
    }
  }
}

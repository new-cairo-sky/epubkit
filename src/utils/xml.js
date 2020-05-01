import xml2js from "xml2js";
import { promisify } from "es6-promisify";

const options = {
  attrkey: "attr",
  charkey: "val",
  explicitCharkey: true,
  normalizeTags: true,
  trim: true,
};

export async function parseXml(data) {
  let result;
  try {
    result = await promisify(xml2js.parseString)(data, options);
    return result;
  } catch (err) {
    console.warn("Error parsing xml:", err);
    return;
  }
}

export async function generateXml(data) {
  const builder = new xml2js.Builder(options);
  const xml = builder.buildObject(data);
  return xml;
}

import xml2js from "xml2js";
import { promisify } from "es6-promisify";

const parseOptions = {
  attrkey: "attr",
  charkey: "val",
  explicitCharkey: true,
  normalizeTags: true,
  trim: true,
  // TODO: test async: true
};
const buildOptions = {
  attrkey: "attr",
  charkey: "val",
  xmldec: { version: "1.0", encoding: "UTF-8" },
};

export async function parseXml(data) {
  let result;
  try {
    result = await promisify(xml2js.parseString)(data, parseOptions);
    return result;
  } catch (err) {
    console.warn("Error parsing xml:", err);
    return;
  }
}

export async function generateXml(data) {
  const builder = new xml2js.Builder(buildOptions);
  const xml = builder.buildObject(data);
  return xml;
}

export function filterAttributes(attributes) {
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
}

export function prepareItemsForXml(items) {
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
}

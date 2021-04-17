import xml2js from "xml2js";
import { promisify } from "es6-promisify";
import DataElement from "../data-element.ts";

const parseOptions = {
  attrkey: "attr",
  charkey: "val",
  explicitCharkey: true,
  normalizeTags: true,
  trim: true,
  attrNameProcessors: [(name) => name.toLowerCase()],

  // TODO: test async: true
};
const buildOptions = {
  attrkey: "attr",
  charkey: "val",
  xmldec: { version: "1.0", encoding: "UTF-8" },
};

export async function parseXml(
  data,
  normalizeTagCase = true,
  normalizeAttrCase = true
) {
  let result;
  let options = parseOptions;

  if (!normalizeTagCase) {
    delete options.normalizeTags;
  }
  if (!normalizeAttrCase) {
    delete options.attrNameProcessors;
  }

  try {
    result = await promisify(xml2js.parseString)(data, parseOptions);
    return result;
  } catch (err) {
    console.warn("Error parsing xml:", err);
    return;
  }
}

export async function generateXml(data, isFragment = false) {
  if (isFragment) {
    const options = Object.assign(buildOptions, {
      headless: true,
    });
  }
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
    // const data = {};
    // if (item.attributes) {
    //   const attr = filterAttributes(item.attributes);
    //   if (attr) {
    //     data.attr = attr;
    //   }
    // }
    // if (item.value) {
    //   data.val = item.value;
    // }
    // if (Array.isArray(dataList[item.element])) {
    //   dataList[item.element].push(data);
    // } else {
    //   dataList[item.element] = [data];
    // }

    const preparedItem = prepareItemForXml(item);

    if (Array.isArray(dataList[item.element])) {
      dataList[item.element].push(preparedItem);
    } else {
      dataList[item.element] = [preparedItem];
    }
  });
  return dataList;
}

export function prepareItemForXml(item) {
  let data = {};

  const entries = Object.entries(item);

  for (let [key, value] of Object.entries(item)) {
    //if (item.hasOwnProperty(key)) {
    if (key === "_attributes") {
      const attr = filterAttributes(value);
      if (attr) {
        data.attr = attr;
      }
    } else if (key === "value" && value) {
      data.val = value;
    } else if (value instanceof DataElement) {
      // this is a child dataelement
      // TODO: handle recursion...
      //const child = value;

      data[value.element] = prepareItemForXml(value);
    } else if (Array.isArray(value) && value.length > 0) {
      const children = prepareItemsForXml(value);
      Object.assign(data, children);
    }
    //}
  }
  // if (item.attributes) {
  //   const attr = filterAttributes(item.attributes);
  //   if (attr) {
  //     data.attr = attr;
  //   }
  // }
  // if (item.value) {
  //   data.val = item.value;
  // }

  return data;
}

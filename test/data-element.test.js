/**
 * @jest-environment node
 */
/* ^^^^^^^^^
 * XmlDSigJs checks the environment with
 * typeof self === "undefined" && typeof window === "undefined")
 * This results in an error with webcrypto which is not supported by JSDOM
 * We must force Node environment so that self and window are both undefined
 */

require("jest-xml-matcher");
import "./expect/toBeEqualXml";

import path from "path";
import normalizeXml from "./utils/normalize-xml";

import FileManager from "../src/file-manager";
import DataElement from "../src/data-element";
import PackageManager from "../src/package-manager";

const epub3OpfEpubLocation = "OPS/package.opf";
const epub3OpfPath = path.resolve("./test/fixtures/alice/OPS/package.opf");

test("can load xml", async () => {
  const dataElement = new DataElement();
  const data = await FileManager.readFile(epub3OpfPath, "utf8");
  await dataElement.loadXml(data);
  const generatedXml = await dataElement.getXml();
  await expect(generatedXml).toBeEqualXml(data);
});

test("can construct new data element object", () => {
  const attributes = {
    attributeA: "value a",
    attributeB: "valueB",
  };
  const dataElement = new DataElement("myName", undefined, attributes);

  // test that the constructor attributes are hoisted as object properties
  expect(dataElement.attributeA).toBe(attributes.attributeA);
  expect(dataElement.attributeB).toBe(attributes.attributeB);

  // expect tha the attributes property matches constructor data
  expect(dataElement.attributes).toEqual(attributes);

  expect(dataElement.element).toEqual("myName");
  expect(dataElement.value).toEqual(undefined);
});

test("can add attributes to data element", () => {
  const constructorAttributes = {
    attrA: "val a",
    attrB: "val b",
  };
  const dataElement = new DataElement(
    "myName",
    undefined,
    constructorAttributes
  );

  dataElement.addAttributes({ attrB: "new val b", attrC: "val c" });

  expect(dataElement.attrA).toBe("val a");
  expect(dataElement.attrB).toBe("new val b");
  expect(dataElement.attrC).toBe("val c");

  expect(dataElement.attributes).toEqual({
    attrA: "val a",
    attrB: "new val b",
    attrC: "val c",
  });
});

test("can set attribute as object property", () => {
  const constructorAttributes = {
    attrA: "val a",
    attrB: "val b",
  };
  const dataElement = new DataElement(
    "myName",
    undefined,
    constructorAttributes
  );

  dataElement.attrB = "new val b";

  expect(dataElement.attrB).toBe("new val b");
  expect(dataElement.attributes).toEqual({
    attrA: "val a",
    attrB: "new val b",
  });
});

test("can remove attribute", () => {
  const constructorAttributes = {
    attrA: "val a",
    attrB: "val b",
  };
  const dataElement = new DataElement(
    "myName",
    undefined,
    constructorAttributes
  );

  dataElement.removeAttribute("attrA");

  expect(dataElement.attrA).toBeUndefined();
  expect(dataElement.attributes.attrA).toBeUndefined();
});

test("can can get xml", async () => {
  const packageManager = new PackageManager(epub3OpfEpubLocation);
  const data = await FileManager.readFile(epub3OpfPath, "utf8");
  const expectedXml = await normalizeXml(data);
  await packageManager.loadXml(expectedXml);

  // const xmlObject = packageManager.prepareForXml();

  // console.log("xmlObject", xmlObject);

  const xml = await packageManager.getXml();
  const resultXml = await normalizeXml(xml);

  expect(resultXml).toEqualXML(expectedXml);
});

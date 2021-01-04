// THIS WILL NOT RUN IN JSDOM

import { parseXml, generateXml } from "../../src/utils/xml";
import * as xmldsigjs from "xmldsigjs";
const { Crypto } = require("@peculiar/webcrypto");

export default async function normalizeXml(xml, isFragment = false) {
  // const crypto = new Crypto();
  // xmldsigjs.Application.setEngine("WebCrypto", crypto);
  // const transform = new xmldsigjs.XmlDsigC14NTransform();
  // const node = xmldsigjs.Parse(xml).documentElement;
  // transform.LoadInnerXml(node);
  // const data = transform.GetOutput();

  const xmlData = await parseXml(xml);
  const normalizedXml = await generateXml(xmlData, isFragment);
  return normalizedXml;
}

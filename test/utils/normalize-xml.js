import * as xmldsigjs from "xmldsigjs";
const { Crypto } = require("@peculiar/webcrypto");

export default function normalizeXml(xml) {
  const crypto = new Crypto();
  xmldsigjs.Application.setEngine("WebCrypto", crypto);
  const transform = new xmldsigjs.XmlDsigC14NTransform();
  const node = xmldsigjs.Parse(xml).documentElement;
  transform.LoadInnerXml(node);
  const data = transform.GetOutput();
  return data;
}

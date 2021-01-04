import normalizeXml from "../utils/normalize-xml.js";

expect.extend({
  async toBeEqualXml(receivedXml, expectedXml) {
    const normalizedReceivedXml = await normalizeXml(receivedXml);
    const normalizedExpectedXml = await normalizeXml(expectedXml);
    return expect(normalizedReceivedXml).toEqualXML(normalizedExpectedXml);
  },
});

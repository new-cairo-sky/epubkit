import { parseXml, generateXml } from "../../src/utils/xml";

expect.extend({
  async toBeXmlShape(receivedXml, expectedXml) {
    const normalizedReceivedXml = await parseXml(receivedXml);
    const normalizedExpectedXml = await parseXml(expectedXml);
    const differencesChecker = new DiffChecker(receivedXml, expectedXml);

    if (!differencesChecker.hasDifferences) {
      return {
        message: () => `XML structures are equal`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `XML structures are different:\n${differencesChecker.formattedDifferences}`,
        pass: false,
      };
    }
  },
});

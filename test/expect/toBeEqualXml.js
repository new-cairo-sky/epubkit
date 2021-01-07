import normalizeXml from "../utils/normalize-xml.js";

const DiffChecker = require("../../node_modules/jest-xml-matcher/src/xml-difference-checker.js");

expect.extend({
  async toBeEqualXml(receivedXml, expectedXml) {
    const normalizedReceivedXml = await normalizeXml(receivedXml);
    const normalizedExpectedXml = await normalizeXml(expectedXml);
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

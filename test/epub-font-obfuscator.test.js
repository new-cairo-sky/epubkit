import { promises as fs } from "fs";
import path from "path";
import epubFontObfuscator from "../src/epub-font-obfuscator";

/**
 * Note: The test fonts were taken from https://github.com/dita4publishers/epub-font-obfuscator
 * and the key is the key used in producing the test fonts.
 */
const obfuscatedFontPath = path.resolve(
  "./test/fixtures/font-file-obfuscated.ttf"
);
const plainFontPath = path.resolve("./test/fixtures/font-file-plain.ttf");
const key = "PXxxxxxxxx-XXX-X";

test("can obfuscate font", async () => {
  let expectedFontData, sourceFontData;
  try {
    expectedFontData = await fs.readFile(obfuscatedFontPath);
    sourceFontData = await fs.readFile(plainFontPath);
  } catch (err) {
    console.error(err);
    return;
  }
  console.log("type of", sourceFontData);
  const obfuscatedFontData = epubFontObfuscator(sourceFontData, key);

  for (let i = 0; i < 80; i++) {
    console.log(
      "compare",
      sourceFontData[i],
      expectedFontData[i],
      obfuscatedFontData[i]
    );
  }

  expect(Buffer.compare(expectedFontData, obfuscatedFontData)).toBe(0);
});

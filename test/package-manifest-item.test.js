import PackageManifestItem from "../src/package-manifest-item";

test("can construct with default attributes", () => {
  const manifestItem = new PackageManifestItem(
    "myId",
    "http://",
    "test-media",
    {
      fallback: "fallback",
      "media-overlay": "media-overlay",
      properties: "properties",
    }
  );
  expect(manifestItem.id).toBe("myId");
  expect(manifestItem.href).toBe("http://");
  expect(manifestItem["media-type"]).toBe("test-media");
  expect(manifestItem["fallback"]).toBe("fallback");
  expect(manifestItem["media-overlay"]).toBe("media-overlay");
  expect(manifestItem["properties"]).toBe("properties");
});

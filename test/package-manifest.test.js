import PackageManifest from "../src/package-manifest";
import PackageManifestItem from "../src/package-manifest-item";

test("can construct new PackageManifest", () => {
  const manifest = new PackageManifest(
    [{ id: "id", href: "href", "media-type": "media-type" }],
    "manifest-id"
  );

  const testItems = manifest.items;
  expect(testItems.length).toBe(1);
  expect(testItems[0]).toBeInstanceOf(PackageManifestItem);
  expect(testItems[0].id).toBe("id");
  expect(testItems[0].href).toBe("href");
  expect(testItems[0]["media-type"]).toBe("media-type");
  expect(manifest.id).toBe("manifest-id");
});

test("can add new item", () => {
  const manifest = new PackageManifest(
    [{ id: "id", href: "href", "media-type": "media-type" }],
    "manifest-id"
  );
  manifest.addItem("id-2", "href-2", "mediaType-2");
  expect(manifest.items.length).toBe(2);
  expect(manifest.items[1].id).toBe("id-2");
});

test("can add item after id", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type-1" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type-2",
      },
      { id: "id3", href: "href3", "media-type": "media-type-1" },
    ],
    "manifest-id"
  );
  manifest.addItemAfterId("id2", "id2b", "href4", "media-type-1");
  expect(manifest.items[2].id).toBe("id2b");
});

test("can add item to end when id is not found", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type-1" },
      { id: "id2", href: "href3", "media-type": "media-type-1" },
    ],
    "manifest-id"
  );
  manifest.addItemAfterId("id1", "id2b", "href4", "media-type-1");
  expect(manifest.items[2].id).toBe("id2b");
});

test("can add item before id", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type-1" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type-2",
      },
      { id: "id3", href: "href3", "media-type": "media-type-1" },
    ],
    "manifest-id"
  );
  manifest.addItemBeforeId("id2", "id2b", "href4", "media-type-1");
  expect(manifest.items[1].id).toBe("id2b");
});

test("can add item to start when id is not found", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type-1" },
      { id: "id2", href: "href3", "media-type": "media-type-1" },
    ],
    "manifest-id"
  );
  manifest.addItemBeforeId("id1", "id2b", "href4", "media-type-1");
  expect(manifest.items[0].id).toBe("id2b");
});

test("can find item with id", () => {
  const manifest = new PackageManifest(
    [{ id: "id", href: "href", "media-type": "media-type" }],
    "manifest-id"
  );
  manifest.addItem("id-2", "href-2", "mediaType-2");
  const foundItem = manifest.findItemWithId("id-2");
  expect(foundItem).toBeInstanceOf(PackageManifestItem);
  expect(foundItem.href).toBe("href-2");
});

test("can remove item with id", () => {
  const manifest = new PackageManifest(
    [{ id: "id", href: "href", "media-type": "media-type" }],
    "manifest-id"
  );
  manifest.removeItemWithId("id");
  expect(manifest.items.length).toBe(0);
});

test("can find item with nav attribute", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type2",
        properties: "nav",
      },
    ],
    "manifest-id"
  );
  const navItem = manifest.findNav();
  expect(navItem).toBeInstanceOf(PackageManifestItem);
  expect(navItem.id).toBe("id2");
});

test("can change nav item", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type2",
        properties: "nav",
      },
    ],
    "manifest-id"
  );

  manifest.setNav("id");
  const itemsWithNav = manifest.items.filter((item) => {
    return item.properties === "nav";
  });

  expect(itemsWithNav.length).toBe(1);
  expect(itemsWithNav[0].id).toBe("id");
});

test("can find item with href attr value", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type2",
        properties: "nav",
      },
      { id: "id3", href: "href3", "media-type": "media-type" },
    ],
    "manifest-id"
  );

  const itemWithHref = manifest.findItemWithHref("href2");
  expect(itemWithHref.id).toBe("id2");
});

test("can remove item with href attr value", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type2",
        properties: "nav",
      },
      { id: "id3", href: "href3", "media-type": "media-type" },
    ],
    "manifest-id"
  );

  manifest.removeItemWithHref("href2");
  expect(manifest.items.length).toBe(2);
});

test("can find items with media-type", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type-1" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type-2",
        properties: "nav",
      },
      { id: "id3", href: "href3", "media-type": "media-type-1" },
    ],
    "manifest-id"
  );

  const type1Media = manifest.findItemsWithMediaType("media-type-1");
  expect(type1Media.length).toBe(2);
});

test("findItemsWithX returns a reference and not a copy", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type-1" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type-2",
      },
      { id: "id3", href: "href3", "media-type": "media-type-1" },
    ],
    "manifest-id"
  );

  const type1Media = manifest.findItemsWithMediaType("media-type-2");
  expect(type1Media.length).toBe(1);
  type1Media[0].addAttributes({ properties: "nav" });
  const navItem = manifest.findNav();
  expect(navItem.id).toBe("id2");
});

test("can remove items with media-type", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type-1" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type-2",
        properties: "nav",
      },
      { id: "id3", href: "href3", "media-type": "media-type-1" },
    ],
    "manifest-id"
  );

  manifest.removeItemsWithMediaType("media-type-1");
  expect(manifest.items.length).toBe(1);
});

test("can find items with multiple attributes", () => {
  const manifest = new PackageManifest(
    [
      { id: "id", href: "href", "media-type": "media-type" },
      {
        id: "id2",
        href: "href2",
        "media-type": "media-type",
        properties: "nav",
        extraAttr: "extra-attr",
      },
      { id: "id3", href: "href3", "media-type": "media-type" },
    ],
    "manifest-id"
  );

  const id2Href2 = manifest.findItemsWithAttributes({
    "media-type": "media-type",
    extraAttr: "extra-attr",
  });
  expect(id2Href2.length).toBe(1);
  expect(id2Href2[0]["media-type"]).toBe("media-type");
});

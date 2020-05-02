import DataElement from "../src/data-element";

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

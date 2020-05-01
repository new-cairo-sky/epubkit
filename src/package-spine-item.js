import PackageElement from "./package-element";

/**
 * https://www.w3.org/publishing/epub32/epub-packages.html#sec-itemref-elem
 */
export default class PackageSpineItem extends PackageElement {
  constructor(idref, options = {}) {
    const attr = Object.assign(
      {
        id: undefined,
        idref: idref,
        linear: undefined,
        properties: undefined,
      },
      options
    );
    super("itemref", undefined, attr);
  }
}

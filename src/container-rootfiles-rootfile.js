import DataElement from "./data-element";

export default class ContainerRootfilesRootfile extends DataElement {
  constructor(fullPath, mediaType) {
    super("rootfile", undefined, {
      "full-path": fullPath,
      "media-type": mediaType,
    });
  }
}

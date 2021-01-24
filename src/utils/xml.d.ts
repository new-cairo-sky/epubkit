export declare function parseXml(
  data: string,
  normalizeTagCase?: boolean,
  normalizeAttrCase?: boolean
): Promise<object>;

export declare function generateXml(
  data: object,
  isFragment: boolean
): Promise<object>;

export declare function filterAttributes(attributes: object): any;

export declare function prepareItemsForXml(items: object[]): object;

export declare function prepareItemForXml(items: object): object;

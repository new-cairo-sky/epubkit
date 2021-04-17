export function parseXml(data: any, normalizeTagCase?: boolean, normalizeAttrCase?: boolean): Promise<any>;
export function generateXml(data: any, isFragment?: boolean): Promise<any>;
export function filterAttributes(attributes: any): {} | undefined;
export function prepareItemsForXml(items: any): {};
export function prepareItemForXml(item: any): {
    attr: {};
    val: any;
};

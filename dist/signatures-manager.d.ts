export default class SignaturesManager extends DataElement {
    constructor(epubLocation?: string);
    _rawData: object | undefined;
    signatures: any[];
    epubLocation: string;
    location: string;
    initCrypto(): void;
    create(): void;
    addSignature(id: any): void;
    getSignature(id: any): any;
    /**
    * The signatures.xml file should be included in the signature manifest, but it requires
    * an envelopedTransform. Ie. this will add signatures.xml file to the given signature's manifest.
    *
    * @param {object} signature - a target signature data-element instance to add file into manifest.
    */
    addSelfToSignatureManifest(signature: object): Promise<void>;
    /**
     * Returns a string represention of signatures xml, with 'enveloped transform' applied.
     * This will remove the provided Signature instance from signatures so that the xml can
     * be signed without recursion.
     * The xmldsigjs.XmlDsigEnvelopedSignatureTransform() is not used due to this issue:
     * https://github.com/PeculiarVentures/xmldsigjs/issues/49
     * The EnvelopedSignature transform is intended to remove only the direct ancestor
     * Signature of the transform.
     *
     * @param {object} envelopedSignature - the signature object instance to be enveloped
     * @returns {string} - enveloped xml
     */
    getEnvelopedSignatureTransformedXml(envelopedSignature: object): string;
}
import DataElement from "./data-element";

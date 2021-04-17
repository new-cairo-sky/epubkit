/**
 * This class manages the Signature node within the parent signatures.xml > signature node.
 * Note: the signature w3 spec uses snake case on names and attributes
 */
export default class Signature extends DataElement {
    constructor(epubLocation?: string, id?: string);
    signedInfo: SignatureSignedInfo;
    signatureValue: SignatureValue;
    keyInfo: DataElement;
    object: DataElement;
    epubLocation: string;
    /**
     * This will create a complete signature to add to the signatures.xml.
     * Often, the signatures.xml file itself would not be included in the manifest,
     * however to allow validation of the signature.xml file itelf, the envelope
     * transform can be used. In this case, adding or removing a signature
     * invalidates the signatures.xml file.
     *
     * The envelope transform removes the whole signature element containing the
     * transform from the signing process. In a Signatures.xml file, any previous
     * Signature nodes will be included in the signing.
     *
     * see:
     * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
     * https://www.w3.org/TR/xmldsig-core/#sec-EnvelopedSignature
     *
     * In the situation where epub watermarking chain of custody is desired,
     * each previous signatures.xml signature should be retained for self-validation against
     * the digest hash of the signature's manifest, but have the signature iteslf become
     * invalidated. Each subsequent signature will be signed with the full
     * signature history, recording a secure chain of signatures.
     */
    /**
     * Sign the signature
     * Signing with a privateKey should only be allowed in a node environment
     * https://github.com/PeculiarVentures/xmldsigjs#creating-a-xmldsig-signature
     * https://www.w3.org/TR/WebCryptoAPI/#algorithms
     * https://www.w3.org/TR/xmldsig-core/#sec-KeyValue
     */
    sign(privateKey: any, publicKey: any): Promise<void>;
    /**
     * Look for file in manifest and update the reference if it exists, otherwise create a new reference
     * @param {string} location location of file, relative to epub root
     * @param {array} transforms array of xmldsigjs transforms
     * @param {string} digestMethod xmldsigjs diest method
     * @param {string} digestValue option base64 encoded digest value. A new digest will be generated if omited
     */
    addOrUpdateManifestReference(location: string, transforms?: any, digestMethod?: string, digestValue?: string): Promise<void>;
    /**
     * Create a base64 encoded digest hash of a file.
     * https://www.w3.org/TR/2008/REC-xmldsig-core-20080610/#sec-EnvelopedSignature
     * @param {string} location the location of the file relative to the epub root
     */
    generateFileDigest(location: string, digestMethod: any): Promise<string | undefined>;
    /**
     * Add a manifest reference to the signature. Using an Object > Manifest is the recommended signature form
     * in the epub spec. see: https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-signatures.xml
     * A comment in the example notes that xml/html files should be canonicalized before the digest is produced -
     * that is the approach taken below.
     *
     * TODO! this does not apply the transforms. Currently all xml files are normalized downstream.
     * (see generateFileDigest above). or that transforms happened upstream and included in provided digestValue
     *
     * Note that WebCrypto does not accept streams, so the entire file must be loaded into memory. Node has a 1gb
     * file size limit (?) - so large files cannot be digested.
     * see:
     * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
     * https://github.com/w3c/webcrypto/issues/
     * https://www.w3.org/TR/2008/REC-xmldsig-core-20080610/#sec-EnvelopedSignature
     *
     * @param {string} location - path to the resource, relative to the epub root
     * @param {string} digestMethod - the digest standard to use. see https://github.com/PeculiarVentures/xmldsigjs
     */
    addManifestReference(location: string, transforms?: string[], digestMethod?: string, digestValue?: any): Promise<void>;
}
import DataElement from "./data-element";
import SignatureSignedInfo from "./signature-signed-info";
import SignatureValue from "./signature-value";

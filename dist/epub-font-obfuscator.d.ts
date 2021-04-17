/**
 * The Epub font obfuscation spec is a self-inverting XOR process.
 * To unobfuscate just run the obfuscated font through the obfuscator again.
 * Based on the java implementations found at
 * https://github.com/dita4publishers/epub-font-obfuscator
 * and the C++ implementation at:
 * https://github.com/Sigil-Ebook/Sigil/blob/master/src/Misc/FontObfuscation.cpp
 *
 * The spec is found at:
 * https://www.w3.org/publishing/epub32/epub-ocf.html#sec-resource-obfuscation
 */
/**
 * Uses the data from the package Opf and encryption.xml to find obfuscation method and key
 * TODO: this assumes that all fonts are obfuscated with the same method
 * The fontLocation option should be used to id the font obfuscation method within encrpytion.xml
 * @param {Buffer | Uint8Array} fontData - source font data
 * @param {string} opfXml - xml of opf file
 * @param {string} encryptionXml - xml of encryption.xml file
 * @param {string} fontLocation - (optional) the location of the font relative to the epub root
 */
export function fontObfuscation(fontData: Buffer | Uint8Array, opfXml: string, encryptionXml: string, fontLocation?: string): Promise<any>;
/**
 * Obfuscates/Unobfuscates the provided font data using the IDPF method.
 * The Obfuscation process is a self-inverting XOR process. Running this
 * method on an onfuscated font will unobfuscate it and vice-versa
 * @param {Buffer | Uint8Array} fontData - source data
 * @param {string} identifier - the opf id used to produce the sha-1 key
 * @returns {Uint8array} - the output data
 */
export function idpfFontObfuscation(fontData: Buffer | Uint8Array, identifier: string): any;
/**
 * Obfuscates the provided font data using the Adobe method.
 * The Obfuscation process is a self-inverting XOR process. Running this
 * method on an onfuscated font will unobfuscate it and vice-versa
 * @param {Buffer | Uint8Array} fontData - source data
 * @param {string} identifier - the opf id used to produce the sha-1 key
 * @returns {Uint8array} - the output data
 */
export function adobeFontObfuscation(fontData: Buffer | Uint8Array, identifier: string): any;
/**
 * Converts the OPF UID into binary buffer array used by the adobe font obfuscation spec.
 * Unfortunetly this requires the node Buffer module. For browser support epubkit relies
 * on the Buffer polyfill proided by BrowserFS (see the webpack config).
 *
 * @param {string} id - the UUID identified in the epub's opf
 * @returns {Buffer}
 */
export function getAdobeKeyFromIdentifier(id: string): Buffer;
/**
 * Converts the OPF UID into a key used by the IDPF font obfuscation spec.
 * @param {string} id - the UUID identified in the epub's opf
 */
export function getIdpfKeyFromIdentifier(id: string): Uint8Array;

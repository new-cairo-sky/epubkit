<p align="center">
    :construction: Work in Progress! :construction:
</p>

# Epubkit

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A universal JS library for parsing and editing epubs in both Node.js (v8.x +) and the browser.

Note: Support for signatures requires Node v10+ for the Crypto API used by the node [WebCrypto pollyfill](https://github.com/PeculiarVentures/webcrypto#readme).

### Features

- Support for both `.epub` archive files and expanded epub diretories.
- Support for un/obfuscating epub fonts in both IDPF and Adobe format.
- Modify and save epubs in the browser.
- Lazy fetching of resources when loading pre-expanded epub directories in the browser.
- Node / Web support for signed signatures

Note: Epubkit relies on [BrowserFS](https://github.com/jvilk/BrowserFS) v2.0.0-beta for browser support of node fs. Cryptographic signing and hashing for signatures.xml relies on [XMLDSIG](https://github.com/PeculiarVentures/xmldsigjs) and a [WebCrypto pollyfill](https://github.com/PeculiarVentures/webcrypto#readme) for Node.

## Install

```
npm install git+https://github.com/new-cairo-sky/epubkit.git
```

## Usage

```js
import Epubkit from "epubkit";

const epubkit = new Epubkit();
await epubkit.load("/path/to/epub-dir");

// get the opf metadata as an object
const metadata = epubkit.opf.metadata;
```

## Testing

Tests are made with jest. The server must be running for browser-based tests.
Jest Puppeteer is configured with JSDom to enable DOM support during browser testing with es6 imports; see: https://github.com/zaqqaz/jest-environment-puppeteer-jsdom. Also see the package.json Jest config for details.

```
npm start
npm test
```

or

```
npm test -- [test-file-name].test.js
```

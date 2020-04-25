<p align="center">
    :construction: Work in Progress! :construction:
</p>

# EpubKit

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A Node library for parsing and editing epubs.

## Install

```
npm install git+https://github.com/new-cairo-sky/epubkit.git
```

## Testing

Tests are made with jest. The server must be running for testing in the browser.
We are using Jest Puppeteer with JSDom for browser testing. see: https://github.com/zaqqaz/jest-environment-puppeteer-jsdom. Also see the package.json Jest config for details. The puppeteer standard preset is not in use in order to enable jsdom on imports that require the DOM.

```
npm start
npm test
```

or

```
npm test -- [test-file-name].test.js
```

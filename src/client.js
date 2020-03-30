import "core-js/stable";
import "regenerator-runtime/runtime";
import EpubKit from "./epub-kit";
const BrowserFS = require("browserfs");

BrowserFS.install(window);
BrowserFS.configure(
  {
    fs: "LocalStorage"
  },
  function(e) {
    if (e) {
      // An error happened!
      throw e;
    }
    // Otherwise, BrowserFS is ready-to-use!
    window.fs = window.require("fs");
  }
);

const TestEpubKit = new EpubKit("/assets/alice");

module.exports = {
  sourceMap: "both",
  retainLines: true,
  targets: {
    node: "current"
  },
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript", // will use tsconfig.json,
  ],
  plugins: [
    "add-module-exports",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
  ],
};

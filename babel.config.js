module.exports = {
  sourceMap: "both",
  retainLines: true,
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ]
};

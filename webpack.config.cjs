const path = require("path");
const webpack = require("webpack");
const AssetsPlugin = require("assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

// import path from 'path';
// import webpack from 'webpack';
// import AssetsPlugin from 'assets-webpack-plugin';

const isProd = false;

module.exports = {
  /**
   * Web Target
   */
  target: "web",
  entry: {
    main: isProd
      ? ["./src/index.js"]
      : [
          "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
          "./test/client.js",
        ],
  },
  output: {
    filename: `bundle.[name]${isProd ? ".[chunkhash]" : ""}.js`,
    path: path.resolve(__dirname, "dist/assets/"),
    publicPath: "/assets/",
    hotUpdateChunkFilename: "hot/[id].[hash].hot-update.js",
    hotUpdateMainFilename: "hot/[hash].hot-update.json",
  },
  devtool: isProd ? undefined : "cheap-module-eval-source-map",
  resolve: {
    // Use our versions of Node modules.
    alias: {
      fs: "browserfs/dist/shims/fs.js",
      buffer: "browserfs/dist/shims/buffer.js",
      path: "browserfs/dist/shims/path.js",
      processGlobal: "browserfs/dist/shims/process.js",
      bufferGlobal: "browserfs/dist/shims/bufferGlobal.js",
      bfsGlobal: require.resolve("browserfs"),
      // bfsGlobal: path.join( __dirname, "browserfs")
    },
    extensions: [".js", ".ts"],
  },
  // REQUIRED to avoid issue "Uncaught TypeError: BrowserFS.BFSRequire is not a function"
  // See: https://github.com/jvilk/BrowserFS/issues/201
  module: {
    noParse: /browserfs\.js/,
    rules: [
      {
        test: /\.js$|\.ts$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              sourceMap: "both",
              presets: ["@babel/typescript"],
              plugins: [
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-transform-async-to-generator",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-optional-chaining",
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // Expose BrowserFS, process, and Buffer globals.
    // NOTE: If you intend to use BrowserFS in a script tag, you do not need
    // to expose a BrowserFS global.
    new webpack.ProvidePlugin({
      BrowserFS: "bfsGlobal",
      process: "processGlobal",
      Buffer: "bufferGlobal",
    }),
    isProd ? null : new webpack.HotModuleReplacementPlugin(),
    new AssetsPlugin({
      filename: "bundle-manifest.json",
      fullPath: false,
      path: path.resolve(__dirname, "dist/assets/"),
      prettyPrint: true,
    }),
    isProd ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
  // DISABLE Webpack's built-in process and Buffer polyfills!
  node: {
    process: false,
    Buffer: false,
    __dirname: true
  },
};

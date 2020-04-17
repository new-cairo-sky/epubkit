import http from "http";
import path from "path";
import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import helmet from "helmet";
import webpackConfig from "../webpack.config";

const compiler = webpack(webpackConfig);

const app = express();
// app.use("/", express.static(__dirname + "../public"));
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);
app.use(webpackHotMiddleware(compiler));
app.use(helmet());
app.use(express.static(path.join(path.dirname(__dirname), "test")));
const server = http.createServer(app);

server.listen(3000, () => {
  console.log("__dirname", __dirname);
  console.log("listening on port 3000");
});

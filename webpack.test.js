const path   = require("path");
const common = require("./webpack");

module.exports = {
  mode: "development",
  entry: "./test/test.js",
  output: {
    filename: "test.build.js",
    path: path.resolve(__dirname, "test")
  },
  devServer: {
    contentBase: "./test"
  },
  module: {rules: [...common.rules]}
};

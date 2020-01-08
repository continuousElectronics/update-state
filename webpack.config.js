const path = require("path");
const common = require("./webpack");

module.exports = {
  entry: "./dev.js",
  output: {
    filename: "build.js",
    path: path.resolve(__dirname)
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "node_modules",
        use: ["babel-loader"]
      }
    ]
  }
};

const path = require("path");
console.log("o");
module.exports = {
  entry: "./dev.js",
  output: {
    filename: "build.js",
    path: path.resolve(__dirname),
    libraryTarget: "commonjs2"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  }
};

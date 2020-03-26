const path = require("path");

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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

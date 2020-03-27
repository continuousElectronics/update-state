const path = require("path");

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
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    ie: "11"
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  }
};

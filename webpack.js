module.exports = {
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
};

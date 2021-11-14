const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
      minify: true,
    }),
    new MiniCSSExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(jpg|png|gif|svg|jpeg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },
    ],
  },
};

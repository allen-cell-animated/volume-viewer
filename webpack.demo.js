const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: ["./public/index.ts"],
  output: {
    path: path.resolve(__dirname, "demo"),
    filename: "image-viewer-ui.bundle.js",
    publicPath: "",
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "**/*",
          context: path.resolve(__dirname, "example-data"),
        },
      ],
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require("./package.json").version),
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(obj)$/,
        type: "asset/source",
      },
      {
        test: /\.(png)$/,
        type: "asset/inline",
      },
    ],
  },
};

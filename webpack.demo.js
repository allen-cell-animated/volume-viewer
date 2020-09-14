const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: ["./public/index.js"],
  output: {
    path: path.resolve(__dirname, "demo"),
    filename: "image-viewer-ui.bundle.js",
    publicPath: "",
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require("./package.json").version),
    }),
    new CopyWebpackPlugin(["public"]),
  ],
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "public")],
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /Worker\.js$/,
        use: "worker-loader?inline=true",
      },
      {
        test: /\.(obj)$/,
        use: ["raw-loader?inline=true"],
      },
      {
        test: /\.(png)$/,
        use: ["url-loader?inline=true"],
      },
    ],
  },
};

const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: ["./public/index.js"],
  output: {
    path: path.resolve(__dirname, "volumeviewer"),
    filename: "volume-viewer-ui.bundle.js",
    publicPath: "/volumeviewer/",
  },
  devtool: "cheap-module-source-map",
  devServer: {
    publicPath: "/volumeviewer/",
    openPage: "volumeviewer/",
    port: 9020,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require("./package.json").version),
    }),
    new webpack.ProvidePlugin({
      THREE: "three",
    }),
    new CopyWebpackPlugin({ patterns: ["public"] }),
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

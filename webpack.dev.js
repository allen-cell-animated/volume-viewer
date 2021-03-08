const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: { bundle: "./public/index.js", FuseWorker: "./src/FuseWorker.js" },
  output: {
    path: path.resolve(__dirname, "volumeviewer"),
    filename: "[name].js",
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
    new CopyWebpackPlugin({ patterns: ["public"] }),
    new WorkerPlugin({ globalObject: "self" }),
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
      // {
      //   test: /worker\.js$/,
      //   use: "worker-loader?inline=true",
      // },
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

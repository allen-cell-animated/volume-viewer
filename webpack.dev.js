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
  devtool: "source-map",
  devServer: {
    publicPath: "/volumeviewer/",
    openPage: "volumeviewer/",
    port: 9020,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/**/*",
          globOptions: { ignore: ["index.html"] },
        },
      ],
      //patterns: ["public", "!index.html"],
      //   { from: "public/**/*", to: path.resolve(__dirname, "volumeviewer"), globOptions: { ignore: ["index.html"] } },
      // ],
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require("./package.json").version),
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
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

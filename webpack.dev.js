import path from "path";
import webpack from "webpack";

import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

import packageJson from "./package.json" with { type: "json" };

import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  entry: ["./public/index.ts"],
  output: {
    path: path.resolve(__dirname, "volumeviewer"),
    filename: "volume-viewer-ui.bundle.js",
  },
  devtool: "source-map",
  devServer: {
    open: ["/"],
    port: 9021,
    static: [
      {
        staticOptions: {
          dotfiles: "allow",
        },
      },
      {
        publicPath: "/example-data/",
        directory: path.join(__dirname, "example-data"),
        staticOptions: {
          dotfiles: "allow",
        },
      },
    ],
  },
  performance: {
    hints: false,
  },
  mode: "development",
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
      APP_VERSION: JSON.stringify(packageJson.version),
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts"],
    extensionAlias: {
      ".js": [".js", ".ts"],
    }
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

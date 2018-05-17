const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './public/index.js'],
  output: {
    path: path.resolve(__dirname, 'imageviewer'),
    filename: 'image-viewer-ui.bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['imageviewer']),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require("./package.json").version)
    }),
    new webpack.ProvidePlugin({
      d3: 'd3',
      THREE: 'three',
      jQuery: 'jquery',
      $: 'jquery'
    }),
    // ignores a webcomponents dependency on a server side module since this is for front end only.
    // see: https://github.com/webcomponents/webcomponentsjs/issues/794
    new webpack.IgnorePlugin(/vertx/)
  ],
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'public')
        ],
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /Worker\.js$/,
        use: 'worker-loader?inline=true'
      },
      {
        test: /\.html$/,
        exclude: /index\.html/,
        use: ['polymer-webpack-loader']
      }
    ]
  }
};

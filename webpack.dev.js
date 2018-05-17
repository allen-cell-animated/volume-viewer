const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  output: {
    publicPath: '/imageviewer/'
  },
  devServer: {
    publicPath: '/imageviewer/',
    openPage: 'imageviewer/',
    port: 9020
  },
  plugins: [
    new CopyWebpackPlugin(['public']), 
  ]
});

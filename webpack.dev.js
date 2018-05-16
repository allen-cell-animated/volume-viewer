const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');

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
    new webpack.DefinePlugin({
      'process.env': {
        'IMAGE_VIEWER_SERVICE_URL': JSON.stringify('http://localhost:9021/image-service')
      }
    })
  ]
});

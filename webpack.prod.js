const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'IMAGE_VIEWER_SERVICE_URL': JSON.stringify('http://aics.corp.alleninstitute.org/image-service')
      }
    })
  ]
});

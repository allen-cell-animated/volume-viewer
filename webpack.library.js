const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'VolumeViewer',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three'
    })
    // new CopyWebpackPlugin([
    //   {from:'public/assets/vr_controller_vive_1_5.obj', to:'assets/'},
    //   {from:'public/assets/onepointfive_spec.png', to:'assets/'},
    //   {from:'public/assets/onepointfive_texture.png', to:'assets/'}
    // ])
  ],
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /Worker\.js$/,
        use: 'worker-loader?inline=true'
      },
      {
        test: /\.(obj)$/,
        use: ['raw-loader?inline=true']
      },
      {
        test: /\.(png)$/,
        use: ['url-loader?inline=true']
      }
    ]
  }
};

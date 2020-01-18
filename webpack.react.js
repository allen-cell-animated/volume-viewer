const path = require("path");
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');

plugins =  [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './react-example/index.html',
            }),
            // ignores a webcomponents dependency on a server side module since this is for front end only.
            // see: https://github.com/webcomponents/webcomponentsjs/issues/794
            new webpack.IgnorePlugin(/vertx/),
        ];


module.exports = {
    devtool: "source-map",
    devServer: {
        publicPath: '/volumeviewer/',
        openPage: 'volumeviewer/',
        port: 9030,
    },
    entry: {
        app: "./react-example/index.jsx"
    },
    mode: "production" ,
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                include: [
                    path.resolve(__dirname, "react-example")
                ],
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader"
                }],
            },
            {
                test: /Worker\.js$/,
                use: 'worker-loader?inline=true'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "../", "dist"),
        filename: "[name].[chunkhash].js"
    },
    plugins,
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },
};

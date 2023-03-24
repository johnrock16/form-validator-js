const path = require("path");
// const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode:'development',
    entry: './src/client/js/index.js',
    target: "web",
    devServer: {
        hot: false,
        liveReload: true,
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader'
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({
        template: "./src/client/templates/index.html",
        filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        })
    ]
};

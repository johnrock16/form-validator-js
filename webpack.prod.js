// const path = require("path");
// const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode:'production',
    entry: './src/client/js/index.js',
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
        new WorkboxPlugin.GenerateSW(),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        })
    ]
};
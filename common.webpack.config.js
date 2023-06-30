const WebpackAssetsManifest = require('webpack-assets-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {merge} = require('webpack-merge');
const path = require("path");

module.exports = (config) => {
    return merge(config, {
        output: {
            path: path.resolve(config.output.path.endsWith('/public/static') ? config.output.path : config.output.path + '/public/static'),
            publicPath: "/static/",
            filename: '[name].[contenthash].js',
            clean: true
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        optimization: {
            runtimeChunk: {
                name: "runtime"
            },
            splitChunks: {chunks: "all"},
        },
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [
                new TsconfigPathsPlugin(),
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css'
            }),
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                skipWaiting: true,
            }),
            new WebpackAssetsManifest({
                publicPath: true,
                entrypoints: true,
                integrity: true,
                entrypointsUseAssets: true,
                output: '../../assets-manifest.json'
            }),
        ]
    })
};
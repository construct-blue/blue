const path = require('path');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: {
        app: './apps/example/src/app.ts'
    },
    output: {
        path: path.resolve('./apps/example/public/static'),
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
        ],
    },
    optimization: {
        runtimeChunk: {
            name: "runtime"
        },
        splitChunks: { chunks: "all" },
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin(),
        ]
    },

    plugins: [
        new WebpackAssetsManifest({
            publicPath: true,
            entrypoints: true,
            entrypointsUseAssets: true,
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
    ]
};
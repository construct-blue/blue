const path = require('path');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = [
    {
        entry: {
            app: './apps/example/src/app.ts'
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
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve('./apps/example/public/static'),
            clean: true
        },
        plugins: [
            new WorkboxPlugin.GenerateSW({
                // these options encourage the ServiceWorkers to get in there fast
                // and not allow any straggling "old" SWs to hang around
                clientsClaim: true,
                skipWaiting: true,
            }),
            new WebpackManifestPlugin({
                publicPath: '',
                useEntryKeys: true
            })
        ]
    }
];
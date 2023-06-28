const path = require('path');

module.exports = [
    {
        extends: path.resolve(__dirname, './base.webpack.config.js'),
        entry: {
            app: './apps/example/src/app.ts'
        },
        output: {
            path: path.resolve('./apps/example/public/static'),
        },
    },
    {
        extends: path.resolve(__dirname, './base.webpack.config.js'),
        entry: './apps/trainsearch/frontend/src/index.ts',
        output: {
            path: path.resolve('./apps/trainsearch/frontend/public/static'),
        },
    }
];
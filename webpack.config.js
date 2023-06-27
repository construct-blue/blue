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
    }
];
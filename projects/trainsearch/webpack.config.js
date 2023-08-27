const common = require('./common.webpack.config')

module.exports = [
    common({
        entry: './src/index.ts',
        output: {
            path: './',
        },
    })
];
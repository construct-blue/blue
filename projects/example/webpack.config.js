const common = require('./common.webpack.config')

module.exports = [
    common({
        entry: './src/app.ts',
        output: {
            path: './',
        },
    })
];
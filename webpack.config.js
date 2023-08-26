const common = require('./common.webpack.config')

module.exports = [
    common({
        entry: './projects/example/src/app.ts',
        output: {
            path: './projects/example',
        },
    }),
    common({
        entry: './projects/trainsearch/src/index.ts',
        output: {
            path: './projects/trainsearch',
        },
    })
];
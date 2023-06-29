const common = require('./common.webpack.config')

module.exports = [
    common({
        entry: './apps/example/src/app.ts',
        output: {
            path: './apps/example',
        },
    }),
    common({
        entry: './apps/trainsearch/frontend/src/index.ts',
        output: {
            path: './apps/trainsearch/frontend',
        },
    })
];
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ['./jest.setup.js'],
    transform: {
        // transform files with ts-jest
        "^.+\\.(js|ts)$": ["ts-jest", {
            tsconfig: {
                // allow js in typescript
                allowJs: true,
            },
        }]
    },
    transformIgnorePatterns: [
        // allow lit-html transformation
        "node_modules/(?!\@?lit)",
    ],
};
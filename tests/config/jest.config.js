/* eslint @typescript-eslint/no-var-requires: "off" */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const customJestConfig = {
    rootDir: '../..',
    setupFilesAfterEnv: ['./tests/config/jest.setup.ts'],
    moduleDirectories: ['node_modules', '<rootDir>/src/', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
}

module.exports = createJestConfig(customJestConfig)

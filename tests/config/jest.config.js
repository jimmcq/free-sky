/* eslint @typescript-eslint/no-var-requires: "off" */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  rootDir: '../..',
  setupFilesAfterEnv: ['./tests/config/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/src/', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)

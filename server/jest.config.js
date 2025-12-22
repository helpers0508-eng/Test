module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/scripts/**'
  ],
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  extensionsToTreatAsEsm: [],
  globals: {
    'ts-jest': {
      useESM: false
    }
  },
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};
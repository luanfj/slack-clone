const { name } = require('./package.json')
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  displayName: name,
  name,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/'
  }),
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/services/*.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    "text-summary",
    "lcov"
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/*.spec.ts"
  ]
}

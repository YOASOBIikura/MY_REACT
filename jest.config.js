const { pathsToModuleNameMapper } = require('ts-jest');
const { readConfigFile, sys } = require('typescript');

const { config } = readConfigFile('./tsconfig.json', sys.readFile);
const compilerOptions = config.compilerOptions || {};

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    testMatch: ['**/?(*.)test.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^shared/(.*)\\.js$': '<rootDir>/packages/shared/$1',
        ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
            prefix: '<rootDir>/'
        })
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                module: 'commonjs',
                ignoreDeprecations: '6.0'
            }
        }]
    },
    testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    collectCoverage: true,
    coverageDirectory: 'coverage'
}

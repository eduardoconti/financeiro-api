import { pathsToModuleNameMapper } from 'ts-jest/utils';

import { compilerOptions } from './tsconfig.json';

export default {
  // Stop running tests after `n` failures
  bail: true,

  moduleFileExtensions: ['js', 'json', 'ts'],
  clearMocks: true,
  rootDir: 'src',
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper({
    "@app/*": ["src/app/*"],
    "@users/*": ["src/users/*"],
    "@auth/*": ["src/auth/*"],
    "@wallet/*": ["src/wallet/*"],
    "@category/*": ["src/category/*"],
    "@config/*": ["src/config/*"],
    "@db/*": ["src/db/*"],
    "@despesas/*": ["src/despesas/*"],
    "@graphic/*": ["src/graphic/*"],
    "@receitas/*": ["src/receitas/*"],
    "@shared/*": ["src/shared/*"],
    "@transference/*": ["src/transferencias/*"],
  }, {
    prefix: '<rootDir>/../',
  }),
};

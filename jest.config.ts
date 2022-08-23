import { pathsToModuleNameMapper } from 'ts-jest/utils';

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  rootDir: 'src',
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverageFrom: [
    '<rootDir>/**/*.{service,repository,controller,helper}.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper({
    "@app/*": ["src/app/*"],
    "@users/*": ["src/user/*"],
    "@auth/*": ["src/auth/*"],
    "@wallet/*": ["src/wallet/*"],
    "@category/*": ["src/category/*"],
    "@config/*": ["src/config/*"],
    "@db/*": ["src/database/*"],
    "@expense/*": ["src/expense/*"],
    "@graphic/*": ["src/graphic/*"],
    "@earning/*": ["src/earning/*"],
    "@shared/*": ["src/shared/*"],
    "@transference/*": ["src/transference/*"],
    "@dashboard/*": ["src/dashboard/*"],
  }, {
    prefix: '<rootDir>/../',
  }),
};

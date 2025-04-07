module.exports = {
  preset: 'ts-jest/presets/default',
  testEnvironment: 'node',
  testRegex: './.*\\.(test|spec)\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
};

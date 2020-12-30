module.exports = {
  testMatch: ['**/*.test.(js)'],
  moduleFileExtensions: ['js', 'jsx'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: 'junit_jest.xml',
      },
    ],
  ],
  transformIgnorePatterns: ['./node_modules/(?!@material-ui|@babel)'],
};

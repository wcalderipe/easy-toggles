module.exports = {
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  testRegex: '.test.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: false
}


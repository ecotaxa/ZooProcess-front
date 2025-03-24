// module.exports = {
//   testMatch: ['**/*.test.(js|ts|jsx|tsx)'],
//   transform: {
//     '^.+\\.(ts|tsx)$': 'babel-jest',
//   },
// };


// module.exports = {
//   transform: {
//     '^.+\\.(ts|tsx)$': ['ts-jest', {
//       useESM: true,
//     }]
//   },
//   extensionsToTreatAsEsm: ['.ts', '.tsx'],
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   },
// };

module.exports = {
  transformIgnorePatterns: ['/node_modules/(?!(some-package|other-package)/)'],
  transform: {
    // roots: ['<rootDir>'],
    // "^.+\\.(ts|tsx)$": "ts-jest"
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}


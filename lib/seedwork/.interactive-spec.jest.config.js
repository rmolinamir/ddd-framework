// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('@config/jest');

module.exports = {
  ...config,
  testMatch: ['<rootDir>/**/*.spec.ts']
};

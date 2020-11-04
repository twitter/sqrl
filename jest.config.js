// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const base = require("./jest.base");

module.exports = {
  ...base,
  projects: [
    "packages/sqrl-cli-functions/jest.config.js",
    "packages/sqrl-cli/jest.config.js",
    "packages/sqrl-common/jest.config.js",
    "packages/sqrl/jest.config.js",
    "packages/sqrl-jsonpath/jest.config.js",
    "packages/sqrl-load-functions/jest.config.js",
    "packages/sqrl-redis-functions/jest.config.js",
    "packages/sqrl-text-functions/jest.config.js"
  ],
  coverageDirectory: "<rootDir>/coverage/",
  testRegex: `.*/__tests__/.*\\.spec\\.ts$`
};

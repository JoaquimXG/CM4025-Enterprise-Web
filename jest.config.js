const config = {
  maxConcurrency: 2,
  testTimeout: 4000,
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  setupFilesAfterEnv: ["./backend/test/suiteSetup.js"],
};

module.exports = config;

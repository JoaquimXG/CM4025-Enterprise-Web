const base = require("./base");
const jestSettings = require("./jest"); // Can't name jest as when running with jest, jest is reserved...

/**
 * Settings files can be arbitrarily constructed as javascript files with whatever
 * logic is required. Then they can be selected using the SETTINGS_ENV environment variable
 */

const SETTINGS_ENV = process.env.SETTINGS_ENV || "base";

const settingsEnvironments = {
  base,
  jest: { ...base, ...jestSettings },
};

module.exports = settingsEnvironments[SETTINGS_ENV];

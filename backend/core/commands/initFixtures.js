const sequelize_fixtures = require("sequelize-fixtures");
const sequelize = require("../db/sequelize");
const path = require("path");
const log = require("../utils/winstonLogger");

console.log;

BASE_PATH = "../../fixtures/";

FIXTURES = [path.join(__dirname, BASE_PATH, "workers.yml")];

sequelize_fixtures.loadFiles(FIXTURES, sequelize.models).then(() => {
  log.info("Fixtures run");
  sequelize.close();
});

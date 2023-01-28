const { Sequelize } = require("sequelize");
const settings = require("../settings");
const log = require("../utils/winstonLogger");

const sequelize = new Sequelize(
  settings.MYSQL_DATABASE,
  settings.MYSQL_USER,
  settings.MYSQL_PASSWORD,
  {
    host: settings.MYSQL_HOST,
    dialect: "mysql",
    logging: (msg) => log.debug(msg),
  }
);

const modelDefinitions = [
  require("../../apps/auth/models/user.js"),
  require("../../apps/quoteBuilder/models/Worker.js"),
];

for (const definition of modelDefinitions) {
  model = definition(sequelize);
  if (settings.SEQUELIZE_MIGRATE) {
    model.sync({ alter: true }); // TODO use real migrations
  }
}

const relations = require("./setupRelations");
relations(sequelize);

module.exports = sequelize;

const { Sequelize } = require("sequelize");
const settings = require("../settings");
const { log } = require("../utils/");

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

// // Potential method to run custom validators instead of running standard sequelize validators
// sequelize.addHook("beforeValidate", (instance, options) => {
//   if (!options.validate) return;
//   options.validate = false;

//   let rawAttributes =
//     instance.sequelize.models[instance.constructor.name].rawAttributes;
//   for (let key in rawAttributes) {
//     if ("validators" in rawAttributes[key]) {
//       for (let validator of rawAttributes[key].validators) {
//         console.log(
//           "Validating " + key + " with " + validator.constructor.name
//         );
//         validator.validate(instance.dataValues[key]);
//       }
//     }
//   }
// });

const modelDefinitions = [
  require("../../apps/auth/models/User.js"),
  require("../../apps/test/models/Worker.js"),
  require("../../apps/test/models/TestModel.js"),
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

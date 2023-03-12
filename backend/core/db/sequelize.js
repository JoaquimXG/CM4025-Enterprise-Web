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

let modelDefinitions = [
  require("../../apps/auth/models/User.js"),
  require("../../apps/quoteBuilder/models/Worker.js"),
  require("../../apps/quoteBuilder/models/Project.js"),
  require("../../apps/quoteBuilder/models/Quote.js"),
  require("../../apps/quoteBuilder/models/Task.js"),
  require("../../apps/quoteBuilder/models/TimeEntry.js"),
  require("../../apps/quoteBuilder/models/StaticCost.js"),
];

if (settings.INIT_TESTS) {
  modelDefinitions = modelDefinitions.concat([
    require("../../apps/test/models/StringModel.js"),
    require("../../apps/test/models/IntegerModel.js"),
    require("../../apps/test/models/BooleanModel.js"),
    require("../../apps/test/models/NullDefaultModel.js"),
    require("../../apps/test/models/ChoiceModel.js"),
    require("../../apps/test/models/DateTimeModel.js"),
    require("../../apps/test/models/EmailModel.js"),
    require("../../apps/test/models/ReadOnlyDefaultModel.js"),
  ]);
}

(async () => {
  for (const definition of modelDefinitions) {
    model = definition(sequelize);
    if (settings.SEQUELIZE_MIGRATE) {
      await model.sync({ alter: true }); // TODO(OUTOFSCOPE) use real migrations. True migrations are not required for this app
    }
  }
  const relations = require("./setupRelations");
  await relations(sequelize);
  if (settings.SEQUELIZE_MIGRATE) {
    sequelize.close();
  }
})();

module.exports = sequelize;

const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class TaskController extends ModelController {
  meta = {
    model: sequelize.models.Task,
    fields: "__all__",
  };
};

const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class WorkerController extends ModelController {
  meta = {
    model: sequelize.models.Worker,
    fields: "__all__",
  };
};

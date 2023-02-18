const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class ProjectController extends ModelController {
  meta = {
    model: sequelize.models.Project,
    fields: "__all__",
  };
};

const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { ProjectController } = require("../controllers");

module.exports = class ProjectViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.Project;
  controllerClass = ProjectController;
};

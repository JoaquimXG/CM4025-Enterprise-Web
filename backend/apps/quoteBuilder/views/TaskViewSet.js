const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { TaskController } = require("../controllers");

module.exports = class TaskViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.Task;
  controllerClass = TaskController;
};

const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { WorkerController } = require("../controllers");

module.exports = class WorkerViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.Worker;
  controllerClass = WorkerController;
};

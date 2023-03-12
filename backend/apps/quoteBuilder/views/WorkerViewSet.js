const sequelize = require("../../../core/db/sequelize");
const {
  IsAdminOrReadOnly,
  IsAuthenticated,
} = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { WorkerController } = require("../controllers");

module.exports = class WorkerViewSet extends ModelViewSet {
  /**
   * Require both IsAdminOrReadOnly and IsAuthenticated permissions
   * to access this viewset.
   * Either you must be authenticated and you can only read, or you
   * can must be an admin and you can read and modify
   */
  permissions = [new IsAdminOrReadOnly(), new IsAuthenticated()];

  model = sequelize.models.Worker;
  controllerClass = WorkerController;
};

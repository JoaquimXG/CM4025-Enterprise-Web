const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { AdminUserController } = require("../controllers");
const { IsAdmin } = require("../../../core/permissions");

module.exports = class UserViewSet extends ModelViewSet {
  permissions = [new IsAdmin()];

  model = sequelize.models.User;
  controllerClass = AdminUserController;

  create = this.notAllowed;
};

const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { UserController } = require("../controllers");

module.exports = class UserViewSet extends ModelViewSet {
  model = sequelize.models.User;
  controller_class = UserController;
};

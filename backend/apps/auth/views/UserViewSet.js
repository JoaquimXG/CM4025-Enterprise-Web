const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { UserController } = require("../controllers");

// TODO this view should be for admins only
module.exports = class UserViewSet extends ModelViewSet {
  model = sequelize.models.User;
  controller_class = UserController;
};

const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { UserController } = require("../controllers");
const { IsAuthenticated } = require("../../../core/permissions");
const { NotFoundError } = require("../../../core/responses/errors");

module.exports = class UserViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.User;
  controller_class = UserController;

  async get_object_middleware(req, res, next) {
    try {
      req.instance = await this.get_object(
        req.user.id,
        this.lookup_field === "id"
      );
      if (!req.instance) return new NotFoundError().send(res);
      return next();
    } catch (e) {
      return next(e);
    }
  }
};

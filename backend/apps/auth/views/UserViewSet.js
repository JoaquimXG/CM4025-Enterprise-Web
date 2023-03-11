const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { UserController } = require("../controllers");
const { IsAuthenticated } = require("../../../core/permissions");
const { NotFoundError } = require("../../../core/responses/errors");

module.exports = class UserViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.User;
  controllerClass = UserController;

  async getObjectMiddleware(req, res, next) {
    try {
      req.instance = await this.getObject(
        req.user.id,
        this.lookupField === "id"
      );
      if (!req.instance) return new NotFoundError().send(res);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  create = this.notAllowed;
  list = this.notAllowed;
};

const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class UserController extends ModelController {
  meta = {
    model: sequelize.models.User,
    exclude: ["createdAt", "updatedAt", "deletedAt", "isAdmin", "status"],
    read_only_fields: ["hash"]
  }
}

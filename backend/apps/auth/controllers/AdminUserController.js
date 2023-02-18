const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class AdminUserController extends ModelController {
  meta = {
    model: sequelize.models.User,
    fields: "__all__",
  };
};

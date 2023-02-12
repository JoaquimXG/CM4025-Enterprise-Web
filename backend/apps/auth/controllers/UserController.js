const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");
const { CharField } = require("../../../core/fields");

module.exports = class UserController extends ModelController {
  password = new CharField(required=true, write_only=true, max_length=255)

  meta = {
    model: sequelize.models.User,
    exclude: ["hash"],
  }
}

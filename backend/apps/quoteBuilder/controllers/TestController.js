const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class TestController extends ModelController {
  meta = {
    model: sequelize.models.TestModel,
    exclude: ["createdAt", "updatedAt", "deletedAt"],
  }
}

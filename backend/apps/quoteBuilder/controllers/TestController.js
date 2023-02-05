const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class TestController extends ModelController {
  meta = {
    fields: "__all__",
    model: sequelize.models.TestModel,
  }
}

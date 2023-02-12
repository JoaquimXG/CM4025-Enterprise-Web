const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class ChoiceController extends ModelController {
  meta = {
    model: sequelize.models.ChoiceModel,
    exclude: ["createdAt", "updatedAt"],
  };
};

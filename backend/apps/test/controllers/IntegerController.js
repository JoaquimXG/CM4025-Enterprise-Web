const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class IntegerController extends ModelController {
  meta = {
    model: sequelize.models.IntegerModel,
    exclude: ["createdAt", "updatedAt"],
  };
};

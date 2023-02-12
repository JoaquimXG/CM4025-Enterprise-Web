const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class BooleanController extends ModelController {
  meta = {
    model: sequelize.models.BooleanModel,
    exclude: ["createdAt", "updatedAt"],
  };
};

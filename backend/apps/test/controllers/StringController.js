const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class StringController extends ModelController {
  meta = {
    model: sequelize.models.StringModel,
    exclude: ["createdAt", "updatedAt"],
  };
};

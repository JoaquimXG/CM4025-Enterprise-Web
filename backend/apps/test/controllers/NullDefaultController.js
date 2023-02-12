const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class NullDefaultController extends ModelController {
  meta = {
    model: sequelize.models.NullDefaultModel,
    exclude: ["createdAt", "updatedAt"],
  };
};

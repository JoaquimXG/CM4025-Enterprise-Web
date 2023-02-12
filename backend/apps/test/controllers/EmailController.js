const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class EmailController extends ModelController {
  meta = {
    model: sequelize.models.EmailModel,
    exclude: ["createdAt", "updatedAt"],
  };
};

const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class StringController extends ModelController {
  meta = {
    model: sequelize.models.StringModel,
    // TODO create DateTime field so these don't have to be excluded
    // Check all other controllers once this has been done to ensure that they are also not excluded
    exclude: ["createdAt", "updatedAt", "deletedAt"],
  };
};
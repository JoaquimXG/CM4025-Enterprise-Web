const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class QuoteController extends ModelController {
  meta = {
    model: sequelize.models.Quote,
    fields: "__all__"
  };
};

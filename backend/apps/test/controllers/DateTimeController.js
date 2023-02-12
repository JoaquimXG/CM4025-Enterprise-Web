const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class DateTimeController extends ModelController {
  meta = {
    model: sequelize.models.DateTimeModel,
    fields: "__all__"
  };
};

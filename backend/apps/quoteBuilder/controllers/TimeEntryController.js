const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class TimeEntryController extends ModelController {
  meta = {
    model: sequelize.models.TimeEntry,
    fields: "__all__",
  };
};

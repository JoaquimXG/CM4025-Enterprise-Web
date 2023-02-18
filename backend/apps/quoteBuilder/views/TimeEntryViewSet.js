const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { TimeEntryController } = require("../controllers");

module.exports = class TimeEntryViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.TimeEntry;
  controllerClass = TimeEntryController;
};

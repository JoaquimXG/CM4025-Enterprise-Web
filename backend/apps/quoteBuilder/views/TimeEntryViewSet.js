const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { TimeEntryController } = require("../controllers");
const { TotalService } = require("../services");
const { OkResponse } = require("../../../core/responses");

module.exports = class TimeEntryViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.TimeEntry;
  controllerClass = TimeEntryController;

  total = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.getTimeEntryTotalMiddleware.bind(this),
  ];

  async getTimeEntryTotalMiddleware(req, res) {
    let total = await TotalService.getTimeEntryTotal(req.instance);
    return new OkResponse({ total: total }).sendJson(res);
  }
};

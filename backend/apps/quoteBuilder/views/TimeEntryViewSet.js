const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { TimeEntryController } = require("../controllers");
const { TotalService } = require("../services");
const { OkResponse } = require("../../../core/responses");
const { CurrentUserAccessPolicyFilter } = require("../../../core/filters");

module.exports = class TimeEntryViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];
  accessPolicy = CurrentUserAccessPolicyFilter;

  model = sequelize.models.TimeEntry;
  controllerClass = TimeEntryController;

  total = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.getTimeEntryTotalMiddleware.bind(this),
  ];

  async getTimeEntryTotalMiddleware(req, res) {
    // apply fudge factor if user is not admin
    // This is not used in the gui but might as well have it here
    let total = await TotalService.getTimeEntryTotal(
      req.instance,
      !req.user.isAdmin
    );
    return new OkResponse({ total: total }).sendJson(res);
  }
};

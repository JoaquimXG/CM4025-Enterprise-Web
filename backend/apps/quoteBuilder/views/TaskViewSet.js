const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { TaskController } = require("../controllers");
const { TotalService } = require("../services");
const { OkResponse } = require("../../../core/responses");
const { CurrentUserAccessPolicyFilter } = require("../../../core/filters");

module.exports = class TaskViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];
  accessPolicy = CurrentUserAccessPolicyFilter;

  model = sequelize.models.Task;
  controllerClass = TaskController;

  total = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.getTaskTotalMiddleware.bind(this),
  ];

  async getTaskTotalMiddleware(req, res) {
    // apply fudge factor if user is not admin
    let total = await TotalService.getTaskTotal(
      req.instance,
      !req.user.isAdmin
    );
    return new OkResponse({ total: total }).sendJson(res);
  }
};

const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { ProjectController } = require("../controllers");
const { TotalService } = require("../services");
const { OkResponse } = require("../../../core/responses");
const { CurrentUserAccessPolicyFilter } = require("../../../core/filters");

module.exports = class ProjectViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];
  accessPolicy = CurrentUserAccessPolicyFilter;

  model = sequelize.models.Project;
  controllerClass = ProjectController;

  total = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.getProjectTotalMiddleware.bind(this),
  ];

  async getProjectTotalMiddleware(req, res) {
    // apply fudge factor if user is not admin
    let total = await TotalService.getProjectTotal(req.instance, !req.user.isAdmin);
    return new OkResponse({ total: total }).sendJson(res);
  }
};
const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { ProjectController } = require("../controllers");
const { TotalService } = require("../services");
const { OkResponse } = require("../../../core/responses");
const log = require("../../../core/utils/winstonLogger");

module.exports = class ProjectViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.Project;
  controllerClass = ProjectController;

  total = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.getProjectTotalMiddleware.bind(this),
  ];

  async getProjectTotalMiddleware(req, res) {
    let total = await TotalService.getProjectTotal(req.instance);
    log.debug(req.instance);
    log.debug(total);
    return new OkResponse({ total: total }).sendJson(res);
  }
};

const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { QuoteController } = require("../controllers");
const { TotalService } = require("../services");
const { OkResponse } = require("../../../core/responses");
const { CurrentUserAccessPolicyFilter } = require("../../../core/filters");

module.exports = class QuoteViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];
  accessPolicy = CurrentUserAccessPolicyFilter;

  model = sequelize.models.Quote;
  controllerClass = QuoteController;

  total = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.getQuoteTotalMiddleware.bind(this),
  ];

  async getQuoteTotalMiddleware(req, res) {
    let total = await TotalService.getQuoteTotal(req.instance);
    return new OkResponse({ total: total }).sendJson(res);
  }
};

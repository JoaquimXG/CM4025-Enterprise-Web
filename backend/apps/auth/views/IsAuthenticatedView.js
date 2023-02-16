const ApiView = require("../../../core/views/ApiView");
const { NoContentResponse } = require("../../../core/responses/");
const { ForbiddenError } = require("../../../core/responses/errors/");

module.exports = class IsAuthenticatedView extends ApiView {
  get = this.isAuthenticated;

  isAuthenticated(req, res, next) {
    if (req.user) return new NoContentResponse().send(res);
    else return new ForbiddenError().send(res);
  }
};

const ApiView = require("../../../core/views/ApiView");
const { NoContentResponse } = require("../../../core/responses/");
const { ForbiddenError } = require("../../../core/responses/errors/");

module.exports = class IsAdminView extends ApiView {
  get = this.isAdmin;

  isAdmin(req, res) {
    if (req.user && req.user.isAdmin) return new NoContentResponse().send(res);
    else return new ForbiddenError().send(res);
  }
};

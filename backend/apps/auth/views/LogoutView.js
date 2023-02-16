const { ApiView } = require("../../../core/views");
const { NoContentResponse } = require("../../../core/responses");

module.exports = class LogoutView extends ApiView {
  post = this.logout;
  logout(req, res) {
    /**
     * Always return successful no content even if user is not logged in
     * Logout is always successful for idempotency
     */
    if (req.user) req.logout();
    return new NoContentResponse().send(res);
  }
};

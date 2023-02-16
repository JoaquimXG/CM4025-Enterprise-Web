const { ApiView } = require("../../../core/views");
const { NoContentResponse } = require("../../../core/responses");

module.exports = class LogoutView extends ApiView {
  post = this.logout;
  logout(req, res, next) {
    /**
     * Always return successful no content even if user is not logged in
     * Logout is always successful for idempotency
     */
    if (req.user)
      req.logout((err) => {
        if (err) next(err);
        return new NoContentResponse().send(res);
      });
    return new NoContentResponse().send(res);
  }
};

const ApiView = require("../../../core/views/ApiView");
const passport = require("passport");
const { NoContentResponse } = require("../../../core/responses/");
const { UnauthorizedError } = require("../../../core/responses/errors/");

module.exports = class LoginView extends ApiView {
  post = this.authenticate;

  authenticate(req, res, next) {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);

      if (!user) return new UnauthorizedError().send(res);

      req.login(user, (err) => {
        if (err) return next(err);
        return new NoContentResponse().send(res);
      });
    })(req, res, next);
  }
};

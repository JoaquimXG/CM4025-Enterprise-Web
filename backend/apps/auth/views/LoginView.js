const ApiView = require("../../../core/views/ApiView");
const passport = require("passport");

module.exports = class LoginView extends ApiView {
  post = this.authenticate;

  authenticate(req, res, next) {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);

      if (!user) return res.status(401).send("Login Failed");

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).send("Login Successful");
      });
    })(req, res, next);
  }
};

const Permission = require("./Permission")

module.exports = class IsAdmin extends Permission {
  hasPermission(req) {
    return req.user && req.user.isAdmin;
  }
}

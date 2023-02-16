const Permission = require("./Permission")

module.exports = class Isauthenticated extends Permission {
  hasPermission(req) {
    return req.user ? true : false;
  }
}

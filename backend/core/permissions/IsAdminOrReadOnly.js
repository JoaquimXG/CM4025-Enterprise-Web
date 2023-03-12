const Permission = require("./Permission");

module.exports = class IsAdminOrReadOnly extends Permission {
  /**
   *
   * Only allows admins to perform modifying actions, all other users can only read
   *
   */

  SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
  hasPermission(req) {
    if (req.user && req.user.isAdmin) return true;
    else return this.SAFE_METHODS.includes(req.method);
  }
};

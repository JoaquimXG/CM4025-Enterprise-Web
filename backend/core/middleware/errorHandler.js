const { ApiError } = require("../responses/errors");
module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) return err.sendJson(res);
  else {
    if (process.env.NODE_ENV === "development")
      return res.status(500).send(err.stack);
    else return res.status(500).send("Internal server error");
  }
};

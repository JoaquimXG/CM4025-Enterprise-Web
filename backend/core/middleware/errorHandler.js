const { ApiError } = require("../responses/errors");
//TODO include error handling middleware
module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) return err.sendJson(res);
  else return res.status(500).send(err.stack);
};

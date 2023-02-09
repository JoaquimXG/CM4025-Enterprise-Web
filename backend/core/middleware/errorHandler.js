//TODO include error handling middleware
module.exports = (err, req, res, next) => {
  return err.sendJson(res);
};

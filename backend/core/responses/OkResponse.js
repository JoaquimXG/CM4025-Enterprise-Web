const Response = require("./Response");

module.exports = class OkResponse extends Response {
  constructor(message) {
    super(200, message);
  }
};

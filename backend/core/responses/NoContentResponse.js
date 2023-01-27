const Response = require("./Response");

module.exports = class NoContentResponse extends Response {
  constructor() {
    super(204, null);
  }
};

const Response = require("./Response");

module.exports = class CreatedResponse extends Response {
  constructor(message) {
    super(201, message);
  }
};

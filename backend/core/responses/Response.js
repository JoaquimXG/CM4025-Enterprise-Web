const { log } = require("../utils/");

module.exports = class Response {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  toJson() {
    return {
      message: this.message,
    };
  }

  send(res) {
    log.debug("STATUS: " + this.code + " MESSAGE: " + this.message);
    res.status(this.code).send(this.toJson());
  }

  sendJson(res) {
    log.debug("STATUS: " + this.code + " MESSAGE: " + this.message);
    res.status(this.code).json(this.message);
  }
};

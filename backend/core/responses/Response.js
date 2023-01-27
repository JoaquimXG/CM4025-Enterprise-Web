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
    res.status(this.code).send(this.toJson());
  }

  sendJson(res) {
    res.status(this.code).json(this.message);
  }
};

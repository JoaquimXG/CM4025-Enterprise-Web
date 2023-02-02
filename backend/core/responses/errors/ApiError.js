module.exports = class ApiError extends Error {
  constructor(code, message, ...args) {
    super(...args)
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
}

module.exports = class ApiError extends Error {
  constructor(code, message) {
    let _message = message;

    super(_message);
    this.code = code;
    this.message = message;
  }

  toJson() {
    if (this.message === undefined) {
      return null;
    }
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

  toString() {
    if (typeof this.message === "object")
      this.message = JSON.stringify(this.message);
    return `ValidationError: ${this.message}`;
  }
};

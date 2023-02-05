// TODO error messages are still not being formatted as I would like, need to think about how these are being returned to the frontend also
module.exports = class ApiError extends Error {
  constructor(code, message) {
    let _message = message;
    if (typeof _message === "object") _message = JSON.stringify(_message);

    super(_message);
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

  toString() {
    if (typeof this.message === "object")
      this.message = JSON.stringify(this.message);
    return `ValidationError: ${this.message}`;
  }
};

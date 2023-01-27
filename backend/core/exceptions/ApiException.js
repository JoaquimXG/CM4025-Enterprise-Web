module.exports = class ApiException {
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
}

const ValidatorJsValidator = require("./ValidatorJsValidator");
const isEmail = require("validator/lib/isEmail");

module.exports = class EmailValidator extends ValidatorJsValidator {
  message = () => "Enter a valid email address.";
  validator = isEmail;
  args = [];
   
  constructor({message = null} = {}) {
    super();
    if (message !== null) {
      this.message = message;
    }
  }
}
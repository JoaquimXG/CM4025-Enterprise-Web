const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");
const { CharField, DeclaredField } = require("../../../core/fields");
const { ValidationError } = require("../../../core/responses/errors");
const bcrypt = require("bcrypt");
const { passwordStrength } = require("check-password-strength");
const { UserStatusChoice } = require("../enums");

module.exports = class RegisterController extends ModelController {
  password = new DeclaredField(CharField, {
    required: true,
    writeOnly: true,
    maxLength: 255,
  });

  meta = {
    model: sequelize.models.User,
    exclude: ["isAdmin", "status"],
  };

  validatePassword(value) {
    if (value.length < 8)
      throw new ValidationError("Password must be at least 8 characters long");

    const strength = passwordStrength(value);
    if (strength.id < 2)
      // 2 = medium, and is the minimum
      throw new ValidationError("Password is not strong enough");
    return value;
  }

  async create(validatedData) {
    validatedData.hash = await bcrypt.hash(validatedData.password, 10);
    delete validatedData.password;
    validatedData.status = UserStatusChoice.ACTIVE;
    validatedData.isAdmin = false;
    let instance = await super.create(validatedData);

    //TODO(IMPORTANT) send verification email
    return instance;
  }
};

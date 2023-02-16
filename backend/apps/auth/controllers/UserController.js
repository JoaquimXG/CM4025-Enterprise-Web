const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");
const { CharField, DeclaredField } = require("../../../core/fields");
const { ValidationError } = require("../../../core/responses/errors");
const bcrypt = require("bcrypt");
const { passwordStrength } = require("check-password-strength");

module.exports = class UserController extends ModelController {
  password = new DeclaredField(CharField, {
    required: true,
    writeOnly: true,
    maxLength: 255,
  });

  meta = {
    model: sequelize.models.User,
    exclude: ["hash"],
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
    //TODO send verification email
    return super.create(validatedData);
  }

  async update(instance, validatedData) {
    if (validatedData.password) {
      throw new ValidationError("Password cannot be updated");
    }
    return super.update(instance, validatedData);
  }
};

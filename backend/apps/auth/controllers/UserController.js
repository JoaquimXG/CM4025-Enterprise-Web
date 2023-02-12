const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");
const { CharField, DeclaredField } = require("../../../core/fields");
const { ValidationError } = require("../../../core/responses/errors");
const bcrypt = require("bcrypt");
const { passwordStrength } = require("check-password-strength");

module.exports = class UserController extends ModelController {
  password = new DeclaredField(CharField, {
    required: true,
    write_only: true,
    max_length: 255,
  });

  meta = {
    model: sequelize.models.User,
    exclude: ["hash"],
  };

  validate_password(value) {
    if (value.length < 8)
      throw new ValidationError("Password must be at least 8 characters long");

    const strength = passwordStrength(value);
    if (strength.id < 2)
      // 2 = medium, and is the minimum
      throw new ValidationError("Password is not strong enough");
    return value;
  }

  async create(validated_data) {
    validated_data.hash = await bcrypt.hash(validated_data.password, 10);
    delete validated_data.password;
    //TODO send verification email
    return super.create(validated_data);
  }

  async update(instance, validated_data) {
    if (validated_data.password) {
      throw new ValidationError("Password cannot be updated");
    }
    return super.update(instance, validated_data);
  }
};

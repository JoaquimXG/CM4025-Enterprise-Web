const { DataTypes } = require("sequelize");

/**
 * This model is not read only but used for testing read only
 * options on controllers.
 * All values have defaults to allow for no values to be sent, regardless
 * of whether the field can be null or not.
 * Default values are all true, test values will be sent as false.
 */
const ReadOnlyDefaultModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  nullableDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    customFieldOptions: {
      controllerType: "BooleanField",
    },
  },
  notNullableDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    customFieldOptions: {
      controllerType: "BooleanField",
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("ReadOnlyDefaultModel", ReadOnlyDefaultModel, {
    paranoid: true,
  });
};

const { DataTypes } = require("sequelize");

const NullDefaultModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  nullable: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    customFieldOptions: {
      controllerType: "BooleanField",
    },
  },
  notNullable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    customFieldOptions: {
      controllerType: "BooleanField",
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
  return sequelize.define("NullDefaultModel", NullDefaultModel, { paranoid: true });
};

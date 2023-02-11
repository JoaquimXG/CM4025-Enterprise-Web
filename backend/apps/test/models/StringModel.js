const { DataTypes } = require("sequelize");

const StringModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  string: {
    type: DataTypes.STRING,
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
    },
  },
  stringMaxLength: {
    type: DataTypes.STRING(50),
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
      maxLength: 50,
    },
  },
  stringMinLength: {
    type: DataTypes.STRING(),
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
      minLength: 10,
    },
  },
  stringBlank: {
    type: DataTypes.STRING(),
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
      blank: true,
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("StringModel", StringModel, { paranoid: true });
};

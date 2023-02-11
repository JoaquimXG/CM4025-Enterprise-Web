const { DataTypes } = require("sequelize");

const ChoiceModel = {
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
      choices: ["a", "b", "c"],
    },
  },
  int: {
    type: DataTypes.INTEGER,
    allowNull: false,
    customFieldOptions: {
      controllerType: "IntegerField",
      choices: [1, 2, 3],
    },
  },
  bool: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    customFieldOptions: {
      controllerType: "BooleanField",
      choices: [true, false],
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("ChoiceModel", ChoiceModel, { paranoid: true });
};

const { DataTypes } = require("sequelize");

const IntegerModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  int: {
    type: DataTypes.INTEGER,
    allowNull: false,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  intMaxValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    customFieldOptions: {
      controllerType: "IntegerField",
      maxValue: 50,
    },
  },
  intMinValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    customFieldOptions: {
      controllerType: "IntegerField",
      minValue: -50,
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("IntegerModel", IntegerModel, { paranoid: true });
};

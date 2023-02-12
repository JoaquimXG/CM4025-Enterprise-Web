const { DataTypes } = require("sequelize");

const DateTimeModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    customFieldOptions: {
      controllerType: "DateTimeField",
    },
  },
  dateTimeMaxValue: {
    type: DataTypes.DATE,
    allowNull: false,
    customFieldOptions: {
      controllerType: "DateTimeField",
      maxValue: new Date("2025-01-01"),
    },
  },
  dateTimeMinValue: {
    type: DataTypes.DATE,
    allowNull: false,
    customFieldOptions: {
      controllerType: "DateTimeField",
      minValue: new Date("2020-01-01"),
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("DateTimeModel", DateTimeModel, { paranoid: true });
};

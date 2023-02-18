const { DataTypes } = require("sequelize");

const StaticCost = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  name: {
    type: DataTypes.STRING,
    customFieldOptions: {
      controllerType: "CharField",
      maxLength: 255,
    },
  },
  cost: {
    type: DataTypes.INTEGER,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("StaticCost", StaticCost, { paranoid: true });
};

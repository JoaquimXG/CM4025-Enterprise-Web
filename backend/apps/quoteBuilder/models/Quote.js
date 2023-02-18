const { DataTypes } = require("sequelize");

const Quote = {
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
};

module.exports = (sequelize) => {
  return sequelize.define("Quote", Quote, { paranoid: true });
};

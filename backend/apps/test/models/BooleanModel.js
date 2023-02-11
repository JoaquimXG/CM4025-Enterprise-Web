const { DataTypes } = require("sequelize");

const BooleanModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  bool: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    customFieldOptions: {
      controllerType: "BooleanField",
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("BooleanModel", BooleanModel, { paranoid: true });
};

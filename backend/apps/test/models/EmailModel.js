const { DataTypes } = require("sequelize");

const EmailModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    customFieldOptions: {
      controllerType: "EmailField",
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("EmailModel", EmailModel, { paranoid: true });
};

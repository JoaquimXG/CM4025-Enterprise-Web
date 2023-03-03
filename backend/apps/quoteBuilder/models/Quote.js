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
  const quote = sequelize.define("Quote", Quote, { paranoid: true });

  quote.prototype.getUser = (instance) => {
    return instance.getProject().getUser();
  };

  quote.getUserFilter = (req) => {
    return {
      include: {
        model: sequelize.models.Project,
        where: { UserId: req.user.id },
        require: true,
      },
    };
  };

  return quote;
};

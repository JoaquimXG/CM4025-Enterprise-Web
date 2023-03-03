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
  const cost = sequelize.define("StaticCost", StaticCost, { paranoid: true });

  cost.prototype.getUserRelation = async (instance) => {
    let quote = await instance.getQuote();
    let user = await quote.getUserRelation(quote);
    return user;
  };

  cost.getUserFilter = (req) => {
    return {
      include: {
        model: sequelize.models.Quote,
        required: true,
        attributes: [],
        ...sequelize.models.Quote.getUserFilter(req),
      },
    };
  };

  return cost;
};

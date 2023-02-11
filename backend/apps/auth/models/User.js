const { DataTypes } = require("sequelize");

const User = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    customFieldOptions: {
      controllerType: "EmailField",
      maxLength: 255
    }
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
    }
  },
  firstName: {
    type: DataTypes.STRING,
    customFieldOptions: {
      controllerType: "CharField",
    }
  },
  lastName: {
    type: DataTypes.STRING,
    customFieldOptions: {
      controllerType: "CharField",
    }
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    customFieldOptions: {
      controllerType: "BooleanField",
    }
  },
  status: {
    type: DataTypes.ENUM("unverified", "active"),
    defaultValue: "unverified",
    allowNull: false,
  },
};

module.exports = (sequelize) => {
  return sequelize.define("User", User, { paranoid: true });
};

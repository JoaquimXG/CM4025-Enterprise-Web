const { DataTypes } = require("sequelize");
const { UserStatusChoice } = require("../enums");

const User = {
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
    unique: true,
    customFieldOptions: {
      controllerType: "EmailField",
      maxLength: 255,
    },
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
      hidden: true,
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
    },
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    customFieldOptions: {
      controllerType: "BooleanField",
    },
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: UserStatusChoice.UNVERIFIED,
    allowNull: false,
    customFieldOptions: {
      controllerType: "IntegerField",
      choices: UserStatusChoice.values,
    },
  },
};

module.exports = (sequelize) => {
  const user = sequelize.define("User", User, { paranoid: true });

  user.prototype.getUser = (instance) => {
    return instance
  }

  return user;
};

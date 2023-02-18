const sequelize = require("../db/sequelize");
const readline = require("readline-sync");
const {UserStatusChoice} = require("../../apps/auth/enums")
const bcrypt = require("bcrypt");

const createSuperUser = () => {
  let email = readline.question("Enter email: ");
  if (email === null) {
    throw new Error("Email is required");
  }

  let password = readline.question("Enter password: ", { hideEchoBack: true });
  if (password === null) {
    throw new Error("Password is required");
  }

  let firstName = readline.question("Enter first name: ");
  let lastName = readline.question("Enter last name: ");

  let user = {
    email,
    hash: bcrypt.hashSync(password, 10),
    firstName,
    lastName,
    isAdmin: true,
    status: UserStatusChoice.ACTIVE,
  };

  return sequelize.models.User.create(user);
};

if (require.main === module) {
  createSuperUser();
}

module.exports = createSuperUser;
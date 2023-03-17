const sequelize = require("../db/sequelize");
const readline = require("readline-sync");
const { UserStatusChoice } = require("../../apps/auth/enums");
const bcrypt = require("bcrypt");
const settings = require("../settings");
const { log } = require("../utils");

const getUserDetails = () => {
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

  return { email, password, firstName, lastName };
};

const getUserDefinition = ({ email, password, firstName, lastName }) => {
  return {
    email,
    hash: bcrypt.hashSync(password, 10),
    firstName,
    lastName,
    isAdmin: true,
    status: UserStatusChoice.ACTIVE,
  };
};

const createAdmin = (unattended = true, userDetails = {}) => {
  let user;
  if (unattended) {
    user = getUserDefinition(userDetails);
  } else {
    user = getUserDefinition(getUserDetails());
  }

  return sequelize.models.User.create(user);
};

if (require.main === module) {
  // Check if unnattended is true in command line arguments
  // If in unattended mode, take values from .env
  let unattended = process.argv.includes("--unattended");
  log.info(`Unattended mode: ${unattended}`);

  createAdmin(unattended, {
    email: settings.ADMIN_USER_EMAIL,
    password: settings.ADMIN_USER_PASSWORD,
    firstName: settings.ADMIN_USER_FIRST_NAME,
    lastName: settings.ADMIN_USER_LAST_NAME,
  })
    .then(() => {
      log.info(`Admin user: ${settings.ADMIN_USER_EMAIL} created`);
    })
    .catch((e) => {
      log.error(`Error creating admin user: ${e}`);
    })
    .finally(() => {
      sequelize.close();
    });
}

module.exports = createAdmin;

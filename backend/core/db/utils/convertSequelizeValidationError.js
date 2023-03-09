const { ValidationError } = require('../../responses/errors');

/**
 * Takes a sequelize validation error and returns a
 * local ValidationError (Response) with key attributes mapped
 */
module.exports = (e) => {
  let message = {};
  for (let error of e.errors) {
    message[error.path] = error.message;
  }
  return new ValidationError(message);
};

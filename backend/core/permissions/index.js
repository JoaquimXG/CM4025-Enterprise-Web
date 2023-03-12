const IsAdmin = require("./IsAdmin");
const IsAdminOrReadOnly = require("./IsAdminOrReadOnly");
const IsAuthenticated = require("./IsAuthenticated");

module.exports = {
  IsAdmin,
  IsAuthenticated,
  IsAdminOrReadOnly
}
const { writeFileSync } = require("fs");
const sequelize = require("../db/sequelize");
const sequelizeErd = require("sequelize-erd");

(async function () {
  setTimeout(async () => {
    const svg = await sequelizeErd({ source: sequelize });
    writeFileSync("./erd.svg", svg);
  }, 3000); // HACK: wait for sequeilize to init
})();
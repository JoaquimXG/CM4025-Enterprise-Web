const { PORT } = require("./backend/core/settings");
const app = require("./backend/app");

const log = require("./backend/core/utils/winstonLogger");

app.listen(PORT, () => log.info(`Listening on port ${PORT}!`));

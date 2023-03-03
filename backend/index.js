const { PORT } = require("./core/settings");
const app = require("./app");

const { log } = require("./core/utils");

app.listen(PORT, () => log.info(`Listening on port ${PORT}!`));

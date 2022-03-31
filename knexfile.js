import config from "./src/config/index.js";

export default {
  client: "pg",
  connection: config.postgres_uri,
};

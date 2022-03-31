import config from "../config/index.js";
import knex from "knex";

export const thullo = knex({
  client: "pg",
  connection: config.postgres_uri,
  migrations: {
    directory: "migrations",
  },
});

export function up(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.string("email");
      table.string("name");
      table.string("password");
      table.boolean("verified").defaultTo(false);
      table.timestamps(false, true);
      table.unique(["email"]);
    })
    .createTable("sessions", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.boolean("active").defaultTo(true);
      table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.timestamps(false, true);
    })
    .createTable("boards", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.uuid("creator_id").references("id").inTable("users").onDelete("CASCADE");
      table.string("title");
      table.text("description");
      table.timestamps(false, true);
    })
    .createTable("boards_members", (table) => {
      table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.uuid("board_id").references("id").inTable("boards").onDelete("CASCADE");
      table.unique(["user_id", "board_id"]);
    });
}

export function down(knex) {
  return knex.schema
    .dropTable("sessions")
    .dropTable("users")
    .dropTable("board_members")
    .dropTable("boards")
    .dropTable("boards_members");
}

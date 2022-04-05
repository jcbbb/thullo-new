export function up(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.string("email");
      table.string("name");
      table.string("password");
      table.string("profile_photo_url", 512);
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
      table.string("cover_photo_url", 512);
      table.enu("visibility", ["PRIVATE", "PUBLIC"]);
      table.timestamps(false, true);
    })
    .createTable("lists", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.uuid("board_id").references("id").inTable("boards").onDelete("CASCADE");
      table.string("title");
      table.integer("order");
      table.timestamps(false, true);
    })
    .createTable("list_items", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.uuid("list_id").references("id").inTable("lists").onDelete("CASCADE");
      table.integer("order");
      table.string("title");
      table.text("description");
      table.timestamps(false, true);
    })
    .createTable("labels", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.uuid("board_id").references("id").inTable("boards").onDelete("CASCADE");
      table.string("title");
      table.string("color");
      table.unique(["title", "color"]);
      table.timestamps(false, true);
    })
    .createTable("attachments", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.uuid("list_id").references("id").inTable("lists").onDelete("CASCADE");
      table.string("mimetype");
      table.string("filename");
      table.timestamps(false, true);
    })
    .createTable("comments", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.uuid("list_id").references("id").inTable("lists").onDelete("CASCADE");
      table.uuid("user_id").references("id").inTable("users");
      table.text("content");
      table.timestamps(false, true);
    })
    .createTable("invitations", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.uuid("board_id").references("id").inTable("boards").onDelete("CASCADE");
      table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.enu("status", ["ACCEPTED", "DENIED", "PENDING"]).defaultTo("PENDING");
      table.unique(["user_id", "board_id"]);
      table.timestamps(false, true);
    })
    .createTable("list_items_members", (table) => {
      table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.uuid("list_item_id").references("id").inTable("list_items").onDelete("CASCADE");
      table.unique(["user_id", "list_item_id"]);
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
    .dropTable("boards")
    .dropTable("lists")
    .dropTable("list_items")
    .dropTable("comments")
    .dropTable("attachments")
    .dropTable("labels")
    .dropTable("invitations")
    .dropTable("lists_members")
    .dropTable("board_members");
}

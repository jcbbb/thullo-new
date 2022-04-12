export function up(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.string("email").notNullable();
      table.string("name").notNullable();
      table.string("password").notNullable();
      table.string("profile_photo_url", 512);
      table.boolean("verified").defaultTo(false);
      table.timestamps(false, true);
      table.unique(["email"]);
    })
    .createTable("auth_providers", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.enu("type", ["OAUTH", "PASSWORD"]).notNullable();
      table.string("title").notNullable();
      table.string("name").unique().notNullable();
      table.string("scope").nullable();
      table.string("client_id").nullable();
      table.string("logo_url").nullable();
      table.string("oauth_code_url").nullable();
      table.string("oauth_token_url").nullable();
      table.string("redirect_uri").nullable();
      table.string("response_type").nullable();
      table.boolean("active").defaultTo(true);
      table.timestamps(false, true);
    })
    .createTable("sessions", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.boolean("active").defaultTo(true);
      table.string("user_agent");
      table
        .string("auth_provider_name")
        .index()
        .notNullable()
        .references("name")
        .inTable("auth_providers");
      table
        .uuid("user_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(false, true);
    })
    .createTable("boards", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table
        .uuid("creator_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("title").notNullable();
      table.text("description");
      table.string("cover_photo_url", 512);
      table.enu("visibility", ["PRIVATE", "PUBLIC"]);
      table.timestamps(false, true);
    })
    .createTable("lists", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table
        .uuid("board_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("boards")
        .onDelete("CASCADE");
      table.string("title").notNullable();
      table.integer("order").notNullable();
      table.timestamps(false, true);
    })
    .createTable("list_items", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table
        .uuid("list_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("lists")
        .onDelete("CASCADE");
      table.uuid("board_id").index().notNullable().references("id").inTable("boards");
      table.integer("order").notNullable();
      table.string("title").notNullable();
      table.text("description");
      table.timestamps(false, true);
    })
    .createTable("labels", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table
        .uuid("board_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("boards")
        .onDelete("CASCADE");
      table.string("title");
      table.string("color").notNullable();
      table.unique(["title", "color"]);
      table.timestamps(false, true);
    })
    .createTable("attachments", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table
        .uuid("list_item_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("list_items")
        .onDelete("CASCADE");
      table.uuid("board_id").index().notNullable().references("id").inTable("boards");
      table.string("mimetype").notNullable();
      table.string("name").notNullable();
      table.string("s3_key");
      table.string("s3_url", 512);
      table.string("url", 512);
      table.timestamps(false, true);
    })
    .createTable("comments", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table
        .uuid("list_item_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("list_items")
        .onDelete("CASCADE");
      table.uuid("user_id").index().notNullable().references("id").inTable("users");
      table.uuid("board_id").index().notNullable().references("id").inTable("boards");
      table.text("content").notNullable();
      table.timestamps(false, true);
    })
    .createTable("invitations", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table
        .uuid("board_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("boards")
        .onDelete("CASCADE");
      table
        .uuid("user_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.enu("status", ["ACCEPTED", "DENIED", "PENDING"]).defaultTo("PENDING");
      table.unique(["user_id", "board_id"]);
      table.timestamps(false, true);
    })
    .createTable("list_items_members", (table) => {
      table
        .uuid("user_id")
        .notNullable()
        .index()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("list_item_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("list_items")
        .onDelete("CASCADE");
      table.unique(["user_id", "list_item_id"]);
    })
    .createTable("boards_members", (table) => {
      table
        .uuid("user_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("board_id")
        .index()
        .notNullable()
        .references("id")
        .inTable("boards")
        .onDelete("CASCADE");
      table.unique(["user_id", "board_id"]);
    });
}

export function down(knex) {
  return knex.schema
    .dropTable("sessions")
    .dropTable("attachments")
    .dropTable("comments")
    .dropTable("list_items_members")
    .dropTable("list_items")
    .dropTable("lists")
    .dropTable("labels")
    .dropTable("invitations")
    .dropTable("boards_members")
    .dropTable("boards")
    .dropTable("users")
    .dropTable("auth_providers");
}

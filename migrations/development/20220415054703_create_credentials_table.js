export function up(knex) {
  return knex.schema.createTable("credentials", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
    table.string("credential_id", 1024);
    table
      .uuid("user_id")
      .index()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("public_key");
    table.integer("sign_count");
    table.json("transports");
    table.unique(["public_key", "credential_id"]);
  });
}

export function down(knex) {
  return knex.schema.dropTable("credentials");
}

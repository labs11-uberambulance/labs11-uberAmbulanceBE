exports.up = function(knex, Promise) {
  return knex.schema.createTable("drivers", function(tbl) {
    tbl.increments("id").primary();
    tbl
      .string("firebase_id")
      .unsigned()
      .unique()
      .notNullable()
      .references("firebase_id")
      .inTable("users")
      .onUpdate("CASCADE");
    tbl.integer("price");
    tbl.boolean("active");
    tbl.string("bio", 500);
    tbl.string("photo_url", 500);
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("drivers");
};

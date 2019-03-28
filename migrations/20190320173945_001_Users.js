exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(tbl) {
    tbl.increments("id").primary();
    tbl.string("name", 255);
    tbl
      .string("firebase_id", 500)
      .notNullable()
      .unique();
    tbl.string("phone", 32);
    tbl.enum("user_type", ["mothers", "drivers", ""]);
    tbl.string("address", 500);
    tbl.string("village", 500);
    tbl.decimal("latitude", 9, 6);
    tbl.decimal("longitude", 9, 6);
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};

exports.up = function(knex, Promise) {
  return knex.schema.createTable("mothers", function(tbl) {
    tbl.increments("id").primary();
    tbl
      .string("firebase_id")
      .unsigned()
      .notNullable()
      .references("firebase_id")
      .inTable("users")
      .onUpdate("CASCADE");
    tbl.string("address", 500);
    tbl.string("village", 500);
    tbl.decimal("latitude", 9, 6);
    tbl.decimal("longitude", 9, 6);
    tbl.string("caretaker_name", 500);
    tbl.date("due_date");
    tbl.string("hospital", 500);
    tbl.string("email");
    tbl.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("mothers");
};

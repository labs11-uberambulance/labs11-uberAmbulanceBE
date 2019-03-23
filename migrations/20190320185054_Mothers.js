exports.up = function(knex, Promise) {
  return knex.schema.createTable("mothers", function(tbl) {
    tbl.increments("id").primary();
    tbl
      .string("google_id")
      .unsigned()
      .notNullable()
      .references("google_id")
      .inTable("users")
      .onUpdate("CASCADE");
    tbl.string("address", 500);
    tbl.string("village", 500);
    tbl.string("caretaker_name", 500);
    tbl.date("due_date");
    tbl.string("hospital", 500);
    tbl.string("email");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("mothers");
};

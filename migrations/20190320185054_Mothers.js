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
    tbl.string("caretaker_name", 500);
    tbl.date("due_date");
    tbl.string("hospital", 500);
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("mothers");
};

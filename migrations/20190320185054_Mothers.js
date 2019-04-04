exports.up = function(knex, Promise) {
  return knex.schema.createTable("mothers", function(tbl) {
    tbl.increments("id").primary();
    tbl
      .string("firebase_id")
      .unsigned()
      .unique()
      .notNullable()
      .references("firebase_id")
      .inTable("users")
      .onUpdate("CASCADE");
    tbl.string("caretaker_name", 500);
    tbl.date("due_date");
    // start and destination in format:
    // {latlng: "lat,lng", name: "name", descr: "additional info"}
    tbl.json("start");
    tbl.json("destination");
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("mothers");
};

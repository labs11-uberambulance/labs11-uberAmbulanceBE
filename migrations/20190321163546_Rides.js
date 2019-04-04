exports.up = function(knex, Promise) {
  return knex.schema.createTable("rides", function(tbl) {
    tbl.increments("id");
    tbl
      .string("driver_id").unsigned().notNullable()
      .references("firebase_id").inTable("drivers")
      .onUpdate("CASCADE");
    tbl
      .string("mother_id").unsigned().notNullable().unique()
      .references("firebase_id").inTable("mothers")
      .onUpdate("CASCADE");
    // tbl.integer("wait_min").unsigned();
    // tbl.datetime("request_time");
    // start and destination in format:
    // {latlng: "lat,lng", name: "name", descr: "additional info"}
    tbl.json("start");
    tbl.json('rejected_drivers')
    tbl.json("destination");
    tbl.string("ride_status");
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("rides");
};

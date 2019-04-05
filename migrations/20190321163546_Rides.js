exports.up = function(knex, Promise) {
  return knex.schema.createTable("rides", function(tbl) {
    tbl.increments("id");
    tbl
      .string("driver_id").unsigned().notNullable()
      .references("firebase_id").inTable("drivers")
      .onUpdate("CASCADE");
    tbl
<<<<<<< HEAD
      .integer("mother_id")
      .unique()
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("mothers")
=======
      .string("mother_id").unsigned().notNullable()
      .references("firebase_id").inTable("mothers")
>>>>>>> 07839e81a448789cb839a78e9abebbeea6215cd7
      .onUpdate("CASCADE");
    // tbl.integer("wait_min").unsigned();
    // tbl.datetime("request_time");
    // start and destination in format:
    // {latlng: "lat,lng", name: "name", descr: "additional info"}
    tbl.string("start", 150);
    tbl.json('rejected_drivers')
    tbl.string("destination", 150);
    tbl.string("ride_status");
    tbl.json("rejectedDrivers")
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("rides");
};

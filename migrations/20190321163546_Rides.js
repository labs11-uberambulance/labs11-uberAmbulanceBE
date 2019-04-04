exports.up = function(knex, Promise) {
  return knex.schema.createTable("rides", function(tbl) {
    tbl.increments("id");
    tbl
      .integer("driver_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("drivers")
      .onUpdate("CASCADE");
    tbl
      .integer("mother_id")
      .unique()
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("mothers")
      .onUpdate("CASCADE");
    tbl.integer("wait_min").unsigned();
    tbl.datetime("request_time");
    // start and destination in format:
    // {latlng: "lat,lng", name: "name", descr: "additional info"}
    tbl.json("start");
    tbl.json("destination");
    tbl.string("ride_status");
    tbl.json("rejectedDrivers")
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("rides");
};

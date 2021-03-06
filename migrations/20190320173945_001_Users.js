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
    tbl.json("location"); // {latlng: "lat,lng", name: "name", descr: "additional info"}
    tbl.string("email");
    tbl.string("FCM_token");
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};

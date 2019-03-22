exports.seed = function(knex, Promise) {
  return (
    knex("users")
      // Delete existing entries handled in 000-cleaner.js
      .then(function() {
        // Inserts seed entries
        return knex("users").insert([
          {
            name: "testUser",
            login: "test login",
            google_id: 1234,
            phone: 6789,
            user_type: "mothers"
          }
        ]);
      })
  );
};

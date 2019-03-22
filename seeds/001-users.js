const faker = require("faker");

exports.seed = function(knex, Promise) {
  function createFakeUser(i) {
    return {
      name: faker.name.findName(),
      login: faker.internet.email(),
      google_id: faker.random.alphaNumeric(5),
      phone: faker.random.number(9),
      user_type: "mothers"
    };
  }
  const users = [];
  const numFakes = 502;
  for (let i = 0; i < numFakes; i++) {
    users.push(createFakeUser(i));
  }
  return (
    knex("users")
      // Delete existing entries handled in 000-cleaner.js
      .then(function() {
        // Inserts seed entries
        return knex("users").insert(users);
      })
  );
};

const faker = require("faker");

exports.seed = function(knex, Promise) {
  function createFakeUser(i) {
    const rand = Math.random();
    const loginType = rand > 0.8 ? "email" : "phone";
    const phone = faker.phone.phoneNumber();

    return {
      name: faker.name.findName(),
      login: loginType === "email" ? faker.internet.email() : phone,
      google_id: faker.random.alphaNumeric(8),
      phone,
      user_type: i % 2 ? "mothers" : "drivers"
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

const faker = require("faker");

exports.seed = function(knex, Promise) {
  function createFakeUser(i) {
    const phone = faker.phone.phoneNumber();

    return {
      name: faker.name.findName(),
      firebase_id: faker.random.alphaNumeric(8),
      phone,
      user_type: i % 2 ? "mothers" : "drivers"
    };
  }
  const users = [];
  const numFakes = 502;
  for (let i = 0; i < numFakes; i++) {
    users.push(createFakeUser(i));
  }
  // edit first 20 users to have a known firebase id, first 10 mothers, next 10 drivers
  for (let i = 0; i < 10; i++) {
    users[i] = {
      ...users[i],
      name: `mother ${i}`,
      firebase_id: `mother${i}FIREBASE`,
      user_type: "mothers"
    };
    users[i + 10] = {
      ...users[i],
      name: `driver ${i}`,
      firebase_id: `driver${i}FIREBASE`,
      user_type: "drivers",
    };
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

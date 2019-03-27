const faker = require("faker");
const towns = require("../data/towns");

exports.seed = function(knex, Promise) {
  function createFakeUser(i) {
    const phone = faker.phone.phoneNumber();
    const address =
      Math.random() > 0.2
        ? faker.address.streetAddress()
        : faker.lorem.sentences("4");
    const user_type = i % 2 ? "mothers" : "drivers";
    return {
      name: faker.name.findName(),
      firebase_id: faker.random.alphaNumeric(8),
      phone,
      user_type,
      address,
      village: towns[Math.floor(Math.random() * towns.length)],
      // assume drivers have email even if login is with phone
      email: user_type === "drivers" ? faker.internet.email() : null,
      // Uganda between -1.4, 4.2, faker doesn't play nice with neg nums
      // latitude: faker.random.number({ max: 5.6, precision: 0.000001 }) - 1.4,
      // INSTEAD using boundaries: 0.3, 1.1 (safemothers service area)
      latitude: faker.random.number({
        max: 1.1,
        min: 0.3,
        precision: 0.000001
      }),
      // Uganda between 29.5, 35.5
      // longitude: faker.random.number({
      //   min: 29.5,
      //   max: 35.3,
      //   precision: 0.000001
      // })
      // INSTEAD using boundaries 33.2, 33.9 (safemothers service area)
      longitude: faker.random.number({
        min: 33.2,
        max: 33.9,
        precision: 0.000001
      })
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
      user_type: "drivers"
    };
  }
  // edit accounts 21 & 22 to have real firebase_ids
  users[20] = {
    ...users[20],
    name: "birthride-test-mother",
    firebase_id: "vlW3V1awpQgeaaI22SicEthTxGv1", // belongs to ph: 1111111111
    user_type: "mothers"
  };
  users[21] = {
    ...users[21],
    name: "birthride-test-driver",
    firebase_id: "IoOWnaVWc4YY50hTmFpQZZSiDz73", // belongs to ph: 1222222222
    user_type: "drivers"
  };
  users[22] = {
    ...users[22],
    name: "birthride-test-user",
    firebase_id: "eBmX5Et0P4TAGHUfPPyUcnsAS963", // belongs to ph: 11958306948
    user_type: ""
  };
  return (
    knex("users")
      // Delete existing entries handled in 000-cleaner.js
      .then(function() {
        // Inserts seed entries
        return knex("users").insert(users);
      })
  );
};

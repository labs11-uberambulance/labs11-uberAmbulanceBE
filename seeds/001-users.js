const faker = require("faker");
const towns = require("../data/towns");
const fakeLatLng = require("../data/fakeLatLng");

exports.seed = function(knex, Promise) {
  function createFakeUser(i) {
    const phone = faker.phone.phoneNumber();
    const user_type = i % 2 ? "mothers" : "drivers";

    return {
      name: faker.name.findName(),
      firebase_id: faker.random.alphaNumeric(8),
      phone,
      user_type,
      location: {
        latlng: fakeLatLng(),
        name: towns[Math.floor(Math.random() * towns.length)],
        descr: faker.lorem.sentences("1")
      },
      // assume drivers have email even if login is with phone
      email: user_type === "drivers" ? faker.internet.email() : null
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
  // edit accounts 21, 22, 23 to have real firebase_ids
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
  // edit 501 & 502 to be users who have not onboarded
  users[500] = {
    ...users[500],
    user_type: ""
  };
  users[501] = {
    ...users[501],
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

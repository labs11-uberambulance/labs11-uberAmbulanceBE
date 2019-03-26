const faker = require("faker");
const Users = require("../models/user-model");

exports.seed = async function(knex, Promise) {
  // get "drivers users"
  const driversUsers = await Users.findBy({ user_type: "drivers" }).map(
    user => {
      const { login, google_id } = user;
      const address = faker.address.streetAddress();
      return {
        google_id,
        address: address,
        village: faker.address.city(),
        latitude: faker.latitude(),
        longitude: faker.longitude(),
        // assume drivers have email even if login is with phone
        email: login.includes("@") ? login : faker.internet.email(),
        price: faker.random.number({ min: 200, max: 500 }),
        active: Math.random() > 0.5 ? true : false,
        bio: faker.lorem.sentences("4")
      };
    }
  );
  return knex("drivers").insert(driversUsers);
};

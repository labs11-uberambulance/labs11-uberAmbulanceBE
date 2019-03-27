const faker = require("faker");
const Users = require("../models/user-model");

exports.seed = async function(knex, Promise) {
  // get "drivers users"
  const driversUsers = await Users.findBy({ user_type: "drivers" }).map(
    user => {
      const { firebase_id } = user;
      const address = faker.address.streetAddress();
      return {
        firebase_id,
        address: address,
        village: faker.address.city(),
        // Uganda between -1.4, 4.2, faker doesn't play nice with neg nums
        latitude: faker.random.number({ max: 5.6, precision: 0.000001 }) - 1.4,
        // Uganda between 29.5, 35.5
        longitude: faker.random.number({
          min: 29.5,
          max: 35.3,
          precision: 0.000001
        }),
        // assume drivers have email even if login is with phone
        email: faker.internet.email(),
        price: faker.random.number({ min: 200, max: 500 }),
        active: Math.random() > 0.5 ? true : false,
        bio: faker.lorem.sentences("4"),
        photo_url: faker.image.people()
      };
    }
  );
  return knex("drivers").insert(driversUsers);
};

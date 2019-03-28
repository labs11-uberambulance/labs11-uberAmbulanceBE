const faker = require("faker");
const Users = require("../models/user-model");

exports.seed = async function(knex, Promise) {
  // get "drivers users"
  const driversUsers = await Users.findBy({ user_type: "drivers" }).map(
    user => {
      const { firebase_id } = user;
      return {
        firebase_id,
        price: faker.random.number({ min: 200, max: 500 }),
        active: Math.random() > 0.5 ? true : false,
        bio: faker.lorem.sentences("4"),
        photo_url: faker.image.people()
      };
    }
  );
  return knex("drivers").insert(driversUsers);
};

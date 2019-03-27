const faker = require("faker");
const Users = require("../models/user-model");
const hospitals = require("../data/hospitals");

exports.seed = async function(knex, Promise) {
  // get "mothers users"
  const mothersUsers = await Users.findBy({ user_type: "mothers" }).map(
    user => {
      const { firebase_id } = user;
      const address =
        Math.random() > 0.2
          ? faker.address.streetAddress()
          : faker.lorem.sentences("4");
      const now = new Date(Date.now());
      // doing the next part on 2 lines keeps faker happy
      const later = new Date(Date.now());
      later.setMonth(now.getMonth() + 9);
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
        caretaker_name: Math.random() > 0.7 ? faker.name.findName() : "",
        due_date: faker.date.between(now, later),
        hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
        email: ""
      };
    }
  );
  // console.log(mothersUsers[1]);
  return knex("mothers").insert(mothersUsers);
};

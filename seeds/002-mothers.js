const faker = require("faker");
const Users = require("../models/user-model");
const hospitals = require("../data/hospitals");

exports.seed = async function(knex, Promise) {
  // get "mothers users"
  const mothersUsers = await Users.findBy({ user_type: "mothers" }).map(
    user => {
      const { login, google_id } = user;
      const address =
        Math.random() > 0.2
          ? faker.address.streetAddress()
          : faker.lorem.sentences("4");
      const now = new Date(Date.now());
      const later = new Date(new Date(Date.now()).setMonth(now.getMonth() + 9));
      return {
        google_id,
        address: address,
        village: faker.address.city(),
        caretaker_name: Math.random() > 0.7 ? faker.name.findName() : "",
        due_date: faker.date.between(now, later),
        hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
        email: login.includes("@") ? login : ""
      };
    }
  );
  console.log(mothersUsers[1]);
  return knex("mothers").insert(mothersUsers);
};

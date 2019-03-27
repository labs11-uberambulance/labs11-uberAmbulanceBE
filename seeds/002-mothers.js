const faker = require("faker");
const Users = require("../models/user-model");
const hospitals = require("../data/hospitals");

exports.seed = async function(knex, Promise) {
  // get "mothers users"
  const mothersUsers = await Users.findBy({ user_type: "mothers" }).map(
    user => {
      const { firebase_id } = user;
      const now = new Date(Date.now());
      // doing the next part on 2 lines keeps faker happy
      const later = new Date(Date.now());
      later.setMonth(now.getMonth() + 9);
      return {
        firebase_id,
        caretaker_name: Math.random() > 0.7 ? faker.name.findName() : "",
        due_date: faker.date.between(now, later),
        hospital: hospitals[Math.floor(Math.random() * hospitals.length)]
      };
    }
  );
  // console.log(mothersUsers[1]);
  return knex("mothers").insert(mothersUsers);
};

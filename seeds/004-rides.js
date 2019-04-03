const faker = require("faker");
const Users = require("../models/user-model");

exports.seed = async function(knex, Promise) {
  const mothers = (await Users.findMothers()).map(user => {
    const { id, start, destination } = user;
    return { id, start, destination };
  });
  const drivers = (await Users.findDrivers()).map(user => {
    const { id, location } = user;
    return { id, location };
  });
  function createFakeRide(i) {
    const wait_min = faker.random.number({
      max: 40,
      min: 20
    });
    const maxMom = mothers.length;
    const maxDriver = drivers.length;
    const randomMomIndex = faker.random.number({ max: maxMom, min: 0 });
    const randomDriverIndex = faker.random.number({ max: maxDriver, min: 0 });
    const mother = mothers[randomMomIndex];
    const driver = drivers[randomDriverIndex];
    const mother_id = mother.id;
    const driver_id = driver.id;
    const start = {
      ...mother.start
    };
    const destination = {
      ...mother.destination
    };
    return {
      request_time: faker.date.past(),
      driver_id,
      mother_id,
      wait_min,
      start,
      destination,
      ride_status: Math.random() > 0.3 ? "In Progress" : "Completed"
    };
  }

  const rides = [];
  const numFakes = 10;
  for (let i = 0; i < numFakes; i++) {
    rides.push(createFakeRide(i));
  }
  console.log(rides);
  // Deletes ALL existing entries
  return knex("rides").then(function() {
    // Inserts seed entries
    return knex("rides").insert(rides);
  });
};

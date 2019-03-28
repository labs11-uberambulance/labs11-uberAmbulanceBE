const faker = require('faker');
const Users = require("../models/user-model");
const hospitals = require("../data/hospitals");

exports.seed =  async function(knex, Promise) {

  const motherIDs = (await Users.findMothers()).map(({id})=>{
    return id
  })
  const driverIDs = (await Users.findDrivers()).map(({id})=>{
    return id
  })
  function createFakeUser(i) {
    const wait_min = faker.random.number({
      max: 40,
      min: 20
    })
    const maxMom = motherIDs.length;
    const maxDriver = driverIDs.length;
    console.log(maxDriver)
    const randomMomIndex= faker.random.number({max:maxMom, min: 0});
    const randomDriverIndex= faker.random.number({max:maxDriver, min: 0})
    const mother_id = motherIDs[randomMomIndex];
    const driver_id =driverIDs[randomDriverIndex];
    console.log(randomMomIndex)
    console.log(driver_id)
    const start_address = {
      latitude: faker.random.number({
        max: 1.1,
        min: 0.3,
        precision: 0.000001
      }),
      longitude: faker.random.number({
        min: 33.2,
        max: 33.9,
        precision: 0.000001
      })
    }
    // const mother = await Users.findBy({"id": mother_id})
    const destination = hospitals[Math.floor(Math.random() * hospitals.length)];
    return{
      request_time: faker.date.past(),
      mother_id,
      driver_id,
      wait_min,
      start_address,
      destination,
      ride_status: Math.random() > 0.3 ? 'In Progress' : 'Completed'
    }
  }

  const rides = [];
  const numFakes = 10;
  for (let i = 0; i < numFakes; i++) {
    rides.push(createFakeUser(i));
  }
  console.log(rides)
  // Deletes ALL existing entries
  return(
    knex('rides')
    .then(function () {
      // Inserts seed entries
      return knex('rides').insert(rides);
    })
  );
  
  
};

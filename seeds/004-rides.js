const faker = require('faker');
const Users = require("../models/user-model");
const hospitals = require("../data/hospitals");

exports.seed =  async function(knex, Promise) {

  const motherIDs = (await Users.findMothers()).map(user =>{
    return {"id":user.id, "latitude": user.latitude, "longitude": user.longitude, "hospital": user.hospital}
  })
  const driverIDs = (await Users.findDrivers()).map(user =>{
    return {"id":user.id, "latitude": user.latitude, "longitude": user.longitude}
  })
  function createFakeUser(i) {
    const wait_min = faker.random.number({
      max: 40,
      min: 20
    })
    const maxMom = motherIDs.length;
    const maxDriver = driverIDs.length;
    const randomMomIndex= faker.random.number({max:maxMom, min: 0});
    const randomDriverIndex= faker.random.number({max:maxDriver, min: 0})
    const mother = motherIDs[randomMomIndex];
    const driver = driverIDs[randomDriverIndex];
    const mother_id = mother.id;
    const driver_id = driver.id;
    const start_address = {
       "latitude": mother.latitude,
       "longitude": mother.longitude
      }
    const destination = mother.hospital;
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

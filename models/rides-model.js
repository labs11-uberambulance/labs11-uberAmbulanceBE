const db = require("../data/dbConfig.js");
const Users = require('./user-model.js')
const axios = require('axios');
const fbAdmin = require('firebase-admin');

require('dotenv').config(); 
module.exports = {
    findDrivers,
    findRide,
    mothersRides,
    driversRides,
    update,
    createRide,
    findLocale,
    rejectionHandler,
    initDriverLoop
};

async function findDrivers(lat, long){
    const maxLng = long + .125;
    const minLng = long - .125;
    const maxLat = lat + .125;
    const minLat = lat - .125;
    // Find Active Drivers
    const drivers = await Users.findDrivers();
    const driversInArea = [];
    drivers.forEach(driver => {
        if (driver.longitude < maxLng && driver.longitude > minLng) {
            if (driver.latitude < maxLat && driver.latitude > minLat) {
                driversInArea.push(driver)
            }
        }
    })
    // console.log(driversInArea)
    //Convert Drivers Locations to URL Format
    var destinations =[]
    driversInArea.forEach((local, i) =>{
        if(local.active){
            if(i === driversInArea.length-1){
                const lati = local.latitude
                const longi = local.longitude
                destinations.push(`${lati}%2C${longi}&`)
               }
               else{
               const lati = local.latitude
                const longi = local.longitude
                destinations.push(`${lati}%2C${longi}%7C`)
            }
        }
        
     })
     console.log(destinations)
    // Format Google URL with Origin, Destinations and API
   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${long}&destinations=${destinations.join('')}key=${process.env.MYMAPSKEY}`
  // Return Google distance information 
 
   const results = await axios.get(url).then(res=>res.data).catch(err=>console.log(err))
    // Parse Google Distance information to return distance, and driver.
    console.log(results)
    
    var nearest = []
    results.rows[0].elements.forEach((driver, i) =>{
      if(i < 5 ){
          nearest.push({"driver": driversInArea[i], "distance": driver.distance, "duration":driver.duration, "id":i})
      }
      if(i > 5){
         for (var i = 0; i< nearest.length; i++){
                console.log(nearest)
                if(nearest[i].distance.value < driver.distance.value){
                }
                else{
                  nearest.splice(i, 1, {"driver": driversInArea[i], "distance": driver.distance, "duration":driver.duration, "id":i})
                  break;
             }
         }
      }
    })
   return nearest
}

async function createRide(request){
    console.log('model', request)
    const [id] = await db('rides').insert(request, "id")
    console.log(id)
    return findRide(id)
}

function findRide(filter){
    return db('rides').where({"id": filter})
}
function mothersRides(id){
    return db('rides').where({"mother_id": id})
}
function driversRides(id){
    return db('rides').where({"driver_id": id})
}
async function update(id, changes){
    return await db('rides').where({id}).update({changes}).then(count => (count >0 ? findRide(id):null))
}

async function findLocale(village){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${village}&region=ug&components=country:UG&key=${process.env.MYMAPSKEY}`
    const results = await axios.get(url).then(res=>res.data).catch(err=>console.log(err))
    return results
}


// LOGIC TO BOOK A DRIVER AND FIND NEW DRIVER IF REQUEST REJECTED OR TIMER RUNS OUT

async function rejectionHandler (ride_id, driverID) {
    const { ride_status, driver_id, start } = await db('rides').where({ id: ride_id }).first();
    // do some checks here, on the info above, and then update ride info.

    const prev_driver = await db('drivers').where({ firebase_id: driver_id })
    const drivers = await findDrivers(start.lat, start.lng);
    const newDriver = driver.filter(driver => {
        if (driver.price < prev_driver.price + 3 && driver.FCM_token) {
            return true
        }
        return false
    })[0];
    await db('rides').where({ id: ride_id }).update({ driver_id: newDriver.firebase_id })
    notifyDriver(driver.FCM_token, 'Lauren', '10');
}

async function initDriverLoop(requested_driver_id, ride_id = 'tbd'){
    setTimeout( async () => {
        const { ride_status, driver_id } = await findRide({ id: ride_id });
        if (ride_status === 'waiting_for_driver' && driver_id === requested_driver_id) {
            rejectionHandler(ride_id, requested_driver_id);
        }
    }, 600000)
}

const notifyDriver = (FCM_token, name, distance, phone = '+11111111111', price = '2', ride_id = '1') => {
    const messaging = fbAdmin.messaging();
    const message = { 
        notification: {
            title: "You have a new ride request!",
            body: ` ${name} is ${distance}km , -price: ${price}USh`
        },
        data: { distance, name, phone, price, ride_id }
    }
    messaging.sendToDevice(FCM_token, message).then(response => {
        // SET TIMER FUNCTION TO WAIT FOR RESPONSE OR MOVE ON.
        if (response.successCount !== 0) {
            initDriverLoop(firebase_id, ride_id)
        }
        return
     }).catch(err => {
        console.log('Error sending message:', err);
        // We should take over again, and search for another driver (Stretch).
     })
}


const db = require("../data/dbConfig.js");
const Users = require('./user-model.js')
const axios = require('axios');
require('dotenv').config(); 
module.exports = {
    findDrivers,
    findRide,
    mothersRides,
    driversRides,
    update,
    createRide
};

async function findDrivers(lat, long){
    
    const maxLng = long + 2.75;
    const minLng = long - 2.75;
    const maxLat = lat + 2.75;
    const minLat = lat - 2.75;
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
        console.log(i)
        if(i === driversInArea.length-1){
            const lati = parseInt(local.latitude)
            const longi = parseInt(local.longitude)
            destinations.push(`${lati}%2C${longi}&`)
           }
           else{
           const lati = parseInt(local.latitude)
            const longi = parseInt(local.longitude)
            destinations.push(`${lati}%2C${longi}%7C`)
           }
     })
     console.log(destinations)
    // Format Google URL with Origin, Destinations and API
   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${long}&destinations=${destinations.join('')}key=${process.env.MYMAPSKEY}`
//    // Return Google distance information 
   const results = await axios.get(url).then(res=>res.data).catch(err=>console.log(err))
    //  Check that res.status === "OK"
    //  var finalDriverDistance = results.(distance)
// YOU ARE HERE
   return result

}

async function createRide(request){
    const [id] = await db('rides').insert(request)
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



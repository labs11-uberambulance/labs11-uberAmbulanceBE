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
    createRide,
    findLocale
};

async function findDrivers(location){
    const latlng = location.split(",");
    const lat = Number(latlng[0]);
    const lng = Number(latlng[1]);
 
    // Setting initial range 
    var maxLng = lng + .125; //.125
    var minLng = lng - .125;//.125
    var maxLat = lat + .125;//.125
    var minLat = lat - .125;//.125
    // Find Active Drivers
    const drivers = await Users.findDrivers();
    const driversInArea = [];
    function loopDrivers(){
    drivers.forEach(driver => {
        if(driver.active){
        const latlng = driver.location.latlng.split(",");
        const lat = Number(latlng[0]);
        const lng = Number(latlng[1]);
        if (lng< maxLng && lng > minLng) {
            if (lat < maxLat && lat > minLat) {
                if(!driversInArea.includes(driver)){
                    driversInArea.push(driver)
                }
            }
        }
    }
    })
    }
    loopDrivers()
        do{
            maxLat += .066
            maxLng += .066
            minLat -= .066
            minLng -= .066
            loopDrivers()
        }while(driversInArea.length<=5)    
    console.log(driversInArea.length)
//Convert Drivers Locations to URL Format
    var destinations =[]
    driversInArea.forEach((driver, i) =>{
            const latlng = driver.location.latlng.split(",");
            const lat = Number(latlng[0]);
            const lng = Number(latlng[1]);
            destinations.push(`${lat}%2C${lng}%7C`)
     })
// Format Google URL with Origin, Destinations and API
   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${destinations.join('')}&key=${process.env.MYMAPSKEY}`
// Return Google distance information 
   const results = await axios.get(url).then(res=>res.data).catch(err=>console.log(err))
// Parse Google Distance information to return distance, and driver.

    var nearest = []
    results.rows[0].elements.forEach((driver, i) =>{
          nearest.push({"driver": driversInArea[i],  "distance": driver.distance, "duration":driver.duration, "id":i})
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

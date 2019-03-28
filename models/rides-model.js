const db = require("../data/dbConfig.js");
const Users = require('./user-model.js')
const axios = require('axios');
module.exports = {
    findDrivers,
    findRide,
    mothersRides,
    driversRides,
    update,
    createRide
};

async function findDrivers(lat, long){
    
    const maxLng = long + 1;
    const minLng = long - 1;
    const maxLat = lat + 1;
    const minLat = lat - 1;
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
    console.log(driversInArea)
    //Convert Drivers Locations to URL Format
    // var destinations =[]
    // activeDrivers.forEach((local, i) =>{
    //     console.log(i)
    //     if(i ===4){
    //         const lati = parseInt(local.latitude)
    //         const longi = parseInt(local.longitude)
    //         destinations.push(`${lati}%2C${longi}&`)
    //        }
    //        else{
    //        const lati = parseInt(local.latitude)
    //         const longi = parseInt(local.longitude)
    //         destinations.push(`${lati}%2C${longi}%7C`)
    //        }
    //  })
    // Format Google URL with Origin, Destinations and API
//    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${long}&destinations=${destinations.join('')}key=${process.env.MYMAPSKEY}`
//    // Return Google distance information 
//    const result = await axios.get(url).then(res=>res.data).catch(err=>console.log(err))
//     //  Check that res.status === "OK"
//    return result
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



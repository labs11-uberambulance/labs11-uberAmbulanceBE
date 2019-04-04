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
    notifyDriver
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


// LOGIC TO BOOK A DRIVER AND FIND NEW DRIVER IF REQUEST REJECTED OR TIMER RUNS OUT

async function rejectionHandler (info) {
    const { ride_status, driver_id, start, rejected_drivers } = (await findRide(info.ride_id))[0];
    if ( ride_status !== 'waiting_for_driver' && driver_id !== info.requested_driver ) return;
    const updatedRejects = !!rejected_drivers ? [...rejected_drivers.rejects, info.requested_driver] : [info.requested_driver];
    const rejectsJSON = JSON.stringify({ rejects: updatedRejects })
    console.log('rejected array: ', updatedRejects)
    try {
        const drivers = await db('drivers').where({ active: true });
            // const drivers = await findDrivers(start);
        const newDriver = drivers.filter(driver => {
        if (driver.price < info.price + 3 && !updatedRejects.includes(driver.firebase_id)) return true// add check for FCM_token when we deploy
            return false
        })[0];
        await db('rides').where({ id: info.ride_id }).update({ driver_id: newDriver.firebase_id, rejected_drivers: rejectsJSON })
        let rideInfo = { ...info, requested_driver: newDriver.firebase_id }
        notifyDriver(null , rideInfo);
    } catch (err) {
        console.log(err)
    }
}

async function initDriverLoop(info){
    setTimeout( async () => {
        const { ride_status, driver_id } = (await findRide(info.ride_id))[0];
        if (ride_status === 'waiting_on_driver' && driver_id === info.requested_driver) {
            console.log('driver that rejected: ', driver_id)
            rejectionHandler(info);
        }
    }, 10000)
}

// function notifyDriver(FCM_token, rideInfo) {
//     const messaging = fbAdmin.messaging();
//     const message = { 
//         notification: {
//             title: `You have a new ride request! (${rideInfo.distance}km) `,
//             body: `${rideInfo.name} needs to be taken to ${rideInfo.hospital}, -price: ${rideInfo.price}USh`
//         },
//         data: { distance: rideInfo.distance, name: rideInfo.name, phone: rideInfo.phone, price: rideInfo.price, ride_id: rideInfo.ride_id }
//     }
//     console.log('waiting on driver: ', rideInfo.requested_driver)
//     initDriverLoop(rideInfo)
//                 // const message = { 
//             //     notification: {
//             //         title: `You have a new ride request! (${distance}km) `,
//             //         body: `${name} needs to be taken to ${hospital}, -price: ${rate}USh`
//             //     },
//             //     data: { distance, name, phone, rate, ride_id: id, hospital }
//             // }
//     // messaging.sendToDevice(FCM_token, message).then(response => {
//     //     // SET TIMER FUNCTION TO WAIT FOR RESPONSE OR MOVE ON.
//     //     if (response.successCount !== 0) {
//     //         initDriverLoop(firebase_id, ride_id)
//     //     }
//     //     return
//     //  }).catch(err => {
//     //     console.log('Error sending message:', err);
//     //     // We should take over again, and search for another driver (Stretch).
//     //  })
// }


const db = require("../data/dbConfig.js");

module.exports = {
    findDrivers
};

// Uganda between -1.4, 4.2, faker doesn't play nice with neg nums
// Uganda between 29.5, 35.5
async function findDrivers(lat, long){
    // const Uganda = //GOOGLE API {lat: -1.4, 4.2} {long: 29.5, 35.5}
    const activeDrivers = await db('drivers').where({"active": true})
    return activeDrivers
    // Send ActiveDrivers to Google to see where they are located

}

// async function createRide(data){
//     if(data.lat && data.long){
//         const lat = data.lat 
//         const long = data.long
//     }
//     else{
//         const location = 
//     }
    
//     const driver = data.driver_id
//     const passenger = data.mother_id 
    
//     const ride = {driver, passenger}
//     const [id] = await db('rides').insert(ride, "id");
//     return db("rides").where(id);
// }
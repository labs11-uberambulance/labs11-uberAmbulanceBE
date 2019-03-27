const db = require("../data/dbConfig.js");

module.exports = {
    findDrivers
};

// Uganda between -1.4, 4.2, faker doesn't play nice with neg nums
// Uganda between 29.5, 35.5
async function findDrivers(lat, long, location){
    
    // const Uganda = //GOOGLE API {lat: -1.4, 4.2} {long: 29.5, 35.5}
    const activeDrivers = await db('drivers').where({"active": true}).select("latitude", "longitude")
    var destinations =[]
    for(i= 0; i<=5; i++){
        console.log(activeDrivers[i])
        if(i ===5){
         const lati = parseInt(activeDrivers[i].latitude)
         const longi = parseInt(activeDrivers[i].longitude)
         destinations.push(`${lati}%${longi}&`)
        }
        else{
            const lati = parseInt(activeDrivers[i].latitude)
         const longi = parseInt(activeDrivers[i].longitude)
         destinations.push(`${lati}%${longi}%`)
        }
      activeDrivers[i]
    }
    
    // Send ActiveDrivers Lat and Long to Google to see where they are located
   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${destinations.join('')}key=OURAPIKEY`
   console.log(url);
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
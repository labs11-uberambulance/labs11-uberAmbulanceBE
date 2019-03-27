const db = require("../data/dbConfig.js");

module.exports = {
    findDrivers
};

// Uganda between -1.4, 4.2, faker doesn't play nice with neg nums
// Uganda between 29.5, 35.5
async function findDrivers(lat, long, location){
    
    // const Uganda = //GOOGLE API {lat: -1.4, 4.2} {long: 29.5, 35.5}
    const activeDrivers = await db('drivers').where({"active": true}).select("latitude", "longitude").limit(5)
    var destinations =[]
    activeDrivers.forEach((local, i) =>{
        console.log(i)
        if(i ===4){
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
    // Send ActiveDrivers Lat and Long to Google to see where they are located
   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${destinations.join('')}key=${process.env.GOOGLE_MAPS_KEY}`
   
}
// https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=3.5,30.5&destinations=0%2C31%7C0%2C33%7C0%2C32%7C1%2C32%7C


// &key=AIzaSyA1tooxvHSDPxbHz2LKMwALSben7D93MLk


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
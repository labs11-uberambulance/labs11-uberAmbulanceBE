const db = require("../data/dbConfig.js");
const axios = require('axios');
module.exports = {
    findDrivers
};

async function findDrivers(lat, long, location){
    // Find 5 active drivers
    const activeDrivers = await db('drivers').where({"active": true}).select("latitude", "longitude").limit(5)
    //Convert Drivers Locations to URL Format
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
    // Format Google URL with Origin, Destinations and API
   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${long}&destinations=${destinations.join('')}key=${process.env.MYMAPSKEY}`
   // Return Google distance information 
   const result = await axios.get(url).then(res=>res.data).catch(err=>console.log(err))
    //  Check that res.status === "OK"
   return result
}

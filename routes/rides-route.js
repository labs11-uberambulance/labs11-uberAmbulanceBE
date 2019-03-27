
// /api/rides/new-ride/	POST 
// /api/rides/	GET
// /api/rides/	GET
// /api/rides/	PUT

const router = require("express").Router();
const Rides = require("../models/rides-model.js");

// /api/drivers/	POST 
router.post('/drivers', (req, res) => {
    const lat = req.body.lat;
    const long = req.body.long;
    Rides.findDrivers(lat, long)
        .then( data => 
          {res.status(201).json(data);}
        )
        .catch(err =>{
            console.log(err)
            res.status(500).json({ message: `Failed to Coordinate Ride`, error: err })
        })
});


router.post('/new-ride', (req, res) => {
//    const driver = req.body.driver_id;
//    const destination = req.body.destination 
});

// Get ride by ride.id
router.get('/', (req, res) => {
    const ride_id = req.body.ride_id
});
// get a user's ride
router.get('/', (req, res) => {
    
});
//Update Ride
router.put('/', (req, res) => {
    
});

module.exports = router;
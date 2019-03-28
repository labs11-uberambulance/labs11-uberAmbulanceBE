
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
        .then(
            data => {res.status(201).json(data);}
        )
        .catch( error =>{
            res.status(500).json({ message: `Failed to Coordinate Ride`, error })
        })
    });


// Create A New Ride
router.post('/new-ride', (req, res) => {
    // IF STATEMENT ABOUT BEING UNREGISTERED
    
    // REGISTERED ROUTE
    const start_address = JSON.stringify(req.body.start_address);
    const destination_address = JSON.stringify(req.body.destination_address);
    const request = {
        ...req.body,
        "start_address": start_address,
        "destination_address":destination_address
    }

    console.log("new:", request)
    Rides.createRide(request)
    .then(
        data => {res.status(201).json(data);}
    )
    .catch( error =>{
        console.log(error)
        res.status(500).json({ message: `Failed to Coordinate Ride`, error })
    })
});

// Get a specified Ride
router.get('/', (req, res) => {
    const rideId = req.body.ride_id
    Rides.findRide(rideId)
    .then(
        data => res.status(200).json(data)
    )
    .catch(error=>{
        res.status(500).json({message:'Cannot locate that ride', error})
    })
});
// Get a mothers rides
router.get('/mother', (req, res) => {
    const userId = req.body.mother_id;
    Rides.mothersRides(userId)
    .then(
        data => res.status(200).json(data)
    )
    .catch(error=>{
        res.status(500).json({message:'Cannot locate their rides', error})
    })
});
// Get a drivers rides
router.get('/driver', (req, res) => {
    const userId = req.body.driver_id;
    Rides.mothersRides(userId)
    .then(
        data => res.status(200).json(data)
    )
    .catch(error=>{
        res.status(500).json({message:'Cannot locate their rides', error})
    })
});

// Update a given ride
router.put('/', (req, res) => {
    const id = req.body.ride_id
    const changes = req.body
    Rides.update(id, changes)
});

module.exports = router;

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
    const location = req.body.village;
    if(lat===null || long===null){
        Rides.findDrivers(location)
        .then(
            data => {res.status(201).json(data);}
        )
        .catch( err =>{
            res.status(500).json({ message: `Failed to Coordinate Ride`, error: err })
        })
    } else{
        Rides.findDrivers(lat, long)
        .then(
            data => {res.status(201).json(data);}
        )
        .catch( err =>{
            res.status(500).json({ message: `Failed to Coordinate Ride`, error: err })
        })
    }
});


router.post('/new-ride', (req, res) => {
    
});

router.get('/', (req, res) => {
    
});

router.get('/', (req, res) => {
    
});

router.put('/', (req, res) => {
    
});

module.exports = router;
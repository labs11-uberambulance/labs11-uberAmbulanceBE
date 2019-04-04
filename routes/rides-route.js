
// /api/rides/new-ride/	POST 
// /api/rides/	GET
// /api/rides/	GET
// /api/rides/	PUT

const router = require("express").Router();
const Rides = require("../models/rides-model.js");
const fbAdmin = require('firebase-admin');
const twilio = require('../services/twilio');
const db = require('../data/dbConfig');

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
    // REGISTERED ROUTE
    var start_address = JSON.stringify(req.body.start_address);
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
// Get a mothers ridesk
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

router.post('/request/driver/:firebase_id', async (req, res, next) => {
    const { firebase_id } = req.params
    const user_id = req.user.uid;
    const { distance, phone, name, price, eta, hospital, } = req.body;
    try {
        const { active, fcm_token } = await db('user').where({ firebase_id }).first();
        if (!active || !fcm_token) {
            // should take over and search for another driver
        } else {
            // SHOULD CREATE A NEW RIDE AT THIS POINT, BEFORE MESSAGING

            // const [id] = await db('rides').insert({ ... });
            const messaging = fbAdmin.messaging();
            const message = { 
                notification: {
                    title: "You have a new ride request!",
                    body: ` ${name} is ${distance}km , -price: USh${price}`
                },
                data: { distance, name, phone, price, eta, ride_id: id }
             }
             messaging.sendToDevice(fcm_token, message).then(response => {
                // SET TIMER FUNCTION TO WAIT FOR RESPONSE OR MOVE ON.
             }).catch(err => {
                console.log('Error sending message:', err);
                // We should take over again, and search for another driver (Stretch).
             })
        }
    } catch (err) {
        console.log()
    }
})

router.get('/driver/accepts/:ride_id', async (req, res, next) => {
    const { ride_id: id } = req.params
    try {
        // Move on with filling in rest of rides object.
        await db('rides').where({ id }).update({ status: '...' })
        // Twillio takes over
        const {mother, driver, eta, to, price } = await db('drivers').where({ 'r.id': id })
            .join('mothers as m', 'r.mother_id', 'm.firebase_id')
            .join('drivers as d', 'r.driver_id', 'd.firebase_id')
            .select('m.name as mother', 'd.name as driver', 'm.phone as to', 'r.eta', 'r.price as price')
        await twilio.messages.create({
            from: '+19179709371', to,
            body: `${mother}, ${driver} is on their way, the total price will be USh${price}. Estimated time: ${eta}mins.`
        })
    } catch (err) {
        console.log(err);
    } 

})

router.get('/driver/rejects/:ride_id', async (req, res, next) => {
    const { ride_id: id } = req.params;
    // trigger function to dispatch next best driver.
})

module.exports = router;
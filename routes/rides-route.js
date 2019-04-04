// /api/rides/new-ride/    POST
// /api/rides/    GET
// /api/rides/    GET
// /api/rides/    PUT

const router = require("express").Router();
const Rides = require("../models/rides-model.js");
const fbAdmin = require("firebase-admin");
const twilio = require("../services/twilio");
const db = require("../data/dbConfig");

// /api/drivers/    POST
router.post("/drivers", (req, res) => {
  console.log("#", req.body);
  const location = req.body.location;
  Rides.findDrivers(location)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res.status(500).json({ message: `Failed to Coordinate Ride`, error });
    });
});

// Create A New Ride
router.post("/new-ride", (req, res) => {
  // REGISTERED ROUTE
  var start = JSON.stringify(req.body.start);
  const destination = JSON.stringify(req.body.destination);
  const request = {
    ...req.body,
    start,
    destination
  };
  Rides.createRide(request)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Failed to Coordinate Ride`, error });
    });
});

// Get a specified Ride
router.get("/", (req, res) => {
  const rideId = req.body.ride_id;
  Rides.findRide(rideId)
    .then(data => res.status(200).json(data))
    .catch(error => {
      res.status(500).json({ message: "Cannot locate that ride", error });
    });
});
// Get a mothers ridesk
router.get("/mother", (req, res) => {
  const userId = req.body.mother_id;
  Rides.mothersRides(userId)
    .then(data => res.status(200).json(data))
    .catch(error => {
      res.status(500).json({ message: "Cannot locate their rides", error });
    });
});
// Get a drivers rides
router.get("/driver", (req, res) => {
  const userId = req.body.driver_id;
  Rides.mothersRides(userId)
    .then(data => res.status(200).json(data))
    .catch(error => {
      res.status(500).json({ message: "Cannot locate their rides", error });
    });
});

// Update a given ride
router.put("/", (req, res) => {
  const id = req.body.ride_id;
  const changes = req.body;
  Rides.update(id, changes);
});

router.post("/request/driver/:firebase_id", async (req, res, next) => {
  // return res.status(404).json({ message: "Still building : )" });
  let { firebase_id } = req.params;
  const mother_id = req.user.uid;
  const { start, end, distance, name, phone, hospital } = req.body;
  try {
    // // proper
    // const user = await db('users as u').where({'u.firebase_id': firebase_id })
    //             .join('drivers as d', 'u.firebase_id', 'd.firebase_id').first()
    // improper
    const { FCM_token } = await db("users")
      .where({ firebase_id })
      .first();
    const active = true;
    if (!active || !FCM_token) {
      // should take over and search for another driver
    } else {
      // SHOULD CREATE A NEW RIDE AT THIS POINT, BEFORE MESSAGING
      const { firebase_id, price } = (await db("drivers"))[0];
      const rate = `${price}`;
      const [id] = await db("rides").insert(
        {
          driver_id: firebase_id,
          mother_id,
          start,
          destination: end,
          ride_status: "waiting_on_driver"
        },
        "id"
      );
      const rideInfo = {
        distance,
        name,
        phone,
        hospital,
        ride_id: id,
        requested_driver: firebase_id,
        price
      };
      Rides.notifyDriver(null, rideInfo);
      // move out of set timeout when we are deployed.
      // setTimeout(() => {
      //     messaging.sendToDevice(FCM_token, message).then(response => {
      //     //   // **** DO NOT UNCOMMENT ****
      //     //    if (response.successCount !== 0) {
      //     //        Rides.initDriverLoop(firebase_id)
      //     //    }
      //        return
      //     }).catch(err => {
      //        console.log('Error sending message:', err);
      //        // We should take over again, and search for another driver (Stretch).
      //     })
      // }, 5000)
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/driver/accepts/:ride_id", async (req, res, next) => {
  const { ride_id: id } = req.params;
  try {
    // // Move on with filling in rest of rides object.
    // await db('rides').where({ id }).update({ status: '...' })
    // // Twillio takes over
    // const {mother, driver, eta, to, price } = await db('drivers').where({ 'r.id': id })
    //     .join('mothers as m', 'r.mother_id', 'm.firebase_id')
    //     .join('drivers as d', 'r.driver_id', 'd.firebase_id')
    //     .select('m.name as mother', 'd.name as driver', 'm.phone as to', 'r.eta', 'r.price as price')
    const to = "+13476812414";
    const mother = "Lauren";
    const driver = "James";
    const price = 2;
    const eta = 15;
    await twilio.messages.create({
      from: "+19179709371",
      to,
      body: `${mother}, ${driver} is on their way, the total price will be ${price}USh. Estimated time: ${eta}mins.`
    });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
});

router.get("/driver/rejects/:ride_id", async (req, res, next) => {
  const { ride_id } = req.params;
  const driver_id = req.user.uid;
  try {
    await Rides.rejectionHandler(ride_id, driver_id);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

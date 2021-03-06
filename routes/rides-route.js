// /api/rides/new-ride/    POST
// /api/rides/    GET
// /api/rides/    GET
// /api/rides/    PUT

const router = require("express").Router();
const Rides = require("../models/rides-model.js");
const Users = require("../models/user-model");
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
// Get a mothers rides
router.get("/mother", (req, res) => {
  const id = req.user.user_id; // gives firebase_id
  Rides.mothersRides(id)
    .then(data => res.status(200).json(data))
    .catch(error => {
      res.status(500).json({ message: "Cannot locate their rides", error });
    });
});
// Get a drivers rides
router.get("/driver", (req, res) => {
  const id = req.user.user_id; // gives firebase_id
  Rides.driversRides(id)
    // .then(data => {
    //   return data.filter((ride, i) => i < 6);
    // })
    .then(data => {
      // try {
      //   let rides = await data.map(async ride => {
      //     try {
      //       const destNameMother = await Rides.reverseGeocodeLatLng(ride.start);
      //       const destNameHospital = await Rides.reverseGeocodeLatLng(
      //         ride.destination
      //       );
      //       // console.log("ABOVE: ", destName.results[0]);
      //       // console.log("HERE: ", { ...ride, destName });
      //       return { ...ride, destNameMother, destNameHospital };
      //     } catch (error) {
      //       console.log("Error reverse geocoding driver ride");
      //     }
      //   });
      // rides = await Promise.all(rides);
      // console.log("GET /rides/driver : ", data);
      res.status(200).json(data);
      // } catch (error) {
      //   console.log(error);
      // }
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot locate their rides", error });
    });
});

// Get a specified Ride
router.get("/:id", (req, res) => {
  const rideId = req.params.id;
  Rides.findRide(rideId)
    .then(data => res.status(200).json(data))
    .catch(error => {
      res.status(500).json({ message: "Cannot locate that ride", error });
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
  const { start, end, distance, name, phone, hospital, startName } = req.body;
  try {
    // // proper
    const { active, FCM_token, price } = await db("users as u")
      .where({ "u.firebase_id": firebase_id })
      .join("drivers as d", "u.firebase_id", "d.firebase_id")
      .first();
    // SHOULD CREATE A NEW RIDE AT THIS POINT, BEFORE MESSAGING
    const [id] = await db("rides").insert(
      {
        driver_id: firebase_id,
        mother_id,
        start,
        start_name: startName,
        destination: end,
        dest_name: hospital,
        price,
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
    setTimeout(() => {
      Rides.notifyDriver(FCM_token, rideInfo);
      res
        .status(200)
        .json({ message: "Contacting driver, we will update you soon." });
    }, 5000);
  } catch (err) {
    console.log(err);
  }
});

router.get("/driver/accepts/:ride_id", async (req, res, next) => {
  const { ride_id: id } = req.params;
  try {
    // get the ride, associated info from mother and driver
    const ride = await db("rides").where({ id });
    const mother = (await Users.findBy({ firebase_id: ride[0].mother_id }))[0];
    const driver = (await Users.findBy({ firebase_id: ride[0].driver_id }))[0];
    const { price } = (await Users.findDriversBy({
      firebase_id: driver.firebase_id
    }))[0];
    // // Update the ride data.
    await db("rides")
      .where({ id })
      .update({ ride_status: "Driver en route", price });

    // // Twillio takes over
    await twilio.messages.create({
      from: "+19179709371",
      to: `${mother.phone}`,
      body: `${mother.name}, ${
        driver.name
      } is on their way, the total price will be ${price}USh.`
    });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

router.get("/driver/arrives/:ride_id", async (req, res, next) => {
  const { ride_id: id } = req.params;
  try {
    // // Move on with filling in rest of rides object.
    await db("rides")
      .where({ id })
      .update({ ride_status: "arrived_at_mother" });
    // // Twillio takes over
    const ride = await db("rides").where({ id });

    const mother = (await Users.findBy({ firebase_id: ride[0].mother_id }))[0];
    const driver = (await Users.findBy({ firebase_id: ride[0].driver_id }))[0];
    await twilio.messages.create({
      from: "+19179709371",
      to: `${mother.phone}`,
      body: `${mother.name}, ${driver.name} has arrived!`
    });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

router.get("/driver/delivers/:ride_id", async (req, res, next) => {
  const { ride_id: id } = req.params;
  try {
    // // Move on with filling in rest of rides object.
    await db("rides")
      .where({ id })
      .update({ ride_status: "complete" });
    // // Twillio takes over
    const ride = await db("rides").where({ id });

    const mother = (await Users.findBy({ firebase_id: ride[0].mother_id }))[0];
    const driver = (await Users.findBy({ firebase_id: ride[0].driver_id }))[0];
    await twilio.messages.create({
      from: "+19179709371",
      to: `${mother.phone}`,
      body: `${mother.name}, thank you for using BirthRide`
    });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

router.post("/driver/rejects/:ride_id", async (req, res, next) => {
  const { ride_id } = req.params;
  const driver_id = req.user.uid;
  const data = req.body.data;
  const info = { ...data, requested_driver: driver_id, ride_id };
  console.log("driver directly rejected request ", data);
  try {
    // first revert ride status (in case driver started ride but had to cancel)
    // await db("rides")
    //   .where({ id })
    //   .update({ ride_status: "waiting_on_driver" });
    console.log("DONE");
    await Rides.rejectionHandler(info);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

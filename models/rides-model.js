const db = require("../data/dbConfig.js");
const Users = require("./user-model.js");
const axios = require("axios");
const fbAdmin = require("firebase-admin");
const twilio = require("../services/twilio");

require("dotenv").config();
module.exports = {
  findDrivers,
  findRide,
  mothersRides,
  driversRides,
  update,
  createRide,
  findLocale,
  reverseGeocodeLatLng,
  rejectionHandler,
  notifyDriver
};

async function findDrivers(location) {
  const latlng = location.split(",");
  const lat = Number(latlng[0]);
  const lng = Number(latlng[1]);

  // Setting initial range
  var maxLng = lng + 0.125; //.125
  var minLng = lng - 0.125; //.125
  var maxLat = lat + 0.125; //.125
  var minLat = lat - 0.125; //.125
  // Find Active Drivers
  const drivers = await Users.findDrivers();
  const driversInArea = [];
  function loopDrivers() {
    drivers.forEach(driver => {
      if (driver.active && driver.FCM_token) {
        const latlng = driver.location.latlng.split(",");
        const lat = Number(latlng[0]);
        const lng = Number(latlng[1]);
        if (lng < maxLng && lng > minLng) {
          if (lat < maxLat && lat > minLat) {
            if (!driversInArea.includes(driver)) {
              driversInArea.push(driver);
            }
          }
        }
      }
    });
    if (driversInArea.length === 0) {
      console.log(maxLng - lng);
    } else {
      console.log(driversInArea.length);
    }
  }
  loopDrivers();
  do {
    console.log(maxLng - lng);
    maxLat += 0.066;
    maxLng += 0.066;
    minLat -= 0.066;
    minLng -= 0.066;
    loopDrivers();
    console.log(driversInArea.length);
  } while (maxLng - lng < 0.6);
  // if there are no drivers in the area:
  if (!driversInArea.length) {
    throw new Error("No Drivers in Area");
  }
  //Convert Drivers Locations to URL Format
  var destinations = [];
  driversInArea.forEach((driver, i) => {
    // console.log("driver in area: ", driver);
    const latlng = driver.location.latlng.split(",");
    const lat = Number(latlng[0]);
    const lng = Number(latlng[1]);
    destinations.push(`${lat}%2C${lng}%7C`);
  });
  // Format Google URL with Origin, Destinations and API
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${destinations.join(
    ""
  )}&key=${process.env.GOOGLE_MAPS_KEY}`;

  // // Return Google distance information
  const results = await axios
    .get(url)
    .then(res => res.data)
    .catch(err => console.log(err));
  // Parse Google Distance information to return distance, and driver.
  var nearest = [];
  results.rows[0].elements.forEach((driver, i) => {
    nearest.push({
      driver: driversInArea[i],
      distance: driver.distance,
      duration: driver.duration,
      id: i
    });
  });
  return nearest;
}

async function createRide(request) {
  console.log("model", request);
  const [id] = await db("rides").insert(request, "id");
  console.log(id);
  return findRide(id);
}

function findRide(filter) {
  return db("rides").where({ id: filter });
}
function mothersRides(id) {
  return db("rides").where({ mother_id: id });
}
function driversRides(id) {
  return db("rides").where({ driver_id: id });
}
async function update(id, changes) {
  return await db("rides")
    .where({ id })
    .update({ changes })
    .then(count => (count > 0 ? findRide(id) : null));
}

async function findLocale(village) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${village}&region=ug&components=country:UG&key=${
    process.env.GOOGLE_MAPS_KEY
  }`;
  const results = await axios
    .get(url)
    .then(res => res.data)
    .catch(err => console.log(err));
  return results;
}

async function reverseGeocodeLatLng(latlng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${
    process.env.GOOGLE_MAPS_KEY
  }`;
  const result = await axios
    .get(url)
    .then(res => res.data)
    .catch(err => console.log(err));
  // console.log("revGeocode: ", result);
  return result;
}

// LOGIC TO BOOK A DRIVER AND FIND NEW DRIVER IF REQUEST REJECTED OR TIMER RUNS OUT

async function rejectionHandler(info) {
  const {
    ride_status,
    driver_id,
    start,
    rejected_drivers,
    mother_id,
    price
  } = (await findRide(info.ride_id))[0];
  if (
    ride_status !== "waiting_for_driver" &&
    driver_id !== info.requested_driver
  )
    return;
  const updatedRejects = !!rejected_drivers
    ? [...rejected_drivers.rejects, info.requested_driver]
    : [info.requested_driver];
  const rejectsJSON = JSON.stringify({ rejects: updatedRejects });
  console.log("rejected array: ", updatedRejects);
  // counter added to never exceed 5 rejections.
  if (updatedRejects.length > 5) {
    await db("rides")
      .where({ id: info.ride_id })
      .update({
        // TODO: delete the ride? keeping it for now, easier when testing
        driver_id: "driver0FIREBASE",
        rejected_drivers: rejectsJSON
      });
    // notify mother that there are no drivers
    const mother = (await Users.findBy({ firebase_id: mother_id }))[0];
    await twilio.messages.create({
      from: "+19179709371",
      to: `${mother.phone}`,
      body: `${
        mother.name
      }, we were unable to coordinate a ride for you at this time. Please try again later or call <THE BACKUP HOTLINE>`
    });
    return;
  }
  try {
    const drivers = await findDrivers(start);
    let newDriver = drivers.filter(driver => {
      if (
        //Driver price should never change always first driver's price,
        driver.driver.price < price + 3 &&
        !updatedRejects.includes(driver.driver.firebase_id)
      )
        return true; // add check for FCM_token when we deploy
      return false;
    })[0];
    if (!newDriver) {
      return;
    } else {
      newDriver = newDriver.driver;
    }
    await db("rides")
      .where({ id: info.ride_id })
      .update({
        driver_id: newDriver.firebase_id,
        rejected_drivers: rejectsJSON
      });
    let rideInfo = { ...info, requested_driver: newDriver.firebase_id };
    notifyDriver(newDriver.FCM_token, rideInfo);
  } catch (err) {
    console.log(err);
  }
}

async function initDriverLoop(info) {
  setTimeout(async () => {
    const { ride_status, driver_id } = (await findRide(info.ride_id))[0];
    console.log("STATUS: ", ride_status);
    console.log("driver in ride object: ", driver_id);
    console.log("driver that called timeout: ", info.requested_driver);
    if (
      ride_status === "waiting_on_driver" &&
      driver_id === info.requested_driver
    ) {
      // console.log("driver that rejected: ", driver_id);
      rejectionHandler(info);
    }
  }, 600000);
}

function notifyDriver(FCM_token, rideInfo) {
  const messaging = fbAdmin.messaging();
  const message = {
    notification: {
      title: `You have a new ride request! (${rideInfo.distance}km) `,
      body: `${rideInfo.name} needs to be taken to ${
        rideInfo.hospital
      }, -price: ${rideInfo.price}USh`,
      clickAction: "https://birthride.herokuapp.com/"
    },
    data: {
      distance: `${rideInfo.distance}`,
      name: rideInfo.name,
      phone: rideInfo.phone,
      price: `${rideInfo.price}`,
      ride_id: `${rideInfo.ride_id}`,
      hospital: `${rideInfo.hospital}`
    }
  };
  const options = { timeToLive: 60 * 10 };
  console.log("waiting on driver: ", rideInfo.requested_driver);
  messaging
    .sendToDevice(FCM_token, message, options)
    .then(response => {
      // SET TIMER FUNCTION TO WAIT FOR RESPONSE OR MOVE ON.
      if (response.successCount !== 0) {
        initDriverLoop(rideInfo);
      }
      return;
    })
    .catch(err => {
      console.log("Error sending message:", err);
      // We should take over again, and search for another driver (Stretch).
    });
}

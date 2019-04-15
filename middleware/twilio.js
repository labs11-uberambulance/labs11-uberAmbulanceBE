const  Users = require('../models/user-model')
const Rides = require('../models/rides-model')
const { MessagingResponse } = require('twilio').twiml;
const db = require("../data/dbConfig");
const faker = require('faker');
const axios = require('axios');

module.exports.handle_incoming_messages = async (req, res, next) => {
    const twiml = new MessagingResponse();
    const { Body: clientMessage } = req.body;
    const motherPhone = req.body.From;
    var message = clientMessage.split('**')
    var Name = message[0];
    var Pickup = message[1];
    if (Name && Pickup) {
        const googlePickup = await Rides.findLocale(Pickup)
        const googleLatLng = googlePickup.results[0].geometry.location;
        var latlngArr = []
        latlngArr.push(Object.values(googleLatLng))
        var latlng = latlngArr.join()
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latlng}&radius=8000&type=hospital&key=${process.env.GOOGLE_MAPS_KEY}`
        const destinations = await axios.get(url)
        const closest = destinations.data.results[0]
        const closestLatLng = closest.geometry.location
        var latlngClo = [];
        latlngClo.push(Object.values(closestLatLng))
        var latlngClosest = latlngClo.join()
        try{
            const drivers = await (Rides.findDrivers(latlng))
            const first = drivers[0].driver
            const distance = drivers[0].distance
            const newUser= await Users.add({
                name: Name,
                firebase_id: faker.random.alphaNumeric(8),
                phone:motherPhone,
                user_type: 'mothers',
                location: {latlng}
            })
            const newMother = await Users.addMother({
                firebase_id: newUser.firebase_id
            })
            const [id] = await db("rides").insert(
                {
                    driver_id: first.firebase_id,
                    mother_id: newUser.firebase_id,
                    start: latlng,
                    start_name: googlePickup.results[0].formatted_address,
                    dest_name: closest.name,
                    destination: latlngClosest,
                    price: first.price,
                    ride_status: "waiting_on_driver"
                },
                "id"
            )
            const rideInfo = {
                distance: distance.text,
                name: Name,
                phone: motherPhone,
                price: first.price,
                ride_id: id,
                hospital: closest.name
            }
            Rides.notifyDriver(first.FCM_token, rideInfo)
            twiml.message(`Thank you for your request. We are coordinating your ride! Your User_ID is ${newUser.firebase_id}, please hold onto this in case you wish to report a problem in the future`);
        }
       catch (err){
           console.log(err)
           twiml.message("We apologize, there's been an error in our server. Please contact this HOTLINE to coordinate a ride.");
       }
    } 
    else if(Name && Pickup && !Dropoff) {
        twiml.message('Sorry please include a Drop off health center or hospital. Your text should be formatted like this: NAME**CLOSESTCITY**DROPOFFLOCATION');
    } 
    else if (Name === '' || Pickup === '' || Dropoff === "" ) {
        twiml.message("Sorry it looks like you're request is missing some critical information. Your text should be formatted like this: NAME**CLOSESTCITY**DROPOFFLOCATION");
    } else {
        twiml.message("Sorry it looks like you're request is missing some critical information. Your text should be formatted like this: NAME**CLOSESTCITY**DROPOFFLOCATION");
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}
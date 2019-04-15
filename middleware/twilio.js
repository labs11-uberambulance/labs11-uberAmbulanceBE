const  Users = require('../models/user-model')
const Rides = require('../models/rides-model')
const { MessagingResponse } = require('twilio').twiml;
const db = require("../data/dbConfig");
const faker = require('faker');

module.exports.handle_incoming_messages = async (req, res, next) => {
    const twiml = new MessagingResponse();
    const { Body: clientMessage } = req.body;
    const motherPhone = req.body.From;
    var message = clientMessage.split('**')
    var Name = message[0];
    var Pickup = message[1];
    var Dropoff = message[2];

    console.log(Name, Pickup, Dropoff)
    if (Name && Pickup && Dropoff) {
        const googlePickup = await Rides.findLocale(Pickup)
        const googleLatLng = googlePickup.results[0].geometry.location;
        var latlngArr = []
        latlngArr.push(Object.values(googleLatLng))
        var latlng = latlngArr.join()
        try{
            const drivers = await (Rides.findDrivers(latlng))
            console.log(drivers)
            const first = drivers[0].driver
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
            console.log(newMother)
            // console.log('first driver', first.driver)
            const [id] = await db("rides").insert(
                {
                    driver_id: first.firebase_id,
                    mother_id: newUser.firebase_id,
                    start: latlng,
                    start_name: googlePickup.results[0].formatted_address,
                    dest_name: Dropoff,
                    price: first.price,
                    ride_status: "waiting_on_driver"
                },
                "id"
            )
            console.log(id)
        }
        
       catch (err){
           console.log(err)
       }

        twiml.message('Thank you for your request. We are coordinating your ride!');
    } 
    else if(Name && Pickup && !Dropoff) {
        twiml.message('Sorry please include a Drop off health center or hospital. Your text should be formatted like this: NAME**CLOSESTCITY**DROPOFFLOCATION');
    } 
    else if (Name === '' || Pickup === '' || Dropoff === "" ) {
        twiml.message("Sorry  it looks like you're request is missing some critical information. Your text should be formatted like this: NAME**CLOSESTCITY**DROPOFFLOCATION");
    }
    else if (+clientMessage === 4) {
        twiml.message('you have choosen option 4');
    } 
    else if (+clientMessage === 5) {
        twiml.message('you have choosen option 5');
    } else {
        // twiml.message('The Robots are coming! Head for the hills!');
        twiml.message('Thank you for contacting Birthride. We are currently working to find the closest driver to you. We thank you for your patience.');
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}
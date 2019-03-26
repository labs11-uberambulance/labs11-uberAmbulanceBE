const twilio = require('twilio')
const accountSid = process.env.TWILIO_ACCSID;
const authToken = process.env.TWILIO_TOKEN;

module.exports = new twilio(accountSid, authToken);
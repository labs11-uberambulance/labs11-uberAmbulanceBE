const express = require('express');
const router = express.Router();
const twilio = require('../services/twilio');
const { handle_incoming_messages } = require('../middleware/twilio');



router.get('/text-me', (req, res, next) => {
    twilio.messages.create({
        body: 'Hello Orlando, from Node',
        to: process.env.MY_NUMBER,
        from: '+19179709371'
    }).then(message => {
        res.status(200).json({id: message.sid})
    });
})


router.post('/sms/receiver', handle_incoming_messages)




module.exports = router;
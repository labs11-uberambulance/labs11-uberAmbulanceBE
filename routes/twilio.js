const express = require('express');
const axios = require('axios');
const router = express.Router();
const twilio = require('../services/twilio');
const { handle_incoming_messages } = require('../middleware/twilio');
const Messages = require('../services/sms-model');


router.get('/text-me', (req, res, next) => {
    twilio.messages.create({
        body: 'Hello Orlando, from Node',
        to: process.env.MY_NUMBER,
        from: '+19179709371'
    }).then(message => {
        res.status(200).json({id: message.sid})
    });
})

router.get('/messages', (req,res,next)=>{
    Messages.getMessages()
    .then(
        res => console.log(res)
    )
    .catch(
        err => console.log(err) 
    )
})

router.post('/sms/receiver', handle_incoming_messages)



module.exports = router;
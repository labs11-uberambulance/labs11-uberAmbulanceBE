const express = require('express');
const router = express.Router();
const twilio = require('../services/twilio');
const { handle_incoming_messages } = require('../middleware/twilio');

router.post('/sms/receiver', handle_incoming_messages)



module.exports = router;
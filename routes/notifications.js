const router = require('express').Router();
const db = require('../data/dbConfig');


router.get('/refresh-token/', async (req, res, next) => {
    const { token: fcm_token } = req.body;
    const { user_id: firebase_id } = req.user;
    try {
        await db('users').where({ firebase_id }).update({ fcm_token });
        res.sendStatus(200)
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
});


module.exports = router;
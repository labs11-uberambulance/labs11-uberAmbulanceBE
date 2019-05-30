const router = require('express').Router();
const db = require('../data/dbConfig');


router.post('/refresh-token', async (req, res, next) => {
    console.log(req.body)
    const { token: FCM_token } = req.body;
    const { uid: firebase_id } = req.user;
    try {
        await db('users').where({ firebase_id }).update({ FCM_token });
        res.sendStatus(200)
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
});


module.exports = router;
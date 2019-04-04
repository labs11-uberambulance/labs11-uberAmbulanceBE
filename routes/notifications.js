const router = require('express').Router();
const db = require('../data/dbConfig');


router.post('/refresh-token', async (req, res, next) => {
    const { token: FCM_token } = req.body;
    const { uid: firebase_id } = req.user;
    console.log( fcm_token  )
    try {
        await db('users').where({ firebase_id }).update({ FCM_token });
        res.sendStatus(200)
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
});


module.exports = router;
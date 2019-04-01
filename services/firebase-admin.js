const admin = require("firebase-admin");// setup firebase-admin:

// remember to set GOOGLE_CLOUD_PROJECT in .env
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'birth-ride',
        clientEmail: 'firebase-adminsdk-cnsb3@birth-ride.iam.gserviceaccount.com',
        privateKey: process.env.FIREBASE_PRIVATE_KEY
    })
});

module.exports = admin;
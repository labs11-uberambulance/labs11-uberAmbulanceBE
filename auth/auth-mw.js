const admin = require("firebase-admin");

module.exports = {
  protect
};

// // setup firebase-admin:
admin.initializeApp(); // remember to set GOOGLE_CLOUD_PROJECT in .env

// mw to protect a route, check that user is auth'd using firebase
async function protect(req, res, next) {
  const idToken = req.headers.authorization;
  // was firebaseId supplied?
  if (idToken) {
    // verify:
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedIdToken => {
        // verify ok
        console.log("ID Token correctly decoded", decodedIdToken);
        req.user = decodedIdToken;
        return next();
      })
      .catch(error => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  } else {
    res.status(401).json({
      message: "Log in and provide firebase ID to view this content."
    });
  }
}

const admin = require("firebase-admin");
require("dotenv").config();

module.exports = {
  protect,
  restrict
};

// setup firebase-admin:
admin.initializeApp(); // remember to set GOOGLE_CLOUD_PROJECT in .env

// mw to protect a route, check that user is auth'd using firebase
async function protect(req, res, next) {
  const idToken = req.headers.authorization;
  // console.log(idToken);
  // for testing
  if (process.env.DB_ENV === "testing") {
    if (idToken === "motherToken") {
      req.user = { user_id: "mother0FIREBASE" };
    } else if (idToken === "driverToken") {
      req.user = { user_id: "driver0FIREBASE" };
    } else {
      req.user = { user_id: "test" };
    }
    return next();
  }
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
      message: "Log in and provide token to view this content."
    });
  }
}

// mw to restrict access to a route, checks that user's firebase id matches ADMIN_FIREBASE.
// Note: must call after protect to give access to decoded token
function restrict(req, res, next) {
  const { user_id } = req.user;
  // for testing
  if (process.env.DB_ENV === "testing") {
    return next();
  }
  console.log("firebaseId", req.user);
  if (user_id === process.env.ADMIN_FIREBASE) {
    return next();
  } else {
    res.status(401).json({ message: "Must be admin to access this route. " });
  }
}

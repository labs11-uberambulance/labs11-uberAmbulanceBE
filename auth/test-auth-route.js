const router = require("express").Router();

// base url is /api/test-auth, set in server.js
router.get("/", (req, res) => {
  let msg = "";
  let uname = "";
  // check which provider was used to auth user:
  let provider = req.user.firebase.sign_in_provider;
  if (provider === "google.com") {
    uname = req.user.name;
  } else if (provider === "phone") {
    uname = req.user.phone_number;
  }
  // if protect mw is working correctly, the following will be returned
  res
    .status(200)
    .json({ message: `The user ${uname} is authorized by ${provider}` });
});

module.exports = router;

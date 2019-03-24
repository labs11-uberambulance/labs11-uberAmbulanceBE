const router = require("express").Router();

// base url is /api/test-auth, set in server.js
router.get("/", (req, res) => {
  // if protect mw is working correctly, the following will be returned
  res.status(200).json({ message: `The user ${req.user.name} is authorized` });
});

module.exports = router;

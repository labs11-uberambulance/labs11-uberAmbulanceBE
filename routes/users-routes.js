const router = require("express").Router();
const Users = require("../models/user-model.js");

// base url is /api/users, set in server.js
router.get("/", async (req, res) => {
  const { user_id } = req.user;
  const [user] = await Users.findBy({ firebase_id: user_id });
  // console.log(user_id);
  try {
    if (user) {
      // user found return mother/driver data if exists
      if (user.user_type === "mothers") {
        const motherData = await Users.findMothersBy({ firebase_id: user_id });
        res.status(200).json({ motherData });
      } else if (user.user_type === "drivers") {
        const driverData = await Users.findDriversBy({ firebase_id: user_id });
        res.status(200).json({ driverData });
      } else {
        // console.log("user found, ", user);
        res.status(200).json({ user });
      }
    } else {
      // no user found, create it
      // console.log("no user, creating");
      const newUser = {
        firebase_id: user_id
      };
      userId = await Users.add(newUser);
      res.status(201).json({ user: newUser });
    }
  } catch (error) {
    console.error("error finding by firebase_id: ", error);
  }
});

module.exports = router;

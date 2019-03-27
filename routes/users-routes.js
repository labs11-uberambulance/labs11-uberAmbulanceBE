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
        res.status(200).json({ user, motherData });
      } else if (user.user_type === "drivers") {
        const driverData = await Users.findDriversBy({ firebase_id: user_id });
        res.status(200).json({ user, driverData });
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
      userAdded = await Users.add(newUser);
      res.status(201).json({ user: userAdded });
    }
  } catch (error) {
    console.error("error finding by firebase_id: ", error);
  }
});

router.post("/onboard/:id", async (req, res) => {
  // id passed as parameter is user id, this is used to determine mother/driver without depending on mother/driver data to be complete.
  const userId = req.params.id;
  const userData = await Users.findById(userId);
  let updated;
  try {
    if (userData.user_type === "mothers") {
      console.log("mother", userData);
      // updated = await Users.update("mothers").
      res.status(200).json({ mother: "updated" });
    } else if (userData.user_type === "drivers") {
      console.log("driver", userData);
      res.status(200).json({ driver: "updated" });
    }
  } catch (error) {
    console.error("error with POST to /onboard: ", error);
  }
});

module.exports = router;

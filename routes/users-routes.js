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
  // user id passed as parameter, this is used to determine mother/driver without depending on mother/driver data to be complete.
  const id = req.params.id;
  const userData = await Users.findById(id);
  if (userData.user_type) {
    res.status(400).json({ message: "This user has already been onboarded." });
    return;
  }
  const firebase_id = userData.firebase_id;
  let updated;
  try {
    if (req.body.user_type === "mother") {
      const motherData = { ...req.body.motherData, firebase_id };
      // first update user record
      await Users.updateUser({ id }, { user_type: "mothers" });
      // second create mother record
      updated = await Users.addMother(motherData);
      res.status(200).json({ mother: updated });
    } else if (req.body.user_type === "driver") {
      const driverData = { ...req.body.driverData, firebase_id };
      // first update user record
      await Users.updateUser({ id }, { user_type: "drivers" });
      // second create driver record
      updated = await Users.addDriver(driverData);
      res.status(200).json({ driver: updated });
    } else {
      res
        .status(400)
        .json({ message: "must set 'user_type' 'mothers' or 'drivers'." });
    }
  } catch (error) {
    console.error("error with POST to /onboard: ", error);
  }
});

module.exports = router;

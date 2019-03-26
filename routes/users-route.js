const router = require("express").Router();
const Users = require("../models/user-model.js");
const protect = require("../auth/auth-mw").protect; // requires valid firebase token
const restrict = require("../auth/auth-mw").restrict; // requires firebase user to match ADMIN_FIREBASE in .env

// base url is /api/users, set in server.js

// ADMIN ONLY route filter parameter is optional, will select users by user_type
router.get("/:user_type?", protect, restrict, (req, res) => {
  const user_type = req.params.user_type;
  if (!user_type) {
    Users.find()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({ message: ` Failed to get Users`, error: err });
      });
  } else if (user_type === "mothers") {
    Users.findMothers()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: ` Failed to get UsersBy ${user_type}`, error: err });
      });
  } else if (user_type === "drivers") {
    Users.findDrivers()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: ` Failed to get UsersBy ${user_type}`, error: err });
      });
  } else {
    res.status(404).json({ message: `no ${user_type} user type` });
  }
});

router.post("/", (req, res) => {
  console.log("post to api/users", req.headers.authorization);
  Users.add(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: ` Failed to add user`, error: err });
    });
});

router.delete("/:id", (req, res) => {
  Users.remove(req.params.id)
    .then(deleted => {
      res.status(202).json({ message: "User Deleted" });
    })
    .catch(err => {
      res.status(500).json({ message: "failed to delete user", error: err });
    });
});

router.post("/register", (req, res) => {
  Users.register(req.body)
    .then(data => {
      res.status(201).json({
        token: generateToken(data),
        user: data,
        message: "registered"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "there was an error registering your user",
        error: err
      });
    });
});

module.exports = router;

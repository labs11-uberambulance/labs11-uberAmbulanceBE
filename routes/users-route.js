const router = require("express").Router();
const Users = require("../models/user-model.js");

// base url is /api/users, set in server.js

// filter parameter is optional, will select users by user_type
router.get("/:user_type?", (req, res) => {
  const user_type = req.params.user_type;
  if (user_type) {
    Users.findBy({ user_type })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: ` Failed to get UsersBy ${user_type}`, error: err });
      });
  } else {
    Users.find()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({ message: ` Failed to get Users`, error: err });
      });
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

module.exports = router;

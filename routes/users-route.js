
const router = require("express").Router();
const Users = require("../models/user-model.js");
// base url is /api/users, set in server.js

router.get("/", (req, res) => {
  Users.find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: ` Failed to get Users`, error: err });
    });
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

router.delete('/:id', (req, res) => {
    Users.remove(req.params.id)
    .then(deleted =>{
        res.status(202).json({message: "User Deleted"})
    })
    .catch(err =>{
        res.status(500).json({message: "failed to delete user", error: err})
    })
});

module.exports = router;


const router = require("express").Router();
const Users = require("../models/user-model.js");
// base url is /api/users, set in server.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET ; 

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
router.delete('/:id', (req, res) => {
    Users.remove(req.params.id)
    .then(deleted =>{
        res.status(202).json({message: "User Deleted"})
    })
    .catch(err =>{
        res.status(500).json({message: "failed to delete user", error: err})
    })
});
function generateToken(user){
  const payload = {
      id: user.id
  };
  const options ={
      expiresIn: '24h'
  };
  return jwt.sign(payload, options)
}

router.post('/register', (req, res) => {
    Users.register(req.body)
    .then(data =>{
        res.status(201).json({token:generateToken(data), user: data, message:"registered"})
    })
    .catch(err=>{
        res.status(500).json({message: "there was an error registering your user", error: err})
    })
});

// response = {
//     user: {
//       id: firebaseId,
//       photoURL: photoURL,
//       email: email,
//       phoneNumber: phoneNumber
//     },
//     token: '',
//     tokenExpiration: 60
//   }


module.exports = router;

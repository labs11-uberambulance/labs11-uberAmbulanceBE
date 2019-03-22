const Users = require('../models/user-model.js');
module.exports= server =>{
    server.get('/api/users', getUsers);
    server.post('/api/users', addUser);
}

const getUsers = (req, res) =>{
    Users.find()
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err => {
        res.status(500).json({ message: ` Failed to get Users`, error: err });
    })
}

const addUser = (req, res) =>{
    console.log(req.header.authorization)
    Users.add(req.body)
    .then(data =>{
        res.status(201).json(data)
    })
    .catch(err => {
        res.status(500).json({ message: ` Failed to add user`, error: err });
    })
}
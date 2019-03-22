const Users = require('../models/user-model.js');

module.exports= server =>{
    server.get('/api/users', getUsers);
    server.get('/api/mothers', getMothers);
    server.get('/api/drivers', getDrivers);
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
const getMothers = (req, res) =>{
    Users.findMothers()
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err => {
        res.status(500).json({ message: ` Failed to get Mothers`, error: err });
    })
}
const getDrivers = (req, res) =>{
    Users.findDrivers()
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err => {
        res.status(500).json({ message: ` Failed to get Mothers`, error: err });
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
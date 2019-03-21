const Users = require('../models/user-model.js');
module.exports= server =>{
    server.get('/api/users', getUsersTest)
}

const getUsersTest = (req, res) =>{
    Users.find()
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err => {
        res.status(500).json({ message: ` Failed to get Users`, error: err });
    })
}
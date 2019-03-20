const express = require('express');
const server = express();
const cors = require('cors');
const helmet = require('helmet');

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', async(req, res)=>{
    res.status(200).json('Hey there BirthRide Dev!')
})

module.exports = server;
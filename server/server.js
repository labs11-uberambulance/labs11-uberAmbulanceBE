const express = require("express");
const server = express();
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("../routes/users-route.js");

server.use(helmet());
server.use(cors());
server.use(express.json());

// Configure Routes
// configureUserRoutes(server);

// setup routes
server.use("/api/users", userRoutes);

// Test route
server.get("/", async (req, res) => {
  res.status(200).json("Hey there BirthRide Dev!");
});

module.exports = server;

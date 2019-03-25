const express = require("express");
const server = express();
const cors = require("cors");
const helmet = require("helmet");
// custom mw's:
const protect = require("../auth/auth-mw").protect;
// routes imports
const userRoutes = require("../routes/users-route.js");
const testAuthRoute = require("../auth/test-auth-route");

// configure middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

// Configure Routes
// configureUserRoutes(server);

// setup routes
server.use("/api/users", userRoutes);

// Test routes
server.get("/", async (req, res) => {
  res.status(200).json("Hey there BirthRide Dev!");
});
server.use("/api/test-auth", protect, testAuthRoute);

module.exports = server;

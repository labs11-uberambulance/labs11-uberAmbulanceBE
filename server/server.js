const express = require("express");
const server = express();
const cors = require("cors");
const helmet = require("helmet");
// custom mw's:
const protect = require("../auth/auth-mw").protect; // requires valid firebase token
const restrict = require("../auth/auth-mw").restrict; // requires firebase user to match ADMIN_FIREBASE in .env
// routes imports

const userRoutes = require("../routes/users-route.js");
const ridesRoutes = require("../routes/rides-route.js");
const userRoutesAdmin = require("../routes/users-routes-admin.js");
const testAuthRoute = require("../auth/test-auth-route");
const twilioRoutes = require("../routes/twilio");

// configure middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

// Configure Routes
server.use("/api/users", userRoutes);
server.use("/api/rides", ridesRoutes);
server.use("/api/admin/users/", protect, restrict, userRoutesAdmin);
server.use("/api/twilio", twilioRoutes);


// Test routes
server.get("/", async (req, res) => {
  res.status(200).json("Hey there BirthRide Dev!");
});
server.use("/api/test-auth", protect, testAuthRoute);


module.exports = server;

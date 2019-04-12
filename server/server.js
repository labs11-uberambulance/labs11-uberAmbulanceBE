const express = require("express");
const server = express();
// const cors = require("cors");
const helmet = require("helmet");
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
server.use(express.urlencoded({ extended: false }));
// GLOBAL SERVICES
require("../services/firebase-admin");

// custom mw's:
const protect = require("../auth/auth-mw").protect; // requires valid firebase token
const restrict = require("../auth/auth-mw").restrict; // requires firebase user to match ADMIN_FIREBASE in .env
// routes imports

const ridesRoutes = require("../routes/rides-route.js");
const userRoutes = require("../routes/users-routes.js");
const userRoutesAdmin = require("../routes/users-routes-admin.js");
const testAuthRoute = require("../auth/test-auth-route");
const notificationsRoutes = require("../routes/notifications");
const twilioRoutes = require("../routes/twilio");

// configure middlewares
server.use(helmet());
// server.use(cors());
server.use(express.json());

// Configure Routes
server.use("/api/rides", protect, ridesRoutes);
server.use("/api/users/", protect, userRoutes);
server.use("/api/admin/users/", protect, restrict, userRoutesAdmin);
server.use("/api/notifications", protect, notificationsRoutes);
server.use("/api/twilio", protect, twilioRoutes);

// Test routes
server.get("/", async (req, res) => {
  res.status(200).json("Hey there BirthRide Dev!");
});
server.use("/api/test-auth", protect, testAuthRoute);

module.exports = server;

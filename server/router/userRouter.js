const express = require("express");
const UserController = require("../controllers/userController");
const AuthAttemptController = require("../controllers/authAttemptController");

module.exports.init = function(apiRoutes, requireAuth, requireLogin) {
  const authRoutes = express.Router();
  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/users", authRoutes);
  //ROUTES
  // Search
  authRoutes.get("/search", UserController.search);
  //AUTH
  authRoutes.post("/register", UserController.register);
  authRoutes.put("/:email/update", UserController.update);
  // Login route
  authRoutes.post(
    "/login",
    AuthAttemptController.authAttemptLogger,
    requireLogin,
    UserController.login
  );
};

const express = require("express");
const UserController = require("../controllers/userController");
const AuthAttemptController = require("../controllers/authAttemptController");

module.exports.init = function(apiRoutes, requireAuth, requireLogin) {
  const authRoutes = express.Router();
  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/users", authRoutes);
  apiRoutes.get("/search", function(req, res) {
    res.status(200).json({
      ok: true,
      users: [{ id: "1", firstName: "nombre", lastName: "lastName" }]
    });
  });
  //AUTH
  authRoutes.post("/register", UserController.register);
  // Login route
  authRoutes.post(
    "/login",
    AuthAttemptController.authAttemptLogger,
    requireLogin,
    UserController.login
  );
};

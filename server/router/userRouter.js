const express = require("express");
const UserController = require("../controllers/userController");
const AuthAttemptController = require("../controllers/authAttemptController");

module.exports.init = function(
  apiRoutes,
  requireAuth,
  requireLogin,
  manageResponse
) {
  const authRoutes = express.Router();

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/users", authRoutes);

  // Search Routes
  authRoutes.get("/search", (req, res, next) => {
    UserController.search(req.query, (err, response) => {
      manageResponse(err, response, res, next);
    });
  });

  // Register Routes
  authRoutes.post("/register", UserController.register);

  // Login route
  authRoutes.post(
    "/login",
    AuthAttemptController.authAttemptLogger,
    requireLogin,
    UserController.login
  );

  // Update Routes
  authRoutes.put("/:email/update", UserController.update);

  // Delete Routes
  authRoutes.put("/:email/delete", UserController.delete);
};

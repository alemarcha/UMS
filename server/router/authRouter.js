const express = require("express");
const AuthenticationController = require("../controllers/authenticationController");

module.exports.init = function(apiRoutes, requireAuth, requireLogin) {
  const authRoutes = express.Router();
  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/auth", authRoutes);
  apiRoutes.get("/users", function(req, res) {
    res.status(200).json({
      ok: true,
      users: [{ id: "1", firstName: "nombre", lastName: "lastName" }]
    });
  });
  //AUTH
  authRoutes.post("/register", AuthenticationController.register);
  // Login route
  authRoutes.post("/login", requireLogin, AuthenticationController.login);
};

const express = require("express");
const RoleController = require("../controllers/roleController");

module.exports.init = function(apiRoutes, requireAuth) {
  const roleRoutes = express.Router();
  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/roles", roleRoutes);

  // Roles
  roleRoutes.get("/search", RoleController.search);
  //AUTH
  //   authRoutes.post("/register", AuthenticationController.register);
  // Login route
  //   authRoutes.post("/login", requireLogin, AuthenticationController.login);
};

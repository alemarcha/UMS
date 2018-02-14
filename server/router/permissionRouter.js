const express = require("express");
const PermissionController = require("../controllers/permissionController");

module.exports.init = function(apiRoutes, requireAuth) {
  const permissionRoutes = express.Router();
  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/permissions", permissionRoutes);

  // Roles
  permissionRoutes.get("/search", PermissionController.search);
  //AUTH
  //   authRoutes.post("/register", AuthenticationController.register);
  // Login route
  //   authRoutes.post("/login", requireLogin, AuthenticationController.login);
};

const express = require("express");
const PermissionController = require("../controllers/permissionController");

module.exports.init = function(apiRoutes, requireAuth) {
  const permissionRoutes = express.Router();

  // Set auth permission as subgroup/middleware to apiRoutes
  apiRoutes.use("/permissions", permissionRoutes);

  // Permissions
  permissionRoutes.get("/search", PermissionController.search);
  permissionRoutes.post("/create", PermissionController.create);
  // permissionRoutes.put("/update", PermissionController.update);

  //AUTH
  //   authRoutes.post("/register", AuthenticationController.register);
  // Login route
  //   authRoutes.post("/login", requireLogin, AuthenticationController.login);
};

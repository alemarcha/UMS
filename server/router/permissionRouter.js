const express = require("express");
const PermissionController = require("../controllers/permissionController");

module.exports.init = function(apiRoutes, requireAuth) {
  const permissionRoutes = express.Router();

  // Set permission as subgroup/middleware to apiRoutes
  apiRoutes.use("/permissions", permissionRoutes);

  // Search Routes
  permissionRoutes.get("/search", PermissionController.search);

  // Create Routes
  permissionRoutes.post("/create", PermissionController.create);

  // Update Routes
  permissionRoutes.put("/:permission/update", PermissionController.update);

  // Delete Routes
  permissionRoutes.put("/:permission/delete", PermissionController.delete);
};

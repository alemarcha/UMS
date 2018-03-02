const express = require("express");
const RoleController = require("../controllers/roleController");

module.exports.init = function(apiRoutes, requireAuth) {
  const roleRoutes = express.Router();

  // Set role routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/roles", roleRoutes);

  // Search Routes
  roleRoutes.get("/search", RoleController.search);

  // Create Routes
  roleRoutes.post("/create", RoleController.create);

  // Update Routes
  roleRoutes.put("/:role/update", RoleController.update);

  // Delete Routes
  roleRoutes.put("/:role/delete", RoleController.delete);
};

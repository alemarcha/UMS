const express = require("express");
const PermissionController = require("../controllers/permissionController");

module.exports.init = function(apiRoutes, requireAuth, manageResponse) {
  const permissionRoutes = express.Router();

  // Set permission as subgroup/middleware to apiRoutes
  apiRoutes.use("/permissions", permissionRoutes);

  // Search Routes
  permissionRoutes.get("/search", (req, res, next) => {
    PermissionController.search(req.query, (err, response) => {
      manageResponse(err, response, res, next);
    });
  });

  // Create Routes
  permissionRoutes.post("/create", PermissionController.create);

  // Update Routes
  permissionRoutes.put("/:permission/update", PermissionController.update);

  // Delete Routes
  permissionRoutes.delete("/:permission/delete", PermissionController.delete);
};

const express = require("express");
const PermissionController = require("../controllers/permissionController");

module.exports.init = function(apiRoutes, requireAuth, manageResponse) {
  const permissionRoutes = express.Router();

  // Set permission as subgroup/middleware to apiRoutes
  apiRoutes.use("/permissions", permissionRoutes);

  // Search Routes /api/permissions/search
  permissionRoutes.get("/search", (req, res, next) => {
    PermissionController.search(req.query, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // Create Routes /api/permissions/create
  permissionRoutes.post("/create", (req, res, next) => {
    PermissionController.create(req.body, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // Update Routes /api/permissions/{permission}/update
  permissionRoutes.put("/:permission/update", (req, res, next) => {
    PermissionController.update(
      req.params,
      req.body,
      (err, status, response) => {
        manageResponse(err, status, response, res, next);
      }
    );
  });

  // Delete Routes /api/permissions/{permission}/delete
  permissionRoutes.delete("/:permission/delete", (req, res, next) => {
    PermissionController.delete(req.params, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });
};

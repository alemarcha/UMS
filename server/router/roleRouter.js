const express = require("express");
const RoleController = require("../controllers/roleController");

module.exports.init = function(apiRoutes, requireAuth, manageResponse) {
  const roleRoutes = express.Router();

  // Set role routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/roles", roleRoutes);

  // Search Routes /api/roles/search
  roleRoutes.get("/search", (req, res, next) => {
    RoleController.search(req.query, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // Create Routes /api/roles/create
  roleRoutes.post("/create", (req, res, next) => {
    RoleController.create(req.body, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // Update Routes /api/roles/{role}/update
  roleRoutes.put("/:role/update", (req, res, next) => {
    RoleController.update(req.params, req.body, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // Delete Routes /api/roles/{role}/delete
  roleRoutes.delete("/:role/delete", (req, res, next) => {
    RoleController.delete(req.params, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });
};

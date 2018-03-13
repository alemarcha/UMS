const express = require("express");
const RoleController = require("../controllers/roleController");

module.exports.init = function(apiRoutes, requireAuth, manageResponse) {
  const roleRoutes = express.Router();

  // Set role routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/roles", roleRoutes);

  // Search Routes
  roleRoutes.get("/search", (req, res, next) => {
    RoleController.search(req.query, (err, response) => {
      manageResponse(err, response, res, next);
    });
  });

  // Create Routes
  roleRoutes.post("/create", RoleController.create);

  // Update Routes
  roleRoutes.put("/:role/update", RoleController.update);

  // Delete Routes
  roleRoutes.delete("/:role/delete", RoleController.delete);
};

const express = require("express"),
  passportService = require("./config/passport"),
  passport = require("passport");
const userRouter = require("./router/userRouter");
const roleRouter = require("./router/roleRouter");
const permissionRouter = require("./router/permissionRouter");

// Middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

// Constants for role types
// const REQUIRE_ADMIN = "Admin",
//   REQUIRE_OWNER = "Owner",
//   REQUIRE_CLIENT = "Client",
//   REQUIRE_MEMBER = "Member";

module.exports = function(app) {
  // Initializing route groups

  const apiRoutes = express.Router();
  userRouter.init(apiRoutes, requireAuth, requireLogin);
  roleRouter.init(apiRoutes, requireAuth);
  permissionRouter.init(apiRoutes, requireAuth);
  //=========================
  // Auth Routes
  //=========================

  // Set url for API group routes
  app.use("/api", apiRoutes);

  // Ping routes
  apiRoutes.get("/ping", function(req, res) {
    res.status(200).json({
      ok: true
    });
  });

  // Private routes
  apiRoutes.get("/protected", requireAuth, function(req, res, next) {
    res.status(200).json({
      content: "Respuesta desde api protected"
    });
  });

  // Handle Errors in api rest
  apiRoutes.use((err, req, res, next) => {
    //TODO Just for development mode
    console.log(err);
    res.status(err.status || 500).send({
      ok: false,
      error: { message: err.message, error: err.err || err }
    });
  });

  // Handle 404 error.
  app.use("*", (req, res) => {
    //TODO Just for development mode
    console.log(req);
    res.status(404).send({
      ok: false,
      error: { message: "Not Found route", error: req.originalUrl }
    });
  });
};

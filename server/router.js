const AuthenticationController = require("./controllers/authenticationController"),
  express = require("express"),
  passportService = require("./config/passport"),
  passport = require("passport");
const authRouter = require("./router/authRouter");

// Middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",
  REQUIRE_OWNER = "Owner",
  REQUIRE_CLIENT = "Client",
  REQUIRE_MEMBER = "Member";

module.exports = function(app) {
  // Initializing route groups

  const apiRoutes = express.Router();
  authRouter.init(apiRoutes, requireAuth, requireLogin);
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
};

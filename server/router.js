const express = require("express"),
  passportService = require("./config/passport"),
  passport = require("passport"),
  config = require("./config/main");

const userRouter = require("./router/userRouter");
const roleRouter = require("./router/roleRouter");
const permissionRouter = require("./router/permissionRouter");

// Middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });

// Constants for role types
// const REQUIRE_ADMIN = "Admin",
//   REQUIRE_OWNER = "Owner",
//   REQUIRE_CLIENT = "Client",
//   REQUIRE_MEMBER = "Member";

// Manage api response.
let manageResponse = (err, response, res, next) => {
  if (err) next(err);
  sendResponse(200, response, res);
};

// Send 200 response
let sendResponse = (status, response, res) => {
  return res.status(status).json(response);
};

let sendError = (status, message, error, res) => {
  sendResponse(
    status,
    {
      ok: false,
      error: { message: message, error: error }
    },
    res
  );
};

module.exports = function(app) {
  // Initializing route groups

  const apiRoutes = express.Router();
  userRouter.init(apiRoutes, requireAuth, manageResponse);
  roleRouter.init(apiRoutes, requireAuth, manageResponse);
  permissionRouter.init(apiRoutes, requireAuth, manageResponse);
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

  // if (config.environment === "development") {
  //   // Handle Errors in api rest
  //   apiRoutes.use((err, req, res, next) => {
  //     //TODO Just for development mode
  //     console.log(err);
  //     res.status(err.status || 500).send({
  //       ok: false,
  //       error: { message: err.message, error: err.err || err }
  //     });
  //   });
  // }

  // Development or test
  if (config.environment === "development" || config.environment === "test") {
    // Handle Errors in api rest
    apiRoutes.use((err, req, res, next) => {
      //TODO Just for development mode
      console.log(err);
      sendError(err.status || 500, err.message, { message: err.message }, res);
    });
  }

  // Production
  if (config.environment !== "development" && config.environment !== "test") {
    // Handle Errors in api rest
    apiRoutes.use((err, req, res, next) => {
      sendError(err.status || 500, err.message, { message: err.message }, res);
    });
  }

  // Handle 404 error.
  app.use("*", (req, res) => {
    //TODO Just for development mode
    console.log(req);
    sendError(404, "Not Found route", req.originalUrl, res);
  });
};

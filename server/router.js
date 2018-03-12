const express = require("express"),
  passportService = require("./config/passport"),
  passport = require("passport"),
  config = require("./config/main");

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

// Manage api response.
let manageResponse = (err, response, res, next) => {
  if (err) next(err);
  sendResponse(200, response, res);
};

// Send 200 response
let sendResponse = (status, response, res) => {
  return res.status(status).json(response);
};

module.exports = function(app) {
  // Initializing route groups

  const apiRoutes = express.Router();
  userRouter.init(apiRoutes, requireAuth, requireLogin, manageResponse);
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
      sendResponse(
        err.status || 500,
        {
          ok: false,
          error: { message: err.message, error: err.err || err }
        },
        res
      );
    });
  }

  // Production
  if (config.environment !== "development" && config.environment !== "test") {
    // Handle Errors in api rest
    apiRoutes.use((err, req, res, next) => {
      sendResponse(
        err.status || 500,
        {
          ok: false,
          error: { message: err.message, error: { message: err.message } }
        },
        res
      );
    });
  }

  // Handle 404 error.
  app.use("*", (req, res) => {
    //TODO Just for development mode
    console.log(req);
    sendResponse(
      404,
      {
        ok: false,
        error: { message: "Not Found route", error: req.originalUrl }
      },
      res
    );
  });
};

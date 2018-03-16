const express = require("express");
const UserController = require("../controllers/userController");
const AuthAttemptController = require("../controllers/authAttemptController");
const passport = require("passport");

module.exports.init = function(apiRoutes, requireAuth, manageResponse) {
  const authRoutes = express.Router();

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/users", authRoutes);

  // Search Routes
  authRoutes.get("/search", (req, res, next) => {
    UserController.search(req.query, (err, response) => {
      manageResponse(err, response, res, next);
    });
  });

  // Register Routes
  authRoutes.post("/register", UserController.register);

  // Login route.
  //1. Called AuthAttemp to register login params.
  //2. Passport authenticate.
  //3. Once we check correct username and password we call user controller and generate jwt.
  authRoutes.post("/login", AuthAttemptController.authAttemptLogger, function(
    req,
    res,
    next
  ) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next({
          status: 401,
          message: info.error,
          err: info
        });
      }
      return UserController.login(user, (err, response) => {
        manageResponse(err, response, res, next);
      });
    })(req, res, next);
  });

  // Update Routes
  authRoutes.put("/:email/update", UserController.update);
  authRoutes.put("/:email/updatePassword", (req, res, next) => {
    UserController.updatePassword(req.params, req.body, (err, response) => {
      manageResponse(err, response, res, next);
    });
  });

  // Delete Routes
  authRoutes.delete("/:email/delete", UserController.delete);

  // check JWT valid
  authRoutes.get(
    "/validJWT",
    function(req, res, next) {
      passport.authenticate(
        "jwt",
        { session: false },
        (err, userData, info) => {
          if (err) {
            return next(err);
          }
          if (!userData) {
            return next({
              status: 401,
              message: info.message,
              err: info
            });
          }
          req.userData = userData;
          return next();
        }
      )(req, res, next);
    },
    (req, res, next) => {
      UserController.validJWT(req.userData, (err, response) => {
        manageResponse(err, response, res, next);
      });
    }
  );
};

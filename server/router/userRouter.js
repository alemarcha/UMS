const express = require("express");
const UserController = require("../controllers/userController");
const AuthAttemptController = require("../controllers/authAttemptController");
const passport = require("passport");

module.exports.init = function(apiRoutes, requireAuth, manageResponse) {
  const authRoutes = express.Router();

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/users", authRoutes);

  // Search Routes /api/users/search
  authRoutes.get("/search", (req, res, next) => {
    UserController.search(req.query, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // Register Routes /api/users/register
  authRoutes.post("/register", (req, res, next) => {
    UserController.register(req.body, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // Login route. /api/users/login
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
      return UserController.login(user, (err, status, response) => {
        manageResponse(err, status, response, res, next);
      });
    })(req, res, next);
  });

  // Update Routes /api/users/{email}/update
  authRoutes.put("/:email/update", (req, res, next) => {
    UserController.update(req.params, req.body, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });
  // Update Password Routes /api/users/{email}/updatePassword
  authRoutes.put("/:email/updatePassword", (req, res, next) => {
    UserController.updatePassword(
      req.params,
      req.body,
      (err, status, response) => {
        manageResponse(err, status, response, res, next);
      }
    );
  });

  // Delete Routes /api/users/{email}/delete
  authRoutes.delete("/:email/delete", (req, res, next) => {
    UserController.delete(req.params, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  // check JWT valid /api/users/validJWT
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
      UserController.validJWT(req.userData, (err, status, response) => {
        manageResponse(err, status, response, res, next);
      });
    }
  );

  // RefreshJWT /api/users/refreshJWT
  //1. Called AuthAttemp to register refresh params.
  //2. Passport authenticate jwt check if jwt is valid, not expired and user contains refresh token passed in jwt.
  //3. Once we check jwt and refresh token are valid we call user controller and generate jwt.
  authRoutes.get(
    "/refreshJWT",
    AuthAttemptController.refreshJWTAttemptLogger,
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
      // Once we know that jwt token is valid and not expired, we move forward to generate new token
      UserController.refreshJWT(req.userData, (err, status, response) => {
        manageResponse(err, status, response, res, next);
      });
    }
  );
};

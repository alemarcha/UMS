"use strict";

const AuthAttempt = require("../models/authAttempt"),
  User = require("../models/user"),
  config = require("../config/main"),
  utils = require("utils")._,
  jwt = require("jsonwebtoken");

// audit each login attempt
exports.authAttemptLogger = function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  let hashPassword = "";
  // Hash password before save login attempt
  User.hashPassword(password, 5, function(hash) {
    hashPassword = hash;
  });
  let authAttempt = new AuthAttempt({
    userAttempt: email,
    passwordAttempt: hashPassword,
    ip: ip || "0.0.0.0",
    type: "login"
  });

  authAttempt.save(function(err, user) {
    if (err) {
      return res.status(400).send({ ok: false, error: err });
    }
    next();
  });
};

// audit each refresh token attempt
exports.refreshJWTAttemptLogger = function(req, res, next) {
  let email = "";
  let ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  // Recover old jwt and the user email from it if token is correct.
  let tokenAttempt = req.headers["authorization"];
  if (!utils.isEmpty(tokenAttempt)) {
    if (!utils.isEmpty(tokenAttempt)) {
      let token = tokenAttempt.split("JWT ")[1];
      let decoded = jwt.decode(token);
      if (!utils.isEmpty(decoded) && !utils.isEmpty(decoded.email)) {
        email = decoded.email;
      }
    }
  }

  let authAttempt = new AuthAttempt({
    userAttempt: email,
    tokenAttempt: tokenAttempt,
    ip: ip || "0.0.0.0",
    type: "refreshJWT"
  });

  authAttempt.save(function(err, user) {
    if (err) {
      return res.status(400).send({ ok: false, error: err });
    }
    next();
  });
};

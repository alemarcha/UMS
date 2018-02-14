"use strict";

const AuthAttempt = require("../models/authAttempt"),
  User = require("../models/user"),
  config = require("../config/main");

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
    ip: ip || "0.0.0.0"
  });

  authAttempt.save(function(err, user) {
    if (err) {
      return res.status(400).send({ ok: false, error: err });
    }
    next();
  });
};

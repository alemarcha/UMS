"use strict";

const jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  User = require("../models/user"),
  config = require("../config/main");

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

// Set user info from request
function setUserInfo(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive
    // role: user.role
  };
}

//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {
  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    ok: true,
    token: "JWT " + generateToken(userInfo),
    user: userInfo
  });
};

//========================================
// Registration Route
//========================================
exports.register = function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const isActive = true;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: "You must enter an email address." });
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: "You must enter your full name." });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: "You must enter a password." });
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    // If user is not unique, return error
    if (existingUser) {
      return res
        .status(422)
        .send({ ok: false, error: "That email address is already in use." });
    }

    // If email is unique and password was provided, create account
    let user = new User({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      isActive: isActive
    });

    user.save(function(err, user) {
      if (err) {
        return res.status(400).send({ ok: false, error: err });
      }

      // Subscribe member to Mailchimp list
      // mailchimp.subscribeToNewsletter(user.email);

      // Respond with JWT if user was created
      let userInfo = setUserInfo(user);
      res.status(201).json({
        ok: true,
        token: "JWT " + generateToken(userInfo),
        user: userInfo
      });
    });
  });
};

//========================================
// Search Route
//========================================
exports.search = function(req, res) {
  User.find({})
    .sort({ name: 1 })
    .exec((err, response) => {
      if (err) {
        return res.status(400).send({ ok: false, error: err });
      }
      return res.status(200).json({
        ok: true,
        permissions: response
      });
    });
};
//========================================
// Authorization Middleware
//========================================

// Role authorization check
// exports.roleAuthorization = function(role) {
//     return function(req, res, next) {
//       const user = req.user;

//       User.findById(user._id, function(err, foundUser) {
//         if (err) {
//           res.status(422).json({ error: 'No user was found.' });
//           return next(err);
//         }

//         // If user is found, check role.
//         if (foundUser.role == role) {
//           return next();
//         }

//         res.status(401).json({ error: 'You are not authorized to view this content.' });
//         return next('Unauthorizdded');
//       })
//     }
// }

"use strict";

const jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  User = require("../models/user"),
  Role = require("../models/role"),
  config = require("../config/main"),
  utils = require("utils")._;

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
    data: {
      token: "JWT " + generateToken(userInfo),
      user: userInfo
    }
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
  if (utils.isEmpty(email)) {
    return next({
      status: 400,
      message: "You must enter an email address.",
      err: 400
    });
  }

  // Return error if full name not provided
  if (utils.isEmpty(firstName) || utils.isEmpty(lastName)) {
    return next({
      status: 400,
      message: "You must enter your full name.",
      err: 400
    });
  }

  // Return error if no password provided
  if (utils.isEmpty(password)) {
    return next({
      status: 400,
      message: "You must enter a password.",
      err: 400
    });
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    // If user is not unique, return error
    if (existingUser) {
      return next({
        status: 409,
        message: "That email address is already in use.",
        err: existingUser
      });
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
        return next({
          status: 400,
          message: err.message,
          err: err
        });
      }
      // Respond with JWT if user was created
      let userInfo = setUserInfo(user);
      res.status(201).json({
        ok: true,
        data: {
          token: "JWT " + generateToken(userInfo),
          user: userInfo
        }
      });
    });
  });
};

//========================================
// Update User Route
//========================================
exports.update = async function(req, res, next) {
  const identifyEmail = req.params.email;
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const roles = req.body.roles;
  const isActive = true;
  const userUpdate = {};

  if (utils.isEmpty(identifyEmail)) {
    return next({
      status: 400,
      message: "Email address to update is not correct",
      err: identifyEmail
    });
  }
  if (!utils.isEmpty(email)) {
    userUpdate.email = email;
  }

  if (!utils.isEmpty(firstName)) {
    userUpdate.firstName = firstName;
  }

  if (!utils.isEmpty(lastName)) {
    userUpdate.lastName = lastName;
  }
  if (!utils.isEmpty(roles)) {
    let newRoles = [];
    let getRolesByName = () => {
      return Role.find({})
        .where("roleName")
        .in(roles)
        .exec()
        .then(response => {
          return response;
        });
    };
    newRoles = await getRolesByName();
    // console.log("Master" + JSON.stringify(newRoles));
    if (newRoles.length === roles.length) {
      userUpdate.roles = newRoles;
    } else {
      return next({
        status: 400,
        message: "roles to update is not correct",
        err: roles
      });
    }
  }

  User.findOneAndUpdate({ email: identifyEmail }, userUpdate, {
    new: true
  })
    .populate("roles")
    .exec(function(err, userUpdated) {
      if (err) {
        if (err.code === 11000) {
          return next({
            status: 409,
            message: "That email address is already in use.",
            err: userUpdated
          });
        } else {
          return next({
            status: 400,
            message: err.message,
            err: err
          });
        }
      }
      return res.status(200).json({ ok: true, data: { user: userUpdated } });
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
        return next({
          status: 400,
          message: err.message,
          err: err
        });
      }
      return res.status(200).json({
        ok: true,
        data: { users: response }
      });
    });
};

//========================================
// Delete User Route
//========================================
exports.delete = function(req, res, next) {
  const identifyEmail = req.params.email;
  const isActive = false;
  const userUpdate = {};

  if (!utils.isEmpty(isActive)) {
    userUpdate.isActive = isActive;
  }

  User.findOneAndUpdate(
    { email: identifyEmail },
    userUpdate,
    { new: true },
    function(err, userDeleted) {
      if (err) {
        return next({
          status: 401,
          message: err.message,
          err: err
        });
      }
      return res.status(200).json({ ok: true, data: { user: userDeleted } });
    }
  );
};

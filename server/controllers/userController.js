"use strict";

const jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  User = require("../models/user"),
  Role = require("../models/role"),
  config = require("../config/main"),
  utils = require("utils")._,
  fs = require("fs");

const privateKey = fs.readFileSync(
  global.__basedir + config.jwtPrivateKeyPath,
  "utf8"
);

function generateToken(user) {
  return jwt.sign(user, privateKey, config.signOptionsJwt);
}

// Set user info from request
function setUserInfo(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    isActive: user.isActive,
    roles: user.roles
  };
}

//========================================
// Login Route
//========================================
exports.login = function(user, callback) {
  let userInfo = setUserInfo(user);
  callback(null, {
    ok: true,
    data: {
      token: generateToken(userInfo),
      user: userInfo
    }
  });
};

exports.validJWT = function(userData, callback) {
  let userInfo = setUserInfo(userData.user);
  callback(null, {
    ok: true,
    data: { user: userInfo, token: userData.token }
  });
};
//========================================
// Registration Route
//========================================
exports.register = async function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const roles = req.body.roles;
  const isActive = true;
  const userCreate = {};

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

  if (!utils.isEmpty(roles)) {
    let newRoles = [];
    let getRolesByName = () => {
      return Role.find({ isActive: true })
        .where("roleName")
        .in(roles)
        .exec()
        .then(response => {
          return response;
        });
    };
    newRoles = await getRolesByName();
    if (newRoles.length === roles.length) {
      userCreate.roles = newRoles;
    } else {
      return next({
        status: 400,
        message: "You must enter a valid active roles array.",
        err: roles
      });
    }
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
      isActive: isActive,
      roles: userCreate.roles
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
// Search Route
//========================================
exports.search = async function(filter, callback) {
  let filters = { isActive: true };
  let query = User.find();
  let name = filter.name;
  let lastName = filter.lastName;
  let email = filter.email;
  let roles = filter.roles;

  if (!utils.isEmpty(name)) {
    filters.firstName = {
      $regex: name,
      $options: "i"
    };
  }

  if (!utils.isEmpty(lastName)) {
    filters.lastName = {
      $regex: lastName,
      $options: "i"
    };
  }

  if (!utils.isEmpty(email)) {
    filters.email = {
      $regex: email,
      $options: "i"
    };
  }

  if (!utils.isEmpty(roles)) {
    let arrayRoles = roles.split(",");
    let getRolesIdByNames = () => {
      return Role.find({ isActive: true })
        .where("roleName")
        .in(arrayRoles)
        .exec()
        .then(response => {
          return response;
        });
    };
    let arrayRolesId = await getRolesIdByNames();
    query.where("roles").in(arrayRolesId);
  }
  query
    .find(filters)
    .populate("roles")
    .sort({ firstName: 1 })
    .exec((err, response) => {
      if (err) {
        callback({
          ok: false,
          err: {
            status: 400,
            message: err.message,
            err: err
          }
        });
      }
      callback(null, { ok: true, data: { users: response } });
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

  // roles array
  if (!utils.isEmpty(roles)) {
    let newRoles = [];
    let getRolesByName = () => {
      return Role.find({ isActive: true })
        .where("roleName")
        .in(roles)
        .exec()
        .then(response => {
          return response;
        });
    };
    newRoles = await getRolesByName();
    if (newRoles.length === roles.length) {
      userUpdate.roles = newRoles;
    } else {
      return next({
        status: 400,
        message: "roles to update are not correct",
        err: roles
      });
    }
  }

  if (!utils.isEmpty(isActive)) {
    userUpdate.isActive = isActive;
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

exports.findById = (id, callback) => {
  console.log(id);
  return User.findById(id)
    .populate("roles")
    .exec(callback);
};

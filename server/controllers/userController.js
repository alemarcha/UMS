"use strict";

const jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  User = require("../models/user"),
  Role = require("../models/role"),
  config = require("../config/main"),
  utils = require("utils")._,
  fs = require("fs"),
  randtoken = require("rand-token");

const privateKey = fs.readFileSync(
  global.__basedir + config.jwtPrivateKeyPath,
  "utf8"
);

function generateToken(user) {
  return jwt.sign(user, privateKey, config.signOptionsJwt);
}
function generateRefreshToken() {
  return randtoken.uid(256);
}

// Set user info from request
function setUserInfo(user, refreshToken = generateRefreshToken()) {
  // token expiring time for external services
  let timeObject = new Date();
  const expToken = new Date(timeObject.valueOf() + 10 * 60000);

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    isActive: user.isActive,
    roles: user.roles,
    expToken: expToken,
    refreshToken: refreshToken
  };
}

exports.findById = (id, callback) => {
  console.log(id);
  return User.findById(id)
    .populate("roles")
    .exec(callback);
};

//========================================
// Login Route
//========================================
exports.login = function(user, callback) {
  let userInfo = setUserInfo(user);
  let token = generateToken(userInfo);
  let tokens = user.tokens;
  tokens.push({
    refreshToken: userInfo.refreshToken,
    token: token,
    active: true
  });
  user.update({ tokens: tokens }, function(err, res) {
    console.log(err);
    if (err) {
      return next({
        status: 400,
        message: err.message,
        err: err
      });
    }
    callback(null, {
      ok: true,
      data: {
        token: token,
        user: userInfo
      }
    });
  });
};

//========================================
// Valid JWT Route
//========================================
exports.validJWT = function(userData, callback) {
  let userInfo = setUserInfo(userData.user, userData.refreshToken);
  callback(null, {
    ok: true,
    data: { user: userInfo, token: userData.token }
  });
};

//========================================
// Refresh JWT Route
//========================================
exports.refreshJWT = function(userData, callback) {
  let userInfo = setUserInfo(userData.user, userData.refreshToken);

  let newToken = generateToken(userInfo);
  // We update the refresh token with a new related token to this refreshToken
  let tokens = userData.user.tokens.map(tokenIt => {
    if (tokenIt.refreshToken === userData.refreshToken) {
      tokenIt.token = newToken;
    }
    return tokenIt;
  });

  userData.user.update({ tokens: tokens }, function(err, res) {
    if (err) {
      return next({
        status: 400,
        message: err.message,
        err: err
      });
    }
    callback(null, {
      ok: true,
      data: {
        token: newToken,
        user: userInfo
      }
    });
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
  const isActive = req.body.isActive;
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

  User.findOneAndUpdate({ email: identifyEmail, isActive: true }, userUpdate, {
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
// Update Password Route
//========================================
exports.updatePassword = async function(params, body, callback) {
  const identifyEmail = params.email;
  const currentPassword = body.currentPassword;
  const newPassword = body.newPassword;
  const repeatNewPassword = body.repeatNewPassword;
  const userUpdate = {};
  if (
    utils.isEmpty(currentPassword) ||
    utils.isEmpty(newPassword) ||
    utils.isEmpty(repeatNewPassword)
  ) {
    return callback({
      status: 405,
      message:
        "Current password, new password or repeat new password are not correct",
      err: {}
    });
  }

  if (newPassword !== repeatNewPassword) {
    return callback({
      status: 400,
      message: "New password and repeat new password are not equals",
      err: {}
    });
  }

  let getUseActiveByEmail = () => {
    return User.findOne({ isActive: true, email: identifyEmail })
      .exec()
      .then(response => {
        return response;
      });
  };
  let userToUpdate = await getUseActiveByEmail();

  if (utils.isEmpty(userToUpdate)) {
    return callback({
      status: 400,
      message: "User does not exist",
      err: identifyEmail
    });
  }

  userToUpdate.comparePassword(currentPassword, function(err, isMatch) {
    if (err) {
      return callback({
        status: 400,
        message: err.message,
        err: err
      });
    }
    if (!isMatch) {
      return callback({
        status: 400,
        message: "Current password is not correct",
        err: identifyEmail
      });
    }
    User.hashPassword(newPassword, config.SALT_FACTOR, function(hashPassword) {
      console.log("prueba7");

      userToUpdate.update({ password: hashPassword }).exec((err, response) => {
        if (err) {
          return callback({
            status: 400,
            message: err.message,
            err: err
          });
        }
        callback(null, { ok: true, data: { user: response } });
      });
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

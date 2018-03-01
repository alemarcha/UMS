"use strict";

const Role = require("../models/role"),
  jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  config = require("../config/main");

// Set role info from request
function setRoleInfo(role) {
  return {
    _id: role._id,
    roleName: roleName,
    isActive: role.isActive
  };
}

//========================================
// Role Route
//========================================

exports.roleName = function(req, res, next) {
  let roleInfo = setRoleInfo(req.role);
  res.status(200).json({
    ok: true,
    token: "JWT " + generateToken(roleInfo),
    roleName: roleInfo
  });
};

//========================================
// Creation Route
//========================================

exports.create = function(req, res, next) {
  // Check for creation errors
  const roleName = req.body.roleName;
  const isActive = true;

  // Return error if no roleName provided
  if (!roleName) {
    return res.status(422).send({
      error: "You must enter an role name."
    });
  }
  Role.findOne(
    {
      roleName: roleName
    },
    function(err, existingRoleName) {
      if (err) {
        return next(err);
      }

      // If roleName is not unique, return error
      if (existingRoleName) {
        return res.status(409).send({
          ok: false,
          error: "That roleName is already in use."
        });
      }

      // If roleName is unique, create roleName
      let role = new Role({
        roleName: roleName,
        isActive: isActive
      });

      role.save(function(err, role) {
        if (err) {
          return res.status(400).send({
            ok: false,
            error: err
          });
        }
        return res.status(201).json({
          ok: true,
          role: role
        });
      });
    }
  );
};

//========================================
// Search Route
//========================================

exports.search = function(req, res) {
  Role.find({})
    .sort({ name: 1 })
    .exec((err, response) => {
      if (err) {
        return res.status(400).send({ ok: false, error: err });
      }
      return res.status(200).json({
        ok: true,
        roles: response
      });
    });
};

//========================================
// Update Route
//========================================

exports.update = function(req, res) {
  let role = { roleName: req.body.newRoleName, isActive: req.body.isActive };

  if (
    role.roleName == null ||
    role.isActive == null ||
    role.isActive == "" ||
    role.roleName == ""
  ) {
    res.send(err);
  } else {
    // use our role model to find the role we want
    Role.findOneAndUpdate(
      { roleName: req.body.roleName },
      role,
      { new: true },
      function(err, roleParam) {
        if (err) res.send(err);
        return res.status(200).json({ ok: true, roles: roleParam });
      }
    );
  }
};

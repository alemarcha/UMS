"use strict";

const Permission = require("../models/permission"),
  jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  config = require("../config/main");

// Set permission info from request
function setPermissionInfo(permission) {
  return {
    _id: permission._id,
    permissionName: permissionName,
    isActive: permission.isActive
  };
}

//========================================
// Permission Route
//========================================

exports.permissionName = function(req, res, next) {
  let permissionInfo = setPermissionInfo(req.permission);
  res.status(200).json({
    ok: true,
    token: "JWT " + generateToken(permissionInfo),
    roleName: permissionInfo
  });
};

//========================================
// Creation Route
//========================================

exports.create = function(req, res, next) {
  // Check for creation errors
  const permissionName = req.body.permissionName;
  const isActive = true;

  // Return error if no permissionName provided
  if (!permissionName) {
    return res.status(422).send({ error: "You must enter a permission name." });
  }

  Permission.findOne({ permissionName: permissionName }, function(
    err,
    existingPermissionName
  ) {
    if (err) {
      return next(err);
    }

    // If permissionName is not unique, return error
    if (existingPermissionName) {
      return res.status(409).send({
        ok: false,
        error: "That permission name is already in use."
      });
    }

    // If permissionName is unique, create permissionName
    let permission = new Permission({
      permissionName: permissionName,
      isActive: isActive
    });

    permission.save(function(err, permission) {
      if (err) {
        return res.status(400).send({ ok: false, error: err });
      }
      return res.status(201).json({ ok: true, permission: permission });
    });
  });
};

//========================================
// Search Route
//========================================

exports.search = function(req, res) {
  Permission.find({})
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
// Update Route
//========================================

exports.update = function(req, res) {
  let permission = {
    permissionName: req.body.newPermissionName,
    isActive: req.body.isActive
  };

  if (
    permission.permissionName == null ||
    permission.isActive == null ||
    permission.isActive == "" ||
    permission.permissionName == ""
  ) {
    res.send(err);
  } else {
    // use our permission model to find the permission we want
    Permission.findOneAndUpdate(
      { permissionName: req.body.permissionName },
      permission,
      { new: true },
      function(err, permissionParam) {
        if (err) res.send(err);

        return res.status(200).json({ ok: true, permissions: permissionParam });
      }
    );
  }
};

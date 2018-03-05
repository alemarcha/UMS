"use strict";

const Permission = require("../models/permission"),
  jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  config = require("../config/main"),
  utils = require("utils")._;

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
    data: {
      token: "JWT " + generateToken(permissionInfo),
      roleName: permissionInfo
    }
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
  if (utils.isEmpty(permissionName)) {
    return next({
      status: 400,
      message: "You must enter a permission name.",
      err: 400
    });
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
      return res
        .status(201)
        .json({ ok: true, data: { permission: permission } });
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
        data: {
          permissions: response
        }
      });
    });
};

//========================================
// Update Permission Route
//========================================
exports.update = function(req, res, next) {
  const identifyPermission = req.params.permission;
  const permission = req.body.newPermissionName;
  const isActive = req.body.isActive;
  const permissionUpdate = {};

  if (utils.isEmpty(identifyPermission)) {
    return next({
      status: 400,
      message: "Permission provided incorrect",
      err: identifyPermission
    });
  }

  if (!utils.isEmpty(permission)) {
    permissionUpdate.permissionName = permission;
  }

  if (typeof isActive !== "undefined" || isActive !== null) {
    permissionUpdate.isActive = isActive;
  }

  // use our permission model to find the permission we want
  Permission.findOneAndUpdate(
    { permissionName: identifyPermission },
    permissionUpdate,
    { new: true },
    function(err, permissionUpdated) {
      if (err) {
        if (err.code === 11000) {
          return res.status(409).send({
            ok: false,
            error: "That permissionName is already in use."
          });
        } else {
          res.status(400).send({
            ok: false,
            error: err
          });
        }
      }
      return res
        .status(200)
        .json({ ok: true, data: { permission: permissionUpdated } });
    }
  );
};

//========================================
// Delete Permission Route
//========================================
exports.delete = function(req, res, next) {
  const identifyPermission = req.params.permission;
  const isActive = false;
  const permissionUpdate = {};

  if (!utils.isEmpty(isActive)) {
    permissionUpdate.isActive = isActive;
  }

  Permission.findOneAndUpdate(
    { permissionName: identifyPermission },
    permissionUpdate,
    { new: true },
    function(err, permissionDeleted) {
      if (err) {
        return next({
          status: 401,
          message: err.message,
          err: err
        });
      }
      return res
        .status(200)
        .json({ ok: true, data: { permission: permissionDeleted } });
    }
  );
};

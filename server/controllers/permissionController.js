"use strict";

const Permission = require("../models/permission"),
  config = require("../config/main"),
  utils = require("utils")._;

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
exports.search = async function(filter, callback) {
  let filters = { isActive: true };
  let query = Permission.find();
  let name = filter.name;

  if (!utils.isEmpty(name)) {
    filters.permissionName = {
      $regex: name,
      $options: "i"
    };
  }

  query
    .find(filters)
    .sort({ roleName: 1 })
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
      callback(null, { ok: true, data: { permissions: response } });
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

  if (!utils.isEmpty(isActive)) {
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

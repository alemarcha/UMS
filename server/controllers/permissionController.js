"use strict";

const Permission = require("../models/permission"),
  config = require("../config/main"),
  utils = require("utils")._;

//========================================
// Creation Route
//========================================
exports.create = function(body, callback) {
  // Check for creation errors
  const permissionName = body.permissionName;
  const isActive = true;

  // Return error if no permissionName provided
  if (utils.isEmpty(permissionName)) {
    return callback({
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
      return callback(err);
    }

    // If permissionName is not unique, return error
    if (existingPermissionName) {
      return callback({
        status: 409,
        message: "That permission name is already in use.",
        err: 409
      });
    }

    // If permissionName is unique, create permissionName
    let permission = new Permission({
      permissionName: permissionName,
      isActive: isActive
    });

    permission.save(function(err, permission) {
      if (err) {
        return callback({
          status: 400,
          message: err.message,
          err: err
        });
      }
      return callback(null, 201, {
        ok: true,
        data: { permission: permission }
      });
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
        return callback({
          status: 400,
          message: err.message,
          err: err
        });
      }
      callback(null, 200, { ok: true, data: { permissions: response } });
    });
};

//========================================
// Update Permission Route
//========================================
exports.update = function(params, body, callback) {
  const identifyPermission = params.permission;
  const permission = body.newPermissionName;
  const isActive = body.isActive;
  const permissionUpdate = {};

  if (utils.isEmpty(identifyPermission)) {
    return callback({
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

  Permission.findOneAndUpdate(
    { permissionName: identifyPermission },
    permissionUpdate,
    { new: true },
    function(err, permissionUpdated) {
      if (err) {
        if (err.code === 11000) {
          return callback({
            status: 409,
            message: "That permissionName is already in use.",
            err: permissionUpdated
          });
        } else {
          return callback({
            status: 400,
            message: err.message,
            err: err
          });
        }
      }
      return callback(null, 200, {
        ok: true,
        data: { permission: permissionUpdated }
      });
    }
  );
};

//========================================
// Delete Permission Route
//========================================
exports.delete = function(params, callback) {
  const identifyPermission = params.permission;
  const permissionUpdate = {};

  permissionUpdate.isActive = false;
  if (utils.isEmpty(identifyPermission)) {
    return callback({
      status: 400,
      message: "You must introduce a permission",
      err: 400
    });
  }
  Permission.findOneAndUpdate(
    { permissionName: identifyPermission },
    permissionUpdate,
    { new: true },
    function(err, permissionDeleted) {
      if (err) {
        return callback({
          status: 401,
          message: err.message,
          err: err
        });
      }
      return callback(null, 200, {
        ok: true,
        data: { permission: permissionDeleted }
      });
    }
  );
};

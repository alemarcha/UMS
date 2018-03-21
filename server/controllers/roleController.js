"use strict";

const Role = require("../models/role"),
  Permission = require("../models/permission"),
  config = require("../config/main"),
  utils = require("utils")._;

//========================================
// Creation Route
//========================================

exports.create = async function(body, callback) {
  // Check for creation errors
  const roleName = body.roleName;
  const permissions = body.permissions;
  const isActive = true;
  const roleCreate = {};

  // Return error if no roleName provided
  if (utils.isEmpty(roleName)) {
    return callback({
      status: 400,
      message: "You must enter a role name.",
      err: 400
    });
  }

  if (!utils.isEmpty(permissions)) {
    let newPermissions = [];
    let getPermissionsByName = () => {
      return Permission.find({ isActive: true })
        .where("permissionName")
        .in(permissions)
        .exec()
        .then(response => {
          return response;
        });
    };
    newPermissions = await getPermissionsByName();
    if (newPermissions.length === permissions.length) {
      roleCreate.permissions = newPermissions;
    } else {
      return callback({
        status: 400,
        message: "You must enter a valid active permissions array.",
        err: permissions
      });
    }
  }

  Role.findOne(
    {
      roleName: roleName
    },
    function(err, existingRoleName) {
      if (err) {
        return callback(err);
      }

      // If roleName is not unique, return error
      if (existingRoleName) {
        return callback({
          status: 409,
          message: "That roleName is already in use.",
          err: 409
        });
      }

      // If roleName is unique, create roleName
      let role = new Role({
        roleName: roleName,
        isActive: isActive,
        permissions: roleCreate.permissions
      });

      role.save(function(err, role) {
        if (err) {
          return callback({
            status: 400,
            message: err.message,
            err: err
          });
        }
        return callback(null, 201, {
          ok: true,
          data: {
            role: role
          }
        });
      });
    }
  );
};

//========================================
// Search Route
//========================================
exports.search = async function(filter, callback) {
  let filters = { isActive: true };
  let query = Role.find();
  let name = filter.name;
  let permissions = filter.permissions;

  if (!utils.isEmpty(name)) {
    filters.roleName = {
      $regex: name,
      $options: "i"
    };
  }

  if (!utils.isEmpty(permissions)) {
    let arrayPermissions = permissions.split(",");
    let getPermissionsIdByNames = () => {
      return Permission.find({ isActive: true })
        .where("permissionName")
        .in(arrayPermissions)
        .exec()
        .then(response => {
          return response;
        });
    };
    let arrayPermissionsId = await getPermissionsIdByNames();
    query.where("permissions").in(arrayPermissionsId);
  }

  query
    .find(filters)
    .populate("permissions")
    .sort({ roleName: 1 })
    .exec((err, response) => {
      if (err) {
        callback({
          status: 400,
          message: err.message,
          err: err
        });
      }
      callback(null, 200, { ok: true, data: { roles: response } });
    });
};

//========================================
// Update Role Route
//========================================

exports.update = async function(params, body, callback) {
  const identifyRole = params.role;
  const role = body.newRoleName;
  const permissions = body.permissions;
  const isActive = body.isActive;
  const roleUpdate = {};

  if (utils.isEmpty(identifyRole)) {
    return callback({
      status: 400,
      message: "Role provided incorrect",
      err: identifyRole
    });
  }

  if (!utils.isEmpty(role)) {
    roleUpdate.roleName = role;
  }
  if (!utils.isEmpty(isActive)) {
    roleUpdate.isActive = isActive;
  }

  // permissions array
  if (!utils.isEmpty(permissions)) {
    let newPermissions = [];
    let getPermissionsByName = () => {
      return Permission.find({ isActive: true })
        .where("permissionName")
        .in(permissions)
        .exec()
        .then(response => {
          return response;
        });
    };
    newPermissions = await getPermissionsByName();
    if (newPermissions.length === permissions.length) {
      roleUpdate.permissions = newPermissions;
    } else {
      return callback({
        status: 400,
        message: "permissions to update are not correct",
        err: permissions
      });
    }
  }

  Role.findOneAndUpdate({ roleName: identifyRole }, roleUpdate, {
    new: true
  })
    .populate("permissions")
    .exec(function(err, roleUpdated) {
      if (err) {
        if (err.code === 11000) {
          return callback({
            status: 409,
            message: "That roleName is already in use.",
            err: roleUpdated
          });
        } else {
          return callback({
            status: 400,
            message: err.message,
            err: err
          });
        }
      }
      return callback(null, 200, { ok: true, data: { role: roleUpdated } });
    });
};

//========================================
// Delete Role Route
//========================================
exports.delete = function(params, callback) {
  const identifyRole = params.role;
  const roleUpdate = {};

  roleUpdate.isActive = false;

  if (utils.isEmpty(identifyRole)) {
    return callback({
      status: 400,
      message: "You must introduce a role",
      err: 400
    });
  }

  Role.findOneAndUpdate(
    { roleName: identifyRole },
    roleUpdate,
    { new: true },
    function(err, roleDeleted) {
      if (err) {
        return callback({
          status: 401,
          message: err.message,
          err: err
        });
      }
      if (utils.isEmpty(roleDeleted)) {
        return callback({
          status: 400,
          message: "Entity: " + identifyRole + " not found",
          err: 400
        });
      }
      return callback(null, 200, { ok: true, data: { role: roleDeleted } });
    }
  );
};

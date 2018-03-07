"use strict";

const Role = require("../models/role"),
  Permission = require("../models/permission"),
  config = require("../config/main"),
  utils = require("utils")._;

//========================================
// Creation Route
//========================================

exports.create = function(req, res, next) {
  // Check for creation errors
  const roleName = req.body.roleName;
  const isActive = true;

  // Return error if no roleName provided
  if (utils.isEmpty(roleName)) {
    return next({
      status: 400,
      message: "You must enter a role name.",
      err: 400
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

exports.search = function(req, res) {
  Role.find({})
    .sort({ name: 1 })
    .exec((err, response) => {
      if (err) {
        return res.status(400).send({ ok: false, error: err });
      }
      return res.status(200).json({
        ok: true,
        data: {
          roles: response
        }
      });
    });
};

//========================================
// Update Role Route
//========================================

exports.update = async function(req, res, next) {
  const identifyRole = req.params.role;
  const role = req.body.newRoleName;
  const permissions = req.body.permissions;
  const isActive = req.body.isActive;
  const roleUpdate = {};

  if (utils.isEmpty(identifyRole)) {
    return next({
      status: 400,
      message: "Role provided incorrect",
      err: identifyRole
    });
  }

  if (!utils.isEmpty(role)) {
    roleUpdate.roleName = role;
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
          console.log("asf " + JSON.stringify(response));

          return response;
        });
    };
    newPermissions = await getPermissionsByName();
    if (newPermissions.length === permissions.length) {
      roleUpdate.permissions = newPermissions;
    } else {
      return next({
        status: 400,
        message: "permissions to update are not correct",
        err: permissions
      });
    }
  }

  if (!utils.isEmpty(isActive)) {
    roleUpdate.isActive = isActive;
  }

  Role.findOneAndUpdate({ roleName: identifyRole }, roleUpdate, {
    new: true
  })
    .populate("permissions")
    .exec(function(err, roleUpdated) {
      if (err) {
        if (err.code === 11000) {
          return next({
            status: 409,
            message: "That roleName is already in use.",
            err: roleUpdated
          });
        } else {
          return next({
            status: 400,
            message: err.message,
            err: err
          });
        }
      }
      return res.status(200).json({ ok: true, data: { role: roleUpdated } });
    });
};

//========================================
// Delete Role Route
//========================================
exports.delete = function(req, res, next) {
  const identifyRole = req.params.role;
  const isActive = false;
  const roleUpdate = {};

  if (!utils.isEmpty(isActive)) {
    roleUpdate.isActive = isActive;
  }

  Role.findOneAndUpdate(
    { role: identifyRole },
    roleUpdate,
    { new: true },
    function(err, roleDeleted) {
      if (err) {
        return next({
          status: 401,
          message: err.message,
          err: err
        });
      }
      return res.status(200).json({ ok: true, data: { role: roleDeleted } });
    }
  );
};

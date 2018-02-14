"use strict";

const Role = require("../models/role"),
  config = require("../config/main");

exports.search = function(req, res) {
  Role.find({})
    .sort({ name: 1 })
    .exec((err, response) => {
      if (err) {
        return res.status(422).send({ ok: false, error: err });
      }
      return res.status(200).json({
        ok: true,
        roles: response
      });
    });
};

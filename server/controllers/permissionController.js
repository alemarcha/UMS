"use strict";

const Permission = require("../models/permission"),
  config = require("../config/main");

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

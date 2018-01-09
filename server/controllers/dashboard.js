"use strict"

const jwt = require('jsonwebtoken'),  
      User = require('../models/user'),
      config = require('../config/main');

//========================================
// Dashboard Route
//========================================
exports.dashboard = function(req, res, next) {
    let userInfo = setUserInfo(req.user);
  
    res.status(200).json({
      token: 'JWT ' + generateToken(userInfo),
      user: userInfo
    });
}
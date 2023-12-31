const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { model } = require("mongoose");
require("dotenv").config({ path: "../config/.env" });

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN || '', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res,next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN || '', async (err, decodedToken) => {
      req.jwt = decodedToken
      if (err) {
        console.log(err);
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  }
  else{
    console.log('No token');
    res.status(401).send('Not authenticated')
  }
};

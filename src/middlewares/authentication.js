const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Employee } = require("../models/employee");

const verifyCallback = (req, res, next, resolve, reject) => (err, user, info) => {
  if (err || info || !user) {
   reject(info)
  }
  req.user = user;
  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, res, next, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => {
      next(err)
    });
};

module.exports = { auth };

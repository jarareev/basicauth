const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Employee = require('../models/employee')
require('dotenv').config()

const jwtOptions = {
    secretOrKey: process.env.SECRETKEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        const user = await Employee.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};
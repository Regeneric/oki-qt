const passport = require("passport");
const passportJWT = require("passport-jwt");

const User = require("../models/user.model");

const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const verifyCallback = (payload, done) => {
    return User.findOne({_id: payload.id})
        .then(user => done(null, user))
    .catch(err => done(err));
}

module.exports = () => {
    const config = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: process.env.JWT_SECRET,
    }

    passport.use(User.createStrategy());
    passport.use(new JWTStrategy(config, verifyCallback));
}
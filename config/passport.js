const JwtStratgy=require('passport-jwt').Strategy
const ExtractJwt=require('passport-jwt').ExtractJwt
const passport=require('passport')
const User=require('../models/user')
const config=require('../config/database')

module.exports = function(passport) {
    console.log("passs");
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStratgy(opts, (jwt_payload, done) => {
        console.log("payload",jwt_payload);
      User.getUserById(jwt_payload.data._id, (err, user) => {
        if(err) {
          return done(err, false);
        }
        if(user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
        
      });
    }));

      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
  }
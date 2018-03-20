// Importing Passport, strategies, and config
const passport = require("passport"),
  User = require("../models/user"),
  UserController = require("../controllers/userController"),
  config = require("./main"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  LocalStrategy = require("passport-local"),
  fs = require("fs"),
  utils = require("utils")._;

const publicKey = fs.readFileSync(
  global.__basedir + config.jwtPublicKeyPath,
  "utf8"
);
// Setting up local login strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  User.findOne({ email: email, isActive: true }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        error: "Your login details could not be verified. Please try again."
      });
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false, {
          error: "Your login details could not be verified. Please try again."
        });
      }

      return done(null, user);
    });
  });
});

// JWT authentication options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT -> Authorization: JWT Token
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  // Telling Passport where to find the secret
  secretOrKey: publicKey,
  algorithms: ["RS256"]
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // if jwt token is no valid or expired will return a 401 http code
  UserController.findById(payload._id, (err, user) => {
    if (err) {
      // console.log(jwtOptions);
      return done(err, false);
    }
    if (user) {
      // Check if user contains given refresh token and is active
      let refreshToken = user.tokens.find(tokenBd => {
        return tokenBd.refreshToken === payload.refreshToken && tokenBd.active;
      });
      if (!utils.isEmpty(refreshToken)) {
        done(null, {
          user: user,
          token: jwtOptions.jwtFromRequest,
          refreshToken: payload.refreshToken
        });
      } else {
        done(null, false, {
          error: "Refresh token no valid. Please login."
        });
      }
    } else {
      done(null, false, {
        error: "JWT no valid. Please login."
      });
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);

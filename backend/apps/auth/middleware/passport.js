var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../../../core/db/sequelize").models;

//Serialises user object in preparation for storing in the sessions database
passport.serializeUser(function (user, done) {
  done(null, {
    id: user.id,
    email: user.email,
  });
});

//Returns user object untouched without database query
passport.deserializeUser(async function (user, done) {
  let fullUser = await User.findByPk(user.id);
  done(null, fullUser);
});

//Locally stored passwords strategy
//Takes an email and password from post request
//Searches the database for the corresponding email
//Hashes the password if there were results and returns
//The appropriate user
passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    async function (req, email, password, done) {
      email = email.toLowerCase();
      let matchingUser = await User.findAll({ where: { email: email } });

      //No user found with matching email address, or multiple users found
      if (matchingUser.length !== 1)
        return done(null, false, {
          errorCode: 1,
          message: "Incorrect email",
        });

      matchingUser = matchingUser[0];

      var isMatch = await bcrypt.compare(password, matchingUser.hash);

      if (!isMatch)
        return done(null, false, {
          errorCode: 2,
          message: "Incorrect password.",
        });

      return done(null, matchingUser);
    }
  )
);

module.exports = passport;

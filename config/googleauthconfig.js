const passport = require('passport');
const { userModel } = require('../models/user');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === "production" ? "https://cartify-vawj.onrender.com/auth/google/callback" : "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Check if profile.emails is defined
      if (!profile.emails || !profile.emails.length) {
        return cb(new Error("No email found in profile"), false);
      }

      let user = await userModel.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = new userModel({
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
      }
      cb(null, user);
    } catch (err) {
      console.log(err);
      cb(err, false);
    }
  }
));

passport.serializeUser(function(user, cb) {
  return cb(null, user._id);
});

//passport.deserializeUser(async function(id, cb) {
  //try {
 //   const user = await userModel.findOne({ _id: id });
 //   cb(null, user);
//  } catch (err) {
  //  cb(err, null);
  //}
//});

passport.deserializeUser(async function(id, cb) {
  try {
    const user = await userModel.findOne({ _id: id });

    if (!user) {
      return cb(new Error("User not found. Please log in again."), null);
    }

    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
});

module.exports = passport;

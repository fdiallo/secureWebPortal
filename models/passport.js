const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./User');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL, 
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
     
      let user = await User.findOne({ githubId: profile.id });
      if (user) return done(null, user);

      const primaryEmail = profile.emails && profile.emails[0].value;
      if (primaryEmail) {
        user = await User.findOne({ email: primaryEmail });
        
        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      const newUser = new User({
        email: primaryEmail,
        githubId: profile.id
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

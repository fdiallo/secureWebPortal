const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./User');

/**
 * Defines the GitHubStrategy, checking the database for an existing GitHub ID or matching email. 
 * It creates a new account if the user is logging in for the first time.
 */
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
},
    async function (accessToken, refreshToken, profile, done) {
        try {

            // Find user by githubId
            let user = await User.findOne({ githubId: profile.id });
            if (user) return done(null, user);

            // Check if a user with this email exists
            const primaryEmail = profile.emails && profile.emails[0].value;
            if (primaryEmail) {
                user = await User.findOne({ email: primaryEmail });

                if (user) {
                    user.githubId = profile.id;
                    await user.save();
                    return done(null, user);
                }
            }

            // Create a new user if no account with this email/githubId exists
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

// Serialization for sessions management
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

const router = require('express').Router();
const { User } = require("./../../models/User.js")
const { signToken } = require('../../utils/auth');

// POST /api/users/register - Create a new user
router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json(err);
  }
});

// POST /api/users/login - Authenticate a user and return a token
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  const correctPw = await user.isCorrectPassword(req.body.password);

  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' });
  }

  const token = signToken(user);
  res.json({ token, user });
});

// When a user visits this URL, they will be redirected to GitHub to log in.
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }) // Request email scope
);
 
// The callback route that GitHub will redirect to after the user approves.
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login', 
    session: false 
  }),
  (req, res) => {
    const token = signToken(req.user);
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

module.exports = router;
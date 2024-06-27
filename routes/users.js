var express = require('express');
var router = express.Router();
const { addUser, findUser, readUsers } = require('../userManager');
const { readScores } = require('../scoreManager');

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

/* POST signup data. */
router.post('/signup', function(req, res, next) {
  const { username, password } = req.body;
  if (findUser(username)) {
    res.send('Username already taken');
  } else {
    addUser({ username, password });
    res.redirect('/users/login');
  }
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* POST login data. */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const user = findUser(username);
  if (user && user.password === password) {
    // Store user session
    req.session.user = user;
    res.redirect('/');
  } else {
    res.send('Invalid username or password');
  }
});

/* GET logout */
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

/* GET local leaderboard */
router.get('/leaderboard/local', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }

  const scores = readScores();
  const userScores = scores.games.filter(game => game.username === req.session.user.username);
  userScores.sort((a, b) => b.score - a.score); // Sort by score descending

  res.render('leaderboard', { title: 'Local Leaderboard', scores: userScores, user: req.session.user });
});

/* GET global leaderboard */
router.get('/leaderboard/global', function(req, res, next) {
  const scores = readScores();
  const globalScores = scores.games;
  globalScores.sort((a, b) => b.score - a.score); // Sort by score descending

  res.render('leaderboard', { title: 'Global Leaderboard', scores: globalScores, user: req.session.user });
});

module.exports = router;

var express = require('express');
var router = express.Router();
const { readScores } = require('../scoreManager');

/* GET home page. */
router.get('/', function(req, res, next) {
  const scores = readScores();
  const globalScores = scores.games.sort((a, b) => b.score - a.score).slice(0, 10); // Get top 10 global scores

  let userScores = [];
  if (req.session.user) {
    userScores = scores.games.filter(game => game.username === req.session.user.username)
      .sort((a, b) => b.score - a.score).slice(0, 10); // Get top 10 user scores
  }

  res.render('index', { 
    title: 'Quiz Web App', 
    user: req.session.user, 
    globalScores: globalScores,
    userScores: userScores
  });
});

module.exports = router;

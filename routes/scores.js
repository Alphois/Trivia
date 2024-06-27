var express = require('express');
var router = express.Router();
const { readScores } = require('../scoreManager');

router.get('/', function(req, res, next) {
  const scores = readScores();
  res.render('scores', { games: scores.games });
});

module.exports = router;

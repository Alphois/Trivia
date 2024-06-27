var express = require('express');
var router = express.Router();
const { readScores } = require('../scoreManager');

router.get('/details/:id', function(req, res, next) {
  const scores = readScores();
  const score = scores.games.find(game => game.id == req.params.id);

  if (!score) {
    return res.status(404).send('Score not found');
  }

  res.render('details', { title: 'Score Details', score });
});

module.exports = router;

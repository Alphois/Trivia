var express = require('express');
var router = express.Router();

/* GET score page. */
router.get('/', function(req, res, next) {
  res.render('score', { score: 0, totalQuestions: 0 }); // Default values
});

module.exports = router;

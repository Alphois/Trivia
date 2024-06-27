var express = require('express');
var axios = require('axios');
var router = express.Router();
const { addScore } = require('../scoreManager');  // Import scoreManager

// Middleware to check if user is logged in
function ensureLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

router.post('/', ensureLoggedIn, async function(req, res, next) {
  const { amount, category, difficulty, type } = req.body;

  let params = { amount };
  if (category) params.category = category;
  if (difficulty) params.difficulty = difficulty;
  if (type) params.type = type;

  try {
    const response = await axios.get('https://opentdb.com/api.php', { params });
    const questions = response.data.results;
    res.render('quiz', {
      title: 'Quiz Time',
      parsedQuestions: questions,
      currentQuestionIndex: 0,
      score: 0,
      feedback: null,
      amount,
      category,
      difficulty,
      type
    });
  } catch (error) {
    next(error);
  }
});


router.post('/answer', ensureLoggedIn, function(req, res, next) {
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    score,
    amount,
    category,
    difficulty,
    type
  } = req.body;
  const parsedQuestions = JSON.parse(questions);
  const correctAnswer = parsedQuestions[currentQuestionIndex].correct_answer;

  const isCorrect = selectedAnswer === correctAnswer;
  const newScore = isCorrect ? parseInt(score) + 1 : parseInt(score);
  const nextQuestionIndex = parseInt(currentQuestionIndex) + 1;

  if (nextQuestionIndex < parsedQuestions.length) {
    res.render('quiz', {
      title: 'Quiz Time',
      parsedQuestions: parsedQuestions,
      currentQuestionIndex: nextQuestionIndex,
      score: newScore,
      feedback: isCorrect ? 'Correct!' : 'Incorrect!',
      amount,
      category,
      difficulty,
      type
    });
  } else {
    const gameData = {
      username: req.session.user.username, // Add username to game data
      score: newScore,
      amount: amount,
      category: category,
      difficulty: difficulty,
      type: type,
      datetime: new Date().toISOString()  // Add datetime to game data
    };
    addScore(gameData);  // Save the game data to the JSON file
    res.render('score', {
      score: newScore,
      totalQuestions: parsedQuestions.length,
      feedback: isCorrect ? 'Correct!' : 'Incorrect!'
    });
  }
});

module.exports = router;

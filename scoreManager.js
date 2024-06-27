const fs = require('fs');
const path = require('path');
const scoresFilePath = path.join(__dirname, 'data', 'scores.json');

function readScores() {
  try {
    const data = fs.readFileSync(scoresFilePath, 'utf-8');
    return data ? JSON.parse(data) : { games: [] };
  } catch (error) {
    console.error('Error reading scores:', error);
    return { games: [] };
  }
}

function writeScores(data) {
  fs.writeFileSync(scoresFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

function addScore(gameData) {
  const scores = readScores();
  const newGame = {
    id: scores.games.length + 1,
    ...gameData
  };
  scores.games.push(newGame);
  writeScores(scores);
}

module.exports = {
  readScores,
  writeScores,
  addScore
};

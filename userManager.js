const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'data', 'users.json');

function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return data ? JSON.parse(data) : { users: [] };
  } catch (error) {
    console.error('Error reading users:', error);
    return { users: [] };
  }
}

function writeUsers(data) {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

function addUser(userData) {
  const users = readUsers();
  const newUser = {
    id: users.users.length + 1,
    ...userData
  };
  users.users.push(newUser);
  writeUsers(users);
}

function findUser(username) {
  const users = readUsers();
  return users.users.find(user => user.username === username);
}

module.exports = {
  readUsers,
  writeUsers,
  addUser,
  findUser
};

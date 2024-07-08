const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const loadPasswordList = (filePath) => {
  const passwords = fs.readFileSync(filePath, 'utf8').split('\n').map(line => line.trim());
  return passwords;
};

const passwords = loadPasswordList('passwords.txt');
let correctPassword = null;

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/get_passwords', (req, res) => {
  if (correctPassword === null) {
    correctPassword = passwords[Math.floor(Math.random() * passwords.length)];
  }
  let pw2 = passwords[Math.floor(Math.random() * passwords.length)];
  while (pw2 === correctPassword) {
    pw2 = passwords[Math.floor(Math.random() * passwords.length)];
  }
  res.json({ password1: correctPassword, password2: pw2 });
});

app.post('/check_guess', (req, res) => {
  const { password1, password2, guess } = req.body;

  const pos1 = passwords.indexOf(password1);
  const pos2 = passwords.indexOf(password2);

  const correct = (guess === "1" && pos1 < pos2) || (guess === "2" && pos2 < pos1);
  // The original Python code snippet ends here without showing how the result is used.
  // Assuming we want to send back a JSON response indicating whether the guess was correct.
  res.json({ correct });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
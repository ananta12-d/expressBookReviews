const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const users = require("./users");   

const regd_users = express.Router();

const authenticatedUser = (username, password) => {
  let validUser = users.find(
    u => u.username === username && u.password === password
  );
  return validUser ? true : false;
};

function isValid(username) {
  let user = users.find(u => u.username === username);
  return user ? false : true;
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  req.session.user = { username, token };

  return res.status(200).json({ message: "Login successful", token });
});

module.exports.authenticated = regd_users;
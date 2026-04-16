const express = require('express');
let books = require("./booksdb.js");
let users = require("./users");   
const axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    users.push({ username, password });
  
    return res.status(200).json({ message: "User registered successfully" });
  });

public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const result = Object.keys(books)
      .filter(isbn => books[isbn].author === author)
      .map(isbn => books[isbn]);
  
    return res.status(200).json(result);
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const result = Object.keys(books)
      .filter(isbn => books[isbn].title === title)
      .map(isbn => books[isbn]);
  
    return res.status(200).json(result);
  });
public_users.get('/async/books', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
public_users.get('/async/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
  
      const response = await axios.get('http://localhost:5000/');
      const books = response.data;
  
      const result = Object.values(books).filter(
        book => book.author === author
      );
  
      return res.status(200).json(result);
  
    } catch (err) {
      return res.status(500).json({ message: "Error fetching by author" });
    }
  });

public_users.get('/async/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
  
      const response = await axios.get('http://localhost:5000/');
      const books = response.data;
  
      const result = Object.values(books).filter(
        book => book.title === title
      );
  
      return res.status(200).json(result);
  
    } catch (err) {
      return res.status(500).json({ message: "Error fetching by title" });
    }
  });
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
  
      const response = await axios.get('http://localhost:5000/');
      const books = response.data;
  
      return res.status(200).json(books[isbn] || { message: "Book not found" });
  
    } catch (err) {
      return res.status(500).json({ message: "Error fetching book" });
    }
  });
module.exports.general = public_users;

const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username is valid (not taken)
    if (!isValid(username)) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    // Register new user
    users.push({ username, password });
    res.status(200).json({ message: "User registered successfully" });
});

// Get the list of all books (Task 10)
public_users.get('/', async (req, res) => {
    try {
        // Simulate fetching book data asynchronously using a Promise (or Axios if from a remote server)
        const booksList = await new Promise((resolve, reject) => {
            resolve(books);  // Normally, you'd fetch this data from an API.
        });

        res.status(200).json(booksList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books list", error });
    }
});

// Get book details based on ISBN (Task 11)
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Simulate fetching book details asynchronously using a Promise (or Axios if from a remote server)
        const bookDetails = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });

        res.status(200).json(bookDetails);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get books based on author (Task 12)
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(book => book.author === author);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject("No books found by this author");
            }
        });

        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get books based on title (Task 13)
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(book => book.title === title);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject("No books found with this title");
            }
        });

        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const reviews = await new Promise((resolve, reject) => {
            if (books[isbn] && books[isbn].reviews) {
                resolve(books[isbn].reviews);
            } else {
                reject("No reviews found for this book");
            }
        });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;

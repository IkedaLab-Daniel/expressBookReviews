const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'admin', password: 'password' } // Example user; replace with actual data
];

const SECRET_KEY = 'secret_key'; 

// Check if the username is valid (not already taken)
const isValid = (username) => {
    return !users.some(user => user.username === username);
}

// Check if the username and password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Check if the user exists and password is correct
    if (authenticatedUser(username, password)) {
        // Generate a JWT
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        
        // Store the token in the session
        req.session.token = token;
        
        res.status(200).json({ message: "Login successful", token });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user?.username; // Get the username from the authenticated request

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review for this book by this user
    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;

    res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user?.username; // Get the username from the authenticated request

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(400).json({ message: "Review not found for this user" });
    }

    // Delete the review by the authenticated user
    delete books[isbn].reviews[username];

    res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

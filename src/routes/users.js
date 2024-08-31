const express = require('express');
const router = express.Router(); // Initialize the router

// Import functions from your services file
const { registerUser, authenticateUser } = require('../services/dbservices');

/**
 * @route POST /api/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    registerUser(username, password, (err, userId) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: userId });
    });
});

/**
 * @route POST /api/login
 * @desc Authenticate a user
 * @access Public
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    authenticateUser(username, password, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!result) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json(result);
    });
});

module.exports = router; // Export the router for use in the main app

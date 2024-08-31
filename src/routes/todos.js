const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getAllTodos, createTodo, updateTodoById, deleteTodoById } = require('../services/dbservices');


// Middleware to handle JSON requests
router.use(express.json());

// Potential optimisation here: incorporate both checks in a single function 
// Middleware to ensure content-type is application/json
router.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).json({ error: 'Content-Type must be application/json' });
        }
    }
    next();
});

// Middleware to check if body is present
router.use((req, res, next) => {
    if ((req.method === 'POST' || req.method === 'PUT') && !req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }
    next();
});

const authenticateToken = require('./authenticateToken');

// Protect the /todos routes
router.use('/todos', authenticateToken);


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
/**
 * @route GET /api/todos
 * @desc Get all todos
 * @access Public
 */
router.get('/todos', (req, res) => {
    getAllTodos((err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

/**
 * @route POST /api/todos
 * @desc Create a new to do
 * @access Public
 */
router.post('/todos', (req, res) => {
    const { task } = req.body;
    createTodo(task, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(result);
    });
});

/**
 * @route PUT /api/todos/:id
 * @desc Update a to do by id
 * @access Public
 */
router.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;

    updateTodoById(id, task, completed, (err, changes) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ id, task, completed });
    });
});

/**
 * @route DELETE /api/todos/:id
 * @desc Delete a to do by id
 * @access Public
 */
router.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    deleteTodoById(id, (err, changes) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(204).end();
    });
});

module.exports = router;
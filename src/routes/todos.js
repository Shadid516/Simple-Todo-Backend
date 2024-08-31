const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, updateTodoById, deleteTodoById } = require('../services/dbservices');
const authenticateToken = require('../services/authenticatetoken');

// Middleware to ensure content-type is application/json and body is present
router.use((req, res, next) => {
    if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Content-Type must be application/json' });
    }
    if ((req.method === 'POST' || req.method === 'PUT') && !req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }
    next();
});



/**
 * @route GET /api/todos
 * @desc Get all todos
 * @access Protected
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
 * @desc Create a new todo
 * @access Protected
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
 * @desc Update a todo by id
 * @access Protected
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
 * @desc Delete a todo by id
 * @access Protected
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

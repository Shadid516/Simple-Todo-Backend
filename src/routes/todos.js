const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, updateTodoById, deleteTodoById } = require('../services/dbservices');

/**
 * @route GET /api/todos
 * @desc Get all todos for the authenticated user
 * @access Protected
 */
router.get('/', (req, res) => {
    // Extract user ID from the authenticated token
    const userId = req.user.id;

    // Pass the user ID to getAllTodos to fetch todos for that user
    getAllTodos(userId, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


/**
 * @route POST /api/todos
 * @desc Create a new to do
 * @access Protected
 */
router.post('/', (req, res) => {
    const userId = req.user.id; // Get userId from the authenticated user
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }

    createTodo(userId, task, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(result);
    });
});

/**
 * @route PUT /api/todos/:id
 * @desc Update a to do by id
 * @access Protected
 */
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const userId = req.user.id; // Extract userId from req.user set by authenticateToken

    updateTodoById(userId, id, task, completed, (err, changes) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ message: 'Todo not found or you are not authorized to update this todo' });
        }
        res.json({ id, task, completed });
    });
});


/**
 * @route DELETE /api/todos/:id
 * @desc Delete a to do by id
 * @access Protected
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params; //TODO add userId to func
    const userId = req.user.id; // Extract userId from req.user set by authenticateToken

    deleteTodoById(userId, id, (err, changes) => {
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

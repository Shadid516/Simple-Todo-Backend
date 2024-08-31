const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, updateTodoById, deleteTodoById } = require('../services/dbservices');

/**
 * @route GET /api/todos
 * @desc Get all todos for the authenticated user
 * @access Protected
 */
router.get('/todos', (req, res) => {
    // Extract user ID from the authenticated token
    const userId = req.user.userId;

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
router.post('/todos', (req, res) => {
    const { task } = req.body;
    console.log(task);
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
 * @desc Delete a to do by id
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

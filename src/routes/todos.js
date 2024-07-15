const express = require('express');
const router = express.Router();

let todos = []; // Temporary in-memory storage for todos, should later become per user.

/**
 * @route GET /api/todos
 * @desc Get all todos
 * @access Public
 */
router.get('/todos', (req, res) => {
    res.json(todos);
});

/**
 * @route POST /api/todos
 * @desc Create a new to do
 * @access Public
 */
router.post('/todos', (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        task: req.body.task,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

/**
 * @route PUT /api/todos/:id
 * @desc Update a to do by id
 * @access Public
 */
router.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const todo = todos.find(t => t.id === parseInt(id));
    if (todo) {
        todo.task = task !== undefined ? task : todo.task;
        todo.completed = completed !== undefined ? completed : todo.completed;
        res.json(todo);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

/**
 * @route DELETE /api/todos/:id
 * @desc Delete a to do by id
 * @access Public
 */
router.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
        todos.splice(index, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

module.exports = router;

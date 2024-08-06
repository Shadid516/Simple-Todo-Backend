const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./app.db');

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

/**
 * @route GET /api/todos
 * @desc Get all todos
 * @access Public
 */
router.get('/todos', (req, res) => {
    db.all('SELECT * FROM todos ORDER BY created_at ASC', [], (err, rows) => {
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
    const id = uuidv4(); // Generate a unique UUID
    const completed = false;
    const createdAt = new Date().toISOString(); // Get current time in ISO format including milliseconds
    console.log("id:" + id + "\nbody:" + task + "\ncompleted:" + completed);
    db.run('INSERT INTO todos (id, task, completed, created_at) VALUES (?, ?, ?, ?)', [id, task, completed, createdAt], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id });
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

    db.run('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
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

    db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(204).end();
    });
});

module.exports = router;
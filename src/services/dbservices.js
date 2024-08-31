const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// Connect to SQLite database
const db = new sqlite3.Database('./app.db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const jwtSecret = 'your_jwt_secret'; // Replace with your actual secret

// Function to register a new user
function registerUser(username, password, callback) {
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return callback(err);
        }

        db.run('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
            callback(err, this.lastID);
        });
    });
}

// Function to authenticate a user
function authenticateUser(username, password, callback) {
    db.get('SELECT * FROM user WHERE username = ?', [username], (err, user) => {
        if (err) {
            return callback(err);
        }
        if (!user) {
            return callback(null, false); // User not found
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return callback(err);
            }
            if (!isMatch) {
                return callback(null, false); // Password does not match
            }

            // Generate a JWT
            const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });
            callback(null, { token });
        });
    });
}

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Function to get all todos
function getAllTodos(callback) {
    db.all('SELECT * FROM todos ORDER BY created_at ASC', [], callback);
}

// Function to create a new to do
function createTodo(task, callback) {
    const id = uuidv4();
    const completed = false;
    const createdAt = new Date().toISOString();

    db.run('INSERT INTO todos (id, task, completed, created_at) VALUES (?, ?, ?, ?)', [id, task, completed, createdAt], function (err) {
        callback(err, { id });
    });
}

// Function to update a to do by id
function updateTodoById(id, task, completed, callback) {
    db.run('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id], function (err) {
        callback(err, this.changes);
    });
}

// Function to delete a to do by id
function deleteTodoById(id, callback) {
    db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
        callback(err, this.changes);
    });
}

module.exports = {
    getAllTodos,
    createTodo,
    updateTodoById,
    deleteTodoById,
    registerUser,
    authenticateUser,
    authenticateToken
};
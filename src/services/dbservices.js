const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// Connect to SQLite database
const db = new sqlite3.Database('./app.db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET; // Ensure JWT secret is loaded from environment variables

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


//function to get all todos by userId
function getAllTodos(userId, callback) {
    // Query to select todos for the specific user
    const query = 'SELECT id, task, completed, created_at FROM todos WHERE user_id = ? ORDER BY created_at ASC';

    db.all(query, [userId], (err, rows) => {
        callback(err, rows);
    });
}
//TODO update createTodo, updateTodoById, deleteTodoById to use new db schema
// Function to create a new to do
function createTodo(userId, task, callback) {
    const id = uuidv4();
    const completed = false;
    const createdAt = new Date().toISOString();

    db.run('INSERT INTO todos (id, task, completed, created_at, user_id) VALUES (?, ?, ?, ?, ?)', [id, task, completed, createdAt, userId], function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { id });
        }
    });
}

// Function to update a to do by id
function updateTodoById(userId, id, task, completed, callback) {
    db.run('UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?', [task, completed, id, userId], function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, this.changes); // this.changes will be the number of rows affected
        }
    });
}


// Function to delete a to do by id
function deleteTodoById(userId, id, callback) {
    db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId], function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, this.changes); // this.changes will be the number of rows affected
        }
    });
}


module.exports = {
    getAllTodos,
    createTodo,
    updateTodoById,
    deleteTodoById,
    registerUser,
    authenticateUser
};

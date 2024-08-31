const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app.db');

// Function to create the tables
function createTables() {
    // SQL statement to create 'todos' table
    const createTodosTable = `
        CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            task TEXT NOT NULL,
            completed BOOLEAN NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );
    `;

    // SQL statement to create 'user' table
    const createUserTable = `
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            account_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        );
    `;

    // Execute the SQL statements
    db.run(createTodosTable);
    db.run(createUserTable);
}

// Initialize the database
db.serialize(() => {
    createTables();
});

// Close the database connection
db.close();

//This file is used to initialise the database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        task TEXT NOT NULL,
        completed BOOLEAN NOT NULL
    )`);
    db.run(`
        ALTER TABLE todos ADD COLUMN created_at TEXT DEFAULT (datetime('now'));
        `);
});

db.close();

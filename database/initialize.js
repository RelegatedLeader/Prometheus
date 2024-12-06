const sqlite3 = require('sqlite3').verbose();

// Create a database connection for the main application
const mainDb = new sqlite3.Database('./database/prometheus.db', (err) => {
    if (err) {
        console.error("Error opening main database:", err.message);
    } else {
        console.log("Connected to the main SQLite database.");
    }
});

// Define schema for main database
mainDb.serialize(() => {
    // Create users table
    mainDb.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hash TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Create messages table
    mainDb.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_hash TEXT NOT NULL,
            receiver_hash TEXT NOT NULL,
            message TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (sender_hash) REFERENCES users (hash),
            FOREIGN KEY (receiver_hash) REFERENCES users (hash)
        );
    `);

    console.log("Main database tables created successfully.");
});

mainDb.close((err) => {
    if (err) {
        console.error("Error closing main database:", err.message);
    } else {
        console.log("Main database connection closed.");
    }
});

// Create a database connection for notes
const notesDb = new sqlite3.Database('./database/notes.db', (err) => {
    if (err) {
        console.error("Error opening notes database:", err.message);
    } else {
        console.log("Connected to the Notes SQLite database.");
    }
});

// Define schema for notes database
notesDb.serialize(() => {
    // Create notes table
    notesDb.run(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_hash TEXT NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Create todos table
    notesDb.run(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_hash TEXT NOT NULL,
            task TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0,
            verification TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_hash) REFERENCES users (hash)
        );
    `);

    // Create journals table
    notesDb.run(`
        CREATE TABLE IF NOT EXISTS journals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_hash TEXT NOT NULL,
            text_entry TEXT,
            voice_entry TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_hash) REFERENCES users (hash)
        );
    `);

    console.log("Notes database tables created successfully.");
});

notesDb.close((err) => {
    if (err) {
        console.error("Error closing notes database:", err.message);
    } else {
        console.log("Notes database connection closed.");
    }
});

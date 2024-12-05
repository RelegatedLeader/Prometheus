const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/prometheus.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

db.serialize(() => {
    // Fetch all users
    console.log("Users Table:");
    db.all("SELECT * FROM users;", [], (err, rows) => {
        if (err) {
            console.error("Error fetching users:", err.message);
        } else {
            console.log(rows);
        }
    });

    // Fetch all messages
    console.log("Messages Table:");
    db.all("SELECT * FROM messages;", [], (err, rows) => {
        if (err) {
            console.error("Error fetching messages:", err.message);
        } else {
            console.log(rows);
        }
    });
});

db.close((err) => {
    if (err) {
        console.error("Error closing database:", err.message);
    } else {
        console.log("Database connection closed.");
    }
});

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/prometheus.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

db.serialize(() => {
    // Insert test users
    const users = [
        { hash: "user1hash" },
        { hash: "user2hash" },
    ];

    users.forEach(user => {
        db.run(`
            INSERT INTO users (hash) VALUES (?);
        `, [user.hash], (err) => {
            if (err) {
                console.error("Error inserting user:", err.message);
            }
        });
    });

    // Insert test messages
    const messages = [
        {
            sender_hash: "user1hash",
            receiver_hash: "user2hash",
            message: "Hello from user1!",
            expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes later
        },
        {
            sender_hash: "user2hash",
            receiver_hash: "user1hash",
            message: "Hi user1, this is user2!",
            expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        }
    ];

    messages.forEach(msg => {
        db.run(`
            INSERT INTO messages (sender_hash, receiver_hash, message, expires_at)
            VALUES (?, ?, ?, ?);
        `, [msg.sender_hash, msg.receiver_hash, msg.message, msg.expires_at], (err) => {
            if (err) {
                console.error("Error inserting message:", err.message);
            }
        });
    });

    console.log("Test data inserted successfully.");
});

db.close((err) => {
    if (err) {
        console.error("Error closing database:", err.message);
    } else {
        console.log("Database connection closed.");
    }
});

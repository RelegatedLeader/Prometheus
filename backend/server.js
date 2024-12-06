const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Main database connection
const mainDb = new sqlite3.Database('./database/prometheus.db', (err) => {
    if (err) {
        console.error("Error connecting to main database:", err.message);
    } else {
        console.log("Connected to the main SQLite database.");
    }
});

// Notes database connection
const notesDb = new sqlite3.Database('./database/notes.db', (err) => {
    if (err) {
        console.error("Error connecting to notes database:", err.message);
    } else {
        console.log("Connected to the Notes SQLite database.");
    }
});

// Main Routes (Users and Messages)

// Retrieve all users
app.get('/users', (req, res) => {
    mainDb.all("SELECT * FROM users;", [], (err, rows) => {
        if (err) {
            console.error("Error retrieving users:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Retrieve all messages for a user
app.get('/messages/:hash', (req, res) => {
    const { hash } = req.params;
    mainDb.all(
        "SELECT * FROM messages WHERE receiver_hash = ?;",
        [hash],
        (err, rows) => {
            if (err) {
                console.error("Error retrieving messages:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        }
    );
});

// Send a new message
app.post('/messages', (req, res) => {
    const { sender_hash, receiver_hash, message } = req.body;
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    mainDb.run(
        `INSERT INTO messages (sender_hash, receiver_hash, message, expires_at)
         VALUES (?, ?, ?, ?);`,
        [sender_hash, receiver_hash, message, expires_at],
        function (err) {
            if (err) {
                console.error("Error sending message:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, sender_hash, receiver_hash, message, expires_at });
            }
        }
    );
});

// Notes Routes

// Retrieve all notes for a user
app.get('/notes/:hash', (req, res) => {
    const { hash } = req.params;
    notesDb.all(
        "SELECT * FROM notes WHERE user_hash = ?;",
        [hash],
        (err, rows) => {
            if (err) {
                console.error("Error retrieving notes:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        }
    );
});

// Create a new note
app.post('/notes', (req, res) => {
    const { user_hash, title, body } = req.body;
    notesDb.run(
        `INSERT INTO notes (user_hash, title, body)
         VALUES (?, ?, ?);`,
        [user_hash, title, body],
        function (err) {
            if (err) {
                console.error("Error creating note:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, user_hash, title, body });
            }
        }
    );
});

// Edit a note
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;

    notesDb.run(
        `UPDATE notes SET title = ?, body = ? WHERE id = ?;`,
        [title, body, id],
        function (err) {
            if (err) {
                console.error("Error updating note:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ updatedID: id, title, body });
            }
        }
    );
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;

    notesDb.run(
        "DELETE FROM notes WHERE id = ?;",
        [id],
        function (err) {
            if (err) {
                console.error("Error deleting note:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ deletedID: id });
            }
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Close databases on exit
process.on('SIGINT', () => {
    mainDb.close((err) => {
        if (err) {
            console.error("Error closing main database:", err.message);
        } else {
            console.log("Main database connection closed.");
        }
    });
    notesDb.close((err) => {
        if (err) {
            console.error("Error closing notes database:", err.message);
        } else {
            console.log("Notes database connection closed.");
        }
        process.exit();
    });
});

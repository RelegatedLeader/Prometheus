const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); // Required to create server for Socket.IO
const { Server } = require('socket.io'); // Import Socket.IO

const app = express();
const server = http.createServer(app); // Create server instance for Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for development purposes
        methods: ['GET', 'POST', 'DELETE'],
    },
});

const PORT = process.env.PORT || 3001; // Support for Render's dynamic port assignment

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const dbPath = process.env.DATABASE_PATH || './database/prometheus.db'; // Support for env variable
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Routes

// 1. Get all users
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users;", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// 2. Get all messages for a specific user
app.get('/messages/:hash', (req, res) => {
    const { hash } = req.params;
    db.all(
        "SELECT * FROM messages WHERE receiver_hash = ?;",
        [hash],
        (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json(rows);
        }
    );
});

// 3. Send a message
app.post('/messages', (req, res) => {
    const { sender_hash, receiver_hash, message } = req.body;
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes from now

    db.run(
        `INSERT INTO messages (sender_hash, receiver_hash, message, expires_at)
         VALUES (?, ?, ?, ?);`,
        [sender_hash, receiver_hash, message, expires_at],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, sender_hash, receiver_hash, message, expires_at });
        }
    );
});

// 4. Delete a message
app.delete('/messages/:id', (req, res) => {
    const { id } = req.params;
    db.run(
        "DELETE FROM messages WHERE id = ?;",
        [id],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ deletedID: id });
        }
    );
});

// 5. Fetch contacts (users who have sent messages to the current user)
app.get('/contacts/:hash', (req, res) => {
    const { hash } = req.params;
    db.all(
        `SELECT DISTINCT sender_hash FROM messages WHERE receiver_hash = ?;`,
        [hash],
        (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json(rows.map(row => row.sender_hash));
        }
    );
});

// 6. Fetch live messages for a specific user pair
app.get('/live-messages/:sender_hash/:receiver_hash', (req, res) => {
    const { sender_hash, receiver_hash } = req.params;
    db.all(
        `SELECT * FROM live_messages
         WHERE (sender_hash = ? AND receiver_hash = ?)
         OR (sender_hash = ? AND receiver_hash = ?)
         ORDER BY sent_at ASC;`,
        [sender_hash, receiver_hash, receiver_hash, sender_hash],
        (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json(rows);
        }
    );
});

// 7. Send a live message
app.post('/live-messages', (req, res) => {
    const { sender_hash, receiver_hash, message, message_type } = req.body;
    const sent_at = new Date().toISOString();

    db.run(
        `INSERT INTO live_messages (sender_hash, receiver_hash, message, message_type, sent_at)
         VALUES (?, ?, ?, ?, ?);`,
        [sender_hash, receiver_hash, message, message_type || 'text', sent_at],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else {
                const newMessage = {
                    id: this.lastID,
                    sender_hash,
                    receiver_hash,
                    message,
                    sent_at,
                    message_type: message_type || 'text',
                };

                // Emit the message to connected users in real-time
                io.emit('receiveMessage', newMessage);

                res.json(newMessage);
            }
        }
    );
});

// Auto-delete only live messages older than 20 minutes
setInterval(() => {
    db.run(
        `DELETE FROM live_messages WHERE sent_at <= DATETIME('now', '-20 minutes');`,
        [],
        (err) => {
            if (err) console.error("Error deleting old live messages:", err.message);
            else console.log("Old live messages deleted successfully.");
        }
    );
}, 5 * 60 * 1000); // Run every 5 minutes

// Socket.IO Real-Time Communication
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Listen for sendMessage events from clients
    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data); // Broadcast the message to all connected clients
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Close database on exit
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error("Error closing database:", err.message);
        else console.log("Database connection closed.");
        process.exit();
    });
});

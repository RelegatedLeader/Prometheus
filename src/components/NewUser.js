import React, { useState } from 'react';
import '../../src/App.css';

function NewUser() {
  const [contactHash, setContactHash] = useState('');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!contactHash.trim() || !message.trim()) {
      alert('Please fill in both the contact hash and the message.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_hash: crypto.randomUUID(), // Generate a unique hash for the sender
          receiver_hash: contactHash.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Message sent! Your unique hash: ${data.sender_hash}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="NewUser">
      <h1>Welcome, New User!</h1>
      <p>You are now recognized as a new user.</p>
      <br />
      <label htmlFor="contact_hash">Enter your contact's unique Hash:</label>
      <input
        type="text"
        name="contact_hash"
        id="contact_hash"
        value={contactHash}
        onChange={(e) => setContactHash(e.target.value)}
      />
      <br />
      <label htmlFor="message">Enter a message:</label>
      <br />
      <textarea
        name="message"
        id="message"
        rows="4"
        cols="50"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default NewUser;

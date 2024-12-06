import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientHash, setRecipientHash] = useState('');
  const navigate = useNavigate();
  const userHash = new URLSearchParams(window.location.search).get('hash');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/messages/${userHash}`);
        const data = await response.json();
        if (response.ok) setMessages(data);
        else console.error('Error fetching messages:', data.error);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    const fetchContacts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/contacts/${userHash}`);
        const data = await response.json();
        if (response.ok) setContacts(data);
        else console.error('Error fetching contacts:', data.error);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchMessages();
    fetchContacts();
  }, [userHash]);

  const handleSendMessage = async () => {
    if (!recipientHash.trim() || !newMessage.trim()) {
      alert('Please enter both a recipient hash and a message.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_hash: userHash,
          receiver_hash: recipientHash.trim(),
          message: newMessage.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Message sent successfully!');
        setNewMessage('');
        setRecipientHash('');
        setContacts((prev) => [...prev, recipientHash.trim()]); // Add recipient to contacts
      } else {
        console.error('Error sending message:', data.error);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="Messages">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Your Messages</h1>
        <div>
          <button onClick={() => navigate(`/live-messaging?hash=${userHash}`)}>Live Messaging</button>
          <button onClick={() => navigate('/settings')}>Settings</button>
          <button onClick={() => navigate('/notes')}>Notes</button>
        </div>
      </header>

      <section>
        <h2>Quick Messages</h2>
        {messages.length > 0 ? (
          <ul>
            {messages.map((msg) => (
              <li key={msg.id}>
                <p><strong>From:</strong> {msg.sender_hash}</p>
                <p><strong>Message:</strong> {msg.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No quick messages available.</p>
        )}
      </section>

      <section>
        <h2>Send a Message</h2>
        <div>
          <label htmlFor="recipient-hash">Recipient's Hash:</label>
          <input
            id="recipient-hash"
            type="text"
            value={recipientHash}
            onChange={(e) => setRecipientHash(e.target.value)}
            placeholder="Enter recipient's unique hash"
          />
        </div>
        <div>
          <label htmlFor="new-message">Message:</label>
          <textarea
            id="new-message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
          />
        </div>
        <button onClick={handleSendMessage}>Send Message</button>
      </section>
    </div>
  );
}

export default Messages;

import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client'; // Import Socket.IO for real-time messaging

// Initialize Socket.IO client and connect to the backend
const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001');

function LiveMessaging() {
  const [contacts, setContacts] = useState([]); // List of contacts
  const [selectedContact, setSelectedContact] = useState(''); // Currently selected contact
  const [chat, setChat] = useState([]); // Chat messages
  const [message, setMessage] = useState(''); // Message input
  const [colors, setColors] = useState({}); // Random colors for each user
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(false); // Auto-delete toggle

  const userHash = new URLSearchParams(window.location.search).get('hash'); // Extract user hash from URL

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/contacts/${userHash}`);
        const data = await response.json();
        if (response.ok) {
          setContacts(data);
          setColors(
            data.reduce((acc, contact) => {
              acc[contact] = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
              return acc;
            }, {})
          );
        } else {
          console.error('Error fetching contacts:', data.error);
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchContacts();
  }, [userHash]);

  // Fetch live messages for the selected contact
  const fetchLiveMessages = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/live-messages/${userHash}/${selectedContact}`
      );
      const data = await response.json();
      if (response.ok) {
        setChat(data);
      } else {
        console.error('Error fetching live messages:', data.error);
      }
    } catch (err) {
      console.error('Error fetching live messages:', err);
    }
  }, [userHash, selectedContact]);

  // Listen for real-time updates and join a room when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      fetchLiveMessages();
      socket.emit('joinRoom', { userHash, contact: selectedContact });

      // Listen for real-time updates
      socket.on('receiveMessage', (newMessage) => {
        // Avoid duplicates by checking message ID
        setChat((prevChat) => {
          if (!prevChat.find((msg) => msg.id === newMessage.id)) {
            return [...prevChat, newMessage];
          }
          return prevChat;
        });
      });
    }

    // Cleanup socket listener
    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedContact, fetchLiveMessages]);

  // Handle sending a text message
  const handleSendMessage = async () => {
    if (!selectedContact || !message.trim()) {
      alert('Please select a contact and type a message.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_hash: userHash,
          receiver_hash: selectedContact,
          message,
          message_type: 'text',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Emit message to server for real-time updates
        socket.emit('sendMessage', data);
        setMessage(''); // Clear message input
      } else {
        console.error('Error sending message:', data.error);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedContact) {
      alert('Please select a contact and choose a valid image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('sender_hash', userHash);
    formData.append('receiver_hash', selectedContact);
    formData.append('message_type', 'image');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live-messages`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        socket.emit('sendMessage', data); // Emit image message
      }
    } catch (err) {
      console.error('Error sending image:', err);
    }
  };

  return (
    <div className="LiveMessaging">
      <header>
        <h1>Live Messaging</h1>
        <select onChange={(e) => setSelectedContact(e.target.value)} value={selectedContact}>
          <option value="">Select Contact</option>
          {contacts.map((contact) => (
            <option key={contact} value={contact}>
              {contact}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={autoDeleteEnabled}
            onChange={(e) => setAutoDeleteEnabled(e.target.checked)}
          />
          Auto-Delete Messages
        </label>
      </header>

      <section className="chat-window">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.sender_hash === userHash ? 'message-sent' : 'message-received'}
            style={{
              backgroundColor: colors[msg.sender_hash] || '#f1f1f1',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {msg.message_type === 'text' && <p>{msg.message}</p>}
            {msg.message_type === 'image' && (
              <img
                src={msg.message}
                alt="Sent media"
                style={{ maxWidth: '200px', maxHeight: '200px', cursor: 'pointer' }}
                onClick={() => window.open(msg.message, '_blank')} // Open image in new tab for zooming
              />
            )}
          </div>
        ))}
      </section>

      <section className="chat-input">
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
        <div>
          <input type="file" accept="image/*" onChange={handleSendImage} />
        </div>
      </section>
    </div>
  );
}

export default LiveMessaging;

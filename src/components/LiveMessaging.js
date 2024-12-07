import React, { useState, useEffect, useCallback } from 'react';

function LiveMessaging() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [colors, setColors] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const userHash = new URLSearchParams(window.location.search).get('hash');

  // Fetch contacts
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

  // Fetch live messages
  const fetchLiveMessages = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/live-messages/${userHash}/${selectedContact}`
      );
      const data = await response.json();
      if (response.ok) setChat(data);
      else console.error('Error fetching live messages:', data.error);
    } catch (err) {
      console.error('Error fetching live messages:', err);
    }
  }, [userHash, selectedContact]);

  useEffect(() => {
    if (selectedContact) fetchLiveMessages();

    const autoDelete = setTimeout(() => setChat([]), 20 * 60 * 1000);
    return () => clearTimeout(autoDelete);
  }, [selectedContact, fetchLiveMessages]);

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
        setChat((prevChat) => [...prevChat, data]);
        setMessage('');
      } else console.error('Error sending message:', data.error);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedContact) {
      alert('Please select a contact and choose a valid image.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_hash: userHash,
          receiver_hash: selectedContact,
          message: imageUrl,
          message_type: 'image',
        }),
      });

      const data = await response.json();
      if (response.ok) setChat((prevChat) => [...prevChat, data]);
    } catch (err) {
      console.error('Error sending image:', err);
    }
  };

  const handleStartRecording = async () => {
    if (!selectedContact) {
      alert('Please select a contact before recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);

        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live-messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sender_hash: userHash,
              receiver_hash: selectedContact,
              message: audioUrl,
              message_type: 'voice',
            }),
          });

          const data = await response.json();
          if (response.ok) setChat((prevChat) => [...prevChat, data]);
        } catch (err) {
          console.error('Error sending voice message:', err);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
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
      </header>

      <section className="chat-window">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.sender_hash === userHash ? 'message-sent' : 'message-received'}
            style={{ backgroundColor: colors[msg.sender_hash] || '#f1f1f1' }}
          >
            {msg.message_type === 'text' && <p>{msg.message}</p>}
            {msg.message_type === 'image' && <img src={msg.message} alt="Sent media" />}
            {msg.message_type === 'voice' && (
              <audio controls>
                <source src={msg.message} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
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
          {!isRecording ? (
            <button onClick={handleStartRecording}>Start Recording</button>
          ) : (
            <button onClick={handleStopRecording}>Stop Recording</button>
          )}
        </div>
      </section>
    </div>
  );
}

export default LiveMessaging;

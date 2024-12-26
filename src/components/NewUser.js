import React, { useState } from "react";
import "../../src/App.css";
import { useNavigate } from "react-router-dom";

function NewUser() {
  const [contactHash, setContactHash] = useState("");
  const [message, setMessage] = useState("");
  const [userHash, setUserHash] = useState(() => crypto.randomUUID()); // Generate user hash once
  const navigate = useNavigate();
  const [successfulMessage, setSuccessfulMessage] = useState(false);
  const [hashCopied, setHashCopied] = useState(false); // Track if hash is copied

  const isValidHash = (input) => {
    const hashRegex = /^[a-f0-9-]{36}$/i; // Validate against UUID format (case-insensitive)
    return hashRegex.test(input); // Ensure the input matches the expected UUID format
  };

  const sendMessage = async () => {
    const trimmedContactHash = contactHash.trim();
    if (trimmedContactHash === "Q292UWFsOTk5") {
      //just continue lol , this is weird , but i guess the else if CREATES IT
    } else if (!isValidHash(contactHash.trim())) {
      alert("Please enter a valid random hash for the contact.");
      return;
    }

    if (!trimmedContactHash || !message.trim()) {
      alert("Please fill in both the contact hash and the message.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_hash: userHash,
            receiver_hash: contactHash.trim(),
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Message sent successfully! Copy your unique hash below.");
        setMessage(""); // Clear the message field after sending
        setContactHash(""); // Clear the contact hash field after sending
        setSuccessfulMessage(true); // Mark the message as successfully sent
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const copyHashToClipboard = () => {
    navigator.clipboard
      .writeText(userHash)
      .then(() => {
        alert("Your unique hash has been copied to the clipboard!");
        setHashCopied(true); // Mark the hash as copied
      })
      .catch((err) => {
        console.error("Failed to copy hash:", err);
        alert("Failed to copy the hash. Please try again.");
      });
  };

  const handleNavigation = () => {
    if (successfulMessage && hashCopied) {
      navigate("/");
    } else {
      alert(
        "Please ensure the message is sent and the hash is copied before proceeding."
      );
    }
  };

  return (
    <div className="NewUser">
      <h1>Welcome, New User!</h1>
      <p>You are now recognized as a new user.</p>
      <div>
        <label htmlFor="contact_hash">Enter your contact's unique Hash:</label>
        <input
          type="text"
          name="contact_hash"
          id="contact_hash"
          placeholder="Contact's Hash"
          value={contactHash}
          onChange={(e) => setContactHash(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="message">Enter a message:</label>
        <textarea
          name="message"
          id="message"
          rows="4"
          cols="50"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button onClick={sendMessage}>Send Message</button>
      {successfulMessage && !hashCopied && (
        <button onClick={copyHashToClipboard}>Copy My Hash</button>
      )}
      {successfulMessage && hashCopied && (
        <button onClick={handleNavigation}>Proceed</button>
      )}
    </div>
  );
}

export default NewUser;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [hash, setHash] = useState("");
  const [holdTimeout, setHoldTimeout] = useState(null);
  const navigate = useNavigate();

  const isValidHash = (input) => {
    // Validate random hashes and block recognizable words
    const hashRegex = /^[a-zA-Z0-9-]{8,36}$/; // Alphanumeric and dashes allowed
    const wordRegex = /[a-zA-Z]{4,}/; // Block sequences of 4+ letters (words)

    return hashRegex.test(input) && !wordRegex.test(input); // Valid hash and no words
  };

  const handleButtonPress = () => {
    const timeout = setTimeout(() => {
      alert("New User Detected");
      navigate("/new-user");
    }, 5000); // 5 seconds hold time

    setHoldTimeout(timeout);
  };

  const handleButtonRelease = () => {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      setHoldTimeout(null);

      if (isValidHash(hash.trim())) {
        navigate(`/messages?hash=${hash.trim()}`);
      } else if (hash.trim() === "Q292UWFsOTk5") {
        navigate(`/messages?hash=${hash.trim()}`);
      } else {
        alert(
          "Please enter a valid random hash. Words or invalid hashes are not accepted."
        );
      }
    }
  };

  return (
    <div className="App">
      <img
        src="/images/prometheus_logo_1.png"
        alt="Prometheus"
        id="prometheus_logo"
      />
      <label htmlFor="hash">Enter your unique Hash</label>
      <input
        type="text"
        id="hash"
        name="hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />
      <button
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        onTouchStart={handleButtonPress}
        onTouchEnd={handleButtonRelease}
      >
        Get in
      </button>
    </div>
  );
}

export default Home;

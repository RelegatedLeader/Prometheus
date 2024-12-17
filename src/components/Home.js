import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [hash, setHash] = useState('');
  const [holdTimeout, setHoldTimeout] = useState(null);
  const navigate = useNavigate();

  const handleButtonPress = () => {
    const timeout = setTimeout(() => {
      alert('New User Detected');
      navigate('/new-user');
    }, 5000); // 5 seconds hold time

    setHoldTimeout(timeout);
  };

  const handleButtonRelease = () => {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      setHoldTimeout(null);

      if (hash.trim()) { //makes sure that the hash is not empty before navigating to the messages page
        navigate(`/messages?hash=${hash.trim()}`); //the ? is for the string query 
      } else {
        alert('Please enter your unique hash');
      }
    }
  };

  return (
    <div className="App">
      <img src="/images/prometheus_logo_1.png" alt="Prometheus" id="prometheus_logo" />
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

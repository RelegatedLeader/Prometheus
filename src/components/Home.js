import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [hash, setHash] = useState('');
  const [lastClickTime, setLastClickTime] = useState(0);
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastClickTime;

    if (timeDifference < 500) {
      alert('New User Detected');
      navigate('/new-user');
    } else if (hash.trim()) {
      // Proceed if hash exists
      navigate(`/messages?hash=${hash.trim()}`);
    } 

    setLastClickTime(currentTime);
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
      <button onClick={handleDoubleClick}>Get in</button>
    </div>
  );
}

export default Home;

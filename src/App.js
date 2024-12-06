import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import NewUser from './components/NewUser';
import Messages from './components/Messages';
import LiveMessaging from './components/LiveMessaging';
import Settings from './components/Settings';
import Notes from './components/Notes'; // Import the Notes component

function App() {
  const userHash = new URLSearchParams(window.location.search).get('hash'); // Retrieve userHash

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-user" element={<NewUser />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/live-messaging" element={<LiveMessaging />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notes" element={<Notes userHash={userHash} />} /> {/* Pass userHash */}
      </Routes>
    </Router>
  );
}

export default App;

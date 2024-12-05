import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import NewUser from './components/NewUser';
import Messages from './components/Messages';
import LiveMessaging from './components/LiveMessaging'; // Import LiveMessaging component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-user" element={<NewUser />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/live-messaging" element={<LiveMessaging />} /> {/* Add route for LiveMessaging */}
      </Routes>
    </Router>
  );
}

export default App;

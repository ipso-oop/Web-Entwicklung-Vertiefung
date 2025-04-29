import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import ContactDetails from './components/ContactDetails';
import MessageCounter from './components/MessageCounter';

function App() {
  const [messageCount, setMessageCount] = useState(0);

  const incrementMessageCount = () => {
    setMessageCount(prevCount => prevCount + 1);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">Contacts Manager</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/contacts/new">New Contact</Link>
            </div>
            <MessageCounter count={messageCount} />
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<ContactList onMessageSent={incrementMessageCount} />} />
            <Route path="/contacts/new" element={<ContactForm onMessageSent={incrementMessageCount} />} />
            <Route path="/contacts/:id" element={<ContactDetails onMessageSent={incrementMessageCount} />} />
            <Route path="/contacts/:id/edit" element={<ContactForm onMessageSent={incrementMessageCount} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 
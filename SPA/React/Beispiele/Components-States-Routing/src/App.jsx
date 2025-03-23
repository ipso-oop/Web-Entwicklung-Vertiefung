import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactList from "./components/ContactList.jsx";
import AddContact from "./components/AddContacts.jsx";

function App() {
    const [contacts, setContacts] = useState([
        { id: 1, firstName: "Max", lastName: "Mustermann", email: "max@example.com" },
        { id: 2, firstName: "Erika", lastName: "Mustermann", email: "erika@example.com" },
    ]);

    const addContact = (contact) => {
        setContacts([...contacts, contact]);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ContactList contacts={contacts} />} />
                <Route path="/add" element={<AddContact addContact={addContact} />} />
            </Routes>
        </Router>
    );
}

export default App

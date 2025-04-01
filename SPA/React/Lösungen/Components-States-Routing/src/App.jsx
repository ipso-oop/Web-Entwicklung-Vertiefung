import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactList from "./components/ContactList.jsx";
import AddContact from "./components/AddContacts.jsx";
import EditContact from "./components/EditContact.jsx";

function App() {
    const [contacts, setContacts] = useState([
        { id: 1, firstName: "Max", lastName: "Mustermann", email: "max@example.com" },
        { id: 2, firstName: "Erika", lastName: "Mustermann", email: "erika@example.com" },
    ]);

    // Kontakt hinzufügen
    const addContact = (contact) => {
        setContacts([...contacts, contact]);
    };

    // Kontakt löschen
    const deleteContact = (id) => {
        setContacts(contacts.filter((contact) => contact.id !== id));
    };

    // Kontakt bearbeiten
    const editContact = (updatedContact) => {
        setContacts(
            contacts.map((contact) =>
                contact.id === updatedContact.id ? updatedContact : contact
            )
        );
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ContactList contacts={contacts} deleteContact={deleteContact} />} />
                <Route path="/add" element={<AddContact addContact={addContact} />} />
                <Route path="/edit/:id" element={<EditContact contacts={contacts} editContact={editContact} />} />
            </Routes>
        </Router>
    );
}

export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactListCss from "./components/ContactListCss.jsx";
import ContactListModules from "./components/ContactListModules.jsx";
import ContactListStyled from "./components/ContactListStyled.jsx";
import ContactListInline from "./components/ContactListInline.jsx";
import AddContact from "./components/AddContacts.jsx";
import Navigation from "./components/Navigation.jsx";

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
            <Navigation />
            <Routes>
                <Route path="/" element={<ContactListCss contacts={contacts} />} />
                <Route path="/css" element={<ContactListCss contacts={contacts} />} />
                <Route path="/modules" element={<ContactListModules contacts={contacts} />} />
                <Route path="/styled" element={<ContactListStyled contacts={contacts} />} />
                <Route path="/inline" element={<ContactListInline contacts={contacts} />} />
                <Route path="/add" element={<AddContact addContact={addContact} />} />
            </Routes>
        </Router>
    );
}

export default App

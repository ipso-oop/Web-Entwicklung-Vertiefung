import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactList from "./components/ContactList.jsx";
import AddContact from "./components/AddContacts.jsx";
import EditContact from "./components/EditContact.jsx";
import { ContactProvider } from "./components/ContactContext.jsx";

function App() {
    return (
        <ContactProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ContactList />} />
                    <Route path="/add" element={<AddContact />} />
                    <Route path="/edit/:id" element={<EditContact />} />
                </Routes>
            </Router>
        </ContactProvider>
    );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ContactList from "./components/ContactList.jsx";
import AddContact from "./components/AddContacts.jsx";
import EditContact from "./components/EditContact.jsx";
import Detail from "./components/Detail.jsx";
import { ContactProvider } from "./components/ContactContext.jsx";

function App() {
    return (
        <ContactProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ContactList />} />
                    <Route path="/add" element={<AddContact />} />
                    <Route path="/edit/:id" element={<EditContact />} />
                    <Route path="/details/:id" element={<Detail />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </ContactProvider>
    );
}

export default App;

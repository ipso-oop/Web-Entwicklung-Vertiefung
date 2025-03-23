import React from "react";
import { Link } from "react-router-dom";
import './ContactList.css';

function ContactListCss({ contacts }) {
    return (
        <div className="contact-list-container">
            <h2 className="contact-list-header">Contact List (CSS)</h2>
            <table className="contact-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>E-Mail</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.firstName}</td>
                            <td>{contact.lastName}</td>
                            <td>{contact.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/add" className="add-contact-link">Add new contact</Link>
        </div>
    );
}

export default ContactListCss; 
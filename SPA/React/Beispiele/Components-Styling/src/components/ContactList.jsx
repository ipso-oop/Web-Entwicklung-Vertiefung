import React from "react";
import { Link } from "react-router-dom";
import './ContactList.css';

function ContactList({ contacts }) {

    return (
        <div className="contact-list-container">
            <h2 className="contact-list-header">Contact List</h2>
            
            {/* Regular CSS Table */}
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

            <div className="styling-links">
                <h3>Styling Beispiele:</h3>
                <ul>
                    <li><Link to="/styling/inline">Inline Styling</Link></li>
                    <li><Link to="/styling/css">CSS-Dateien</Link></li>
                    <li><Link to="/styling/modules">CSS Modules</Link></li>
                    <li><Link to="/styling/styled">Styled Components</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default ContactList;

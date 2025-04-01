import React from "react";
import { Link } from "react-router-dom";

function ContactList({ contacts, deleteContact }) {
    return (
        <div className="table-container">
            <h2>Kontaktliste</h2>
            <table className="contact-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>E-Mail</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.firstName}</td>
                            <td>{contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td className="action-buttons">
                                <button onClick={() => deleteContact(contact.id)}>Delete</button>
                                <Link to={`/edit/${contact.id}`}>
                                    <button>Edit</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/add" className="add-contact-link">Add new contact</Link>
        </div>
    );
}

export default ContactList;

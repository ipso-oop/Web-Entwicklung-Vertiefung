import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ContactContext } from "./ContactContext";

function ContactList() {
    const { contacts, deleteContact } = useContext(ContactContext);

    return (
        <div>
            <h2>Contact List</h2>
            <table border="1">
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
                            <td>
                                <Link to={`/edit/${contact.id}`}>Bearbeiten</Link>
                                <button onClick={() => deleteContact(contact.id)}>Löschen</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/add">Add new contact</Link>
        </div>
    );
}

export default ContactList;

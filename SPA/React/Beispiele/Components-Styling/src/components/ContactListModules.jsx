import React from "react";
import { Link } from "react-router-dom";
import styles from './ContactList.module.css';

function ContactListModules({ contacts }) {
    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Contact List (CSS Modules)</h2>
            <table className={styles.table}>
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
            <Link to="/add" className={styles.addLink}>Add new contact</Link>
        </div>
    );
}

export default ContactListModules; 
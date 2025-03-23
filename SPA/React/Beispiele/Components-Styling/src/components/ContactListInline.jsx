import React from "react";
import { Link } from "react-router-dom";

function ContactListInline({ contacts }) {
    const styles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px'
        },
        header: {
            color: '#2c3e50',
            textDecoration: 'underline',
            marginBottom: '20px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        th: {
            padding: '12px',
            textAlign: 'left',
            border: '1px solid #dee2e6',
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold'
        },
        td: {
            padding: '12px',
            textAlign: 'left',
            border: '1px solid #dee2e6'
        },
        link: {
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Contact List (Inline)</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Vorname</th>
                        <th style={styles.th}>Nachname</th>
                        <th style={styles.th}>E-Mail</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td style={styles.td}>{contact.id}</td>
                            <td style={styles.td}>{contact.firstName}</td>
                            <td style={styles.td}>{contact.lastName}</td>
                            <td style={styles.td}>{contact.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/add" style={styles.link}>Add new contact</Link>
        </div>
    );
}

export default ContactListInline; 
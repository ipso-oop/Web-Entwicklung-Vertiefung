import { createContext, useState } from "react";

export const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
    const [contacts, setContacts] = useState([
        { id: 1, firstName: "Max", lastName: "Mustermann", email: "max@example.com" },
        { id: 2, firstName: "Erika", lastName: "Mustermann", email: "erika@example.com" },
    ]);

    const addContact = (contact) => {
        setContacts([...contacts, contact]);
    };

    const deleteContact = (id) => {
        setContacts(contacts.filter((contact) => contact.id !== id));
    };

    const editContact = (updatedContact) => {
        setContacts(
            contacts.map((contact) =>
                contact.id === updatedContact.id ? updatedContact : contact
            )
        );
    };

    return (
        <ContactContext.Provider value={{ contacts, addContact, deleteContact, editContact }}>
            {children}
        </ContactContext.Provider>
    );
};
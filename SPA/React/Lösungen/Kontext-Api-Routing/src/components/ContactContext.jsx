import { createContext, useState } from "react";

export const ContactContext = createContext(null);

/**
 * ContactProvider component that manages the contact list state and provides methods to manipulate it
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped with the context
 */
export const ContactProvider = ({ children }) => {
    const [contacts, setContacts] = useState([
        { id: 1, firstName: "Max", lastName: "Mustermann", email: "max@example.com" },
        { id: 2, firstName: "Erika", lastName: "Mustermann", email: "erika@example.com" },
    ]);

    /**
     * Adds a new contact to the list
     * @param {Object} contact - The contact object to add
     */
    const addContact = (contact) => {
        setContacts([...contacts, contact]);
    };

    /**
     * Deletes a contact from the list
     * @param {number} id - The ID of the contact to delete
     */
    const deleteContact = (id) => {
        setContacts(contacts.filter((contact) => contact.id !== id));
    };

    /**
     * Updates an existing contact in the list
     * @param {Object} updatedContact - The updated contact object
     */
    const editContact = (updatedContact) => {
        setContacts(
            contacts.map((contact) =>
                contact.id === updatedContact.id ? updatedContact : contact
            )
        );
    };

    /**
     * Retrieves a single contact by ID
     * @param {number} id - The ID of the contact to retrieve
     * @returns {Object|null} The contact object or null if not found
     */
    const detailContact = (id) => {
        return contacts.find((contact) => contact.id === id) || null;
    };

    return (
        <ContactContext.Provider value={{ contacts, addContact, deleteContact, editContact, detailContact }}>
            {children}
        </ContactContext.Provider>
    );
};

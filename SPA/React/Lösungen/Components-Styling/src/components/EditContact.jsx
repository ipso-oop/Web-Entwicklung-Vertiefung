import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditContact({ contacts, editContact }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const contactToEdit = contacts.find((contact) => contact.id === parseInt(id));

    const [firstName, setFirstName] = useState(contactToEdit.firstName);
    const [lastName, setLastName] = useState(contactToEdit.lastName);
    const [email, setEmail] = useState(contactToEdit.email);

    const handleSubmit = (e) => {
        e.preventDefault();
        editContact({ id: contactToEdit.id, firstName, lastName, email });
        navigate("/");
    };

    return (
        <div className="form-container">
            <h2>Edit contact</h2>
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Vorname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Nachname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default EditContact;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddContact({ addContact }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        addContact({ id: Date.now(), firstName, lastName, email });
        navigate("/");
    };

    return (
        <div className="form-container">
            <h2>Add new contact</h2>
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
                <button type="submit">Add</button>
            </form>
        </div>
    );
}

export default AddContact;

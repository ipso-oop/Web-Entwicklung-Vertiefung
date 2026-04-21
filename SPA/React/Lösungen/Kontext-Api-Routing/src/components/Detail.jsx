import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ContactContext } from './ContactContext';

function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { detailContact } = useContext(ContactContext);

    const contact = detailContact(parseInt(id));

    if (!contact) {
        return <p>Kontakt nicht gefunden.</p>;
    }

    return (
        <div>
            <h2>Detailansicht</h2>
            <p><strong>ID:</strong> {contact.id}</p>
            <p><strong>Vorname:</strong> {contact.firstName}</p>
            <p><strong>Nachname:</strong> {contact.lastName}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <button onClick={() => navigate('/')}>Zurück zur Liste</button>
        </div>
    );
}

export default Detail;

import { useNavigate } from "react-router-dom";

function AddContact({ addContact }) {
  const navigate = useNavigate(); // Hook aufrufen

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact({ id: Date.now(), firstName: "Max", lastName: "Mustermann", email: "max@example.com" });
    navigate("/"); // Zur Startseite weiterleiten
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Kontakt speichern</button>
    </form>
  );
}

export default AddContact;
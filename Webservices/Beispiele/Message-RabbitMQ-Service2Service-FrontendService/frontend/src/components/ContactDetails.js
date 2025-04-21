import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/contacts/${id}`);
        // Remove any HATEOAS links or other metadata if present
        const { _links, ...contactData } = response.data;
        setContact(contactData);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError('Error fetching contact details');
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`${API_BASE_URL}/contacts/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!contact) return <div className="alert alert-warning">Contact not found</div>;

  return (
    <div className="card">
      <div className="card-body">
        <h2>Contact Details</h2>
        <div className="mb-3">
          <h4>{contact.firstName} {contact.lastName}</h4>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone || 'N/A'}</p>
        </div>
        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/contacts/${id}/edit`)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger ms-2"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/')}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactDetails; 
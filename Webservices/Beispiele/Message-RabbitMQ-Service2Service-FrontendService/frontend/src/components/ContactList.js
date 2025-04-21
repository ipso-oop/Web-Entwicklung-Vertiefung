import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/contacts`);
        console.log('API Response:', response.data); // Debug log
        // The response has a data property containing the contacts array
        setContacts(response.data.data || []);
        setPagination(response.data.pagination);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError('Error fetching contacts');
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Contacts</h2>
      {contacts.length === 0 ? (
        <div className="alert alert-info">No contacts found. Add a new contact to get started!</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id}>
                  <td>{contact.firstName} {contact.lastName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>
                    <Link to={`/contacts/${contact.id}`} className="btn btn-info btn-sm me-2">
                      View
                    </Link>
                    <Link to={`/contacts/${contact.id}/edit`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Total contacts: {pagination.total}
              </div>
              <div>
                Page {pagination.page} of {pagination.pages}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="mt-3">
        <Link to="/contacts/new" className="btn btn-primary">
          Add New Contact
        </Link>
      </div>
    </div>
  );
}

export default ContactList; 
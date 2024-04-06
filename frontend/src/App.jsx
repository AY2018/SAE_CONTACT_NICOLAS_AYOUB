import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ContactForm from './ContactForm';
import ContactsList from './ContactsList';
import ContactDetail from './ContactDetail';
import Login from './Login';

function App() {
  const [contacts, setContacts] = useState([]);
  const BASE_URL_API = 'http://localhost/SAE_contactAPP/backend/public/index.php';

  const userId = sessionStorage.getItem('user_id');

  // Fetch contacts from the API based on user ID
  useEffect(() => {
    if (userId) {
      fetch(`${BASE_URL_API}/contacts/${userId}`)
        .then((response) => response.json())
        .then((data) => setContacts(data))
        .catch((error) => console.error('Error fetching contacts:', error));
    }
  }, [userId]);

  // Function to add or update a contact
  const addOrUpdateContact = (contact) => {
    const method = contact.id ? 'PUT' : 'POST';
    const path = contact.id ? `/contacts/${contact.id}/edit` : '/contacts/new';
    fetch(`${BASE_URL_API}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
      .then(() => {
        // Re-fetch contacts to update UI
        if (userId) {
          fetch(`${BASE_URL_API}/contacts/${userId}`)
            .then((response) => response.json())
            .then((data) => setContacts(data))
            .catch((error) => console.error('Error re-fetching contacts:', error));
        }
      })
      .catch((error) => console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} contact:`, error));
  };

  // Function to delete a contact
  const deleteContact = (id) => {
    fetch(`${BASE_URL_API}/contacts/${id}/delete`, {
      method: 'DELETE',
    })
      .then(() => {
        // Re-fetch contacts to update UI
        if (userId) {
          fetch(`${BASE_URL_API}/contacts/${userId}`)
            .then((response) => response.json())
            .then((data) => setContacts(data))
            .catch((error) => console.error('Error re-fetching contacts:', error));
        }
      })
      .catch((error) => console.error('Error deleting contact:', error));
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const userId = sessionStorage.getItem('user_id');
    const userEmail = sessionStorage.getItem('user_email');
    const userRoles = sessionStorage.getItem('user_roles');

    return userId && userEmail && userRoles;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <ContactsList contacts={contacts} BASE_URL_API={BASE_URL_API} userId={userId} /> : <Navigate to="/log" />}
        />
        <Route
          path="/add"
          element={isAuthenticated() ? <ContactForm BASE_URL_API={BASE_URL_API} onSubmit={addOrUpdateContact} /> : <Navigate to="/log" />}
        />
        <Route
          path="/edit/:id"
          element={isAuthenticated() ? <ContactForm BASE_URL_API={BASE_URL_API} onSubmit={addOrUpdateContact} contacts={contacts} /> : <Navigate to="/log" />}
        />
        <Route
          path="/contact/:id"
          element={isAuthenticated() ? <ContactDetail contacts={contacts} onDelete={deleteContact} BASE_URL_API={BASE_URL_API} /> : <Navigate to="/log" />}
        />
        <Route
          path="/log"
          element={!isAuthenticated() ? <Login BASE_URL_API={BASE_URL_API} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

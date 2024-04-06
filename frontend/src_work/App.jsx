import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactForm from './ContactForm';
import ContactsList from './ContactsList';
import ContactDetail from './ContactDetail';

function App() {
  const [contacts, setContacts] = useState(() => {
    const localData = localStorage.getItem('contacts');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addOrUpdateContact = (contact) => {
    if (contact.id) {
      // Update existing contact
      const updatedContacts = contacts.map((c) =>
        c.id === contact.id ? contact : c
      );
      setContacts(updatedContacts);
    } else {
      // Add new contact with a unique ID
      setContacts([...contacts, { ...contact, id: crypto.randomUUID() }]);
    }
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactsList contacts={contacts} />} />
        <Route
          path="/add"
          element={<ContactForm onSubmit={addOrUpdateContact} />}
        />
        // In App.jsx, adjust your /edit/:id route like this:
        <Route
          path="/edit/:id"
          element={
            <ContactForm onSubmit={addOrUpdateContact} contacts={contacts} />
          }
        />
        <Route
          path="/contact/:id"
          element={
            <ContactDetail contacts={contacts} onDelete={deleteContact} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

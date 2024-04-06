import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ContactsList({ contacts }) {
  const [searchTerm, setSearchTerm] = useState('');

  // First, filter and sort contacts
  let filteredAndSortedContacts = contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.surname &&
          contact.surname.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const nameA = a.surname || a.name;
      const nameB = b.surname || b.name;
      return nameA.localeCompare(nameB);
    });

  // Then, create a new array that includes separators
  const contactsAndSeparators = [];
  let currentLetter = '';

  filteredAndSortedContacts.forEach((contact) => {
    const sortKey = (contact.surname || contact.name).toUpperCase();
    if (sortKey[0] !== currentLetter) {
      currentLetter = sortKey[0];
      contactsAndSeparators.push({ isSeparator: true, letter: currentLetter });
    }
    contactsAndSeparators.push(contact);
  });

  return (
    <div>
      <h2>Contacts</h2>
      <input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to="/add">Add New Contact</Link>
      {contactsAndSeparators.length > 0 ? (
        <ul>
          {contactsAndSeparators.map((item, index) =>
            item.isSeparator ? (
              <li key={`separator-${item.letter}`}>{item.letter}</li>
            ) : (
              <li key={item.id}>
                <Link to={`/contact/${item.id}`}>
                  {item.name} {item.surname}
                </Link>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>No contacts found.</p>
      )}
    </div>
  );
}

export default ContactsList;

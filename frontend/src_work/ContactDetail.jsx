import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ContactDetail({ contacts, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  // Updated comparison to directly use string-based IDs
  const contact = contacts.find((contact) => contact.id === id);

  const handleDelete = () => {
    onDelete(contact.id);
    navigate('/');
  };

  if (!contact) {
    return (
      <div>
        <p>Contact not found!</p>
        <button onClick={() => navigate('/')}>Back to Contacts</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Contact Detail</h2>
      <p>Name: {contact.name}</p>
      <p>First Name: {contact.surname}</p>
      <p>Phone: {contact.phone}</p>
      <p>Email: {contact.email}</p>
      <p>Adress: {contact.address}</p>
      <p>Other: {contact.other}</p>
      <button onClick={() => navigate(`/edit/${contact.id}`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => navigate('/')}>Back to Contacts</button>
    </div>
  );
}

export default ContactDetail;

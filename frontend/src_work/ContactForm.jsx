import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ContactForm({ onSubmit, contacts }) {
  const [contact, setContact] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    other: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id && contacts) {
      const contactToEdit = contacts.find((c) => c.id === id);
      if (contactToEdit) {
        setContact(contactToEdit);
      }
    }
  }, [id, contacts]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(contact);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          name="name"
          value={contact.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Surname:
        <input name="surname" value={contact.surname} onChange={handleChange} />
      </label>
      <label>
        Phone:
        <input name="phone" value={contact.phone} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Address:
        <input name="address" value={contact.address} onChange={handleChange} />
      </label>
      <label>
        Other:
        <textarea name="other" value={contact.other} onChange={handleChange} />
      </label>
      <button type="submit">Save Contact</button>
      <button type="button" onClick={() => navigate('/')}>
        Cancel
      </button>
    </form>
  );
}

export default ContactForm;

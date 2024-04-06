import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ContactForm({ onSubmit, BASE_URL_API, contacts }) {

  const [contact, setContact] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    other: '',
    image: null,
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id && contacts) {
      const contactToEdit = contacts.find((c) => c.id === parseInt(id));
      if (contactToEdit) {
        setContact(contactToEdit);
      }
    }
  }, [id, contacts]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const imageFile = e.target.files[0];
      setContact({ ...contact, image: imageFile });
    } else {
      setContact({ ...contact, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', contact.name);
    formData.append('surname', contact.surname);
    formData.append('phone', contact.phone);
    formData.append('email', contact.email);
    formData.append('address', contact.address);
    formData.append('other', contact.other);
    formData.append('image', contact.image);

    // Ajouter l'user_id récupéré de la session
    const userId = sessionStorage.getItem('user_id');
    formData.append('user_id', userId);

    if (id) {
      try {
        await fetch(`${BASE_URL_API}/contacts/${id}/edit`, {
          method: 'PUT',
          body: formData,
        });
        // After editing, update the contact object in the parent component
        onSubmit({ ...contact, id });
        navigate(`/contact/${id}`);
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    } else {
      try {
        const response = await fetch(`${BASE_URL_API}/contacts/new`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        // After adding, update the contact object in the parent component
        onSubmit({ ...contact, id: data.id });
        navigate('/');
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    }
  };

  return (
    <div className="formFinal_Container">
      <i className="fa-solid fa-arrow-left" onClick={() => navigate('/')}></i>

      <form onSubmit={handleSubmit} className="formFinal">
        <fieldset>
          <label>Name</label>
          <input
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </fieldset>

        <fieldset>
          <label>Surname</label>
          <input
            name="surname"
            value={contact.surname}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <label>Phone</label>
          <input
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            required
          />
        </fieldset>
        <fieldset>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <label>Address</label>
          <input
            name="address"
            value={contact.address}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <label>Other</label>
          <textarea
            name="other"
            value={contact.other}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </fieldset>

        <button type="submit" className="saveBtn">
          Save Contact
        </button>
      </form>
    </div>
  );
}

export default ContactForm;

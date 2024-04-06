import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ContactDetail({ contacts, BASE_URL_API, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    setIsLoading(true); // Start loading
    fetch(`${BASE_URL_API}/contact/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setContact(data);
        setIsLoading(false); // Finish loading after setting the contact
      })
      .catch((error) => {
        console.error('Error fetching contact:', error);
        setIsLoading(false); // Ensure loading is finished in case of error
      });
  }, [id, BASE_URL_API]);

  const handleDelete = () => {
    onDelete(contact.id);
    navigate('/', {
      state: {
        message: "Contact has been successfully deleted.",
        type: 'deleted',
      },
    });
  };

  if (isLoading) {
    // Optionally, show a loading spinner or similar here
    return <div>Loading...</div>;
  }

  if (!contact) {
    return (
      <div>
        <p>Contact not found!</p>
        <button onClick={() => navigate('/')}>Back to Contacts</button>
      </div>
    );
  }

  return (
    <article className="detailPage">
      <img
        src={`http://localhost/SAE_contactAPP/backend/public/uploads/${contact.imagePath}`}
        alt={`${contact.name}'s avatar`}
        className="imgBG"
      ></img>
      <section className="contactTop">
        <i
          class="fa-solid fa-pen-to-square"
          onClick={() => navigate(`/edit/${contact.id}`)}
        ></i>
        <i class="fa-solid fa-arrow-left" onClick={() => navigate('/')}></i>
        <img src={`http://localhost/SAE_contactAPP/backend/public/uploads/${contact.imagePath}`}
          alt={`${contact.name}'s avatar`}></img>
      </section>
      <section className="infoSection">
        <h1>
          {contact.name} {contact.surname}
        </h1>
        <div className="infoSection_row">
          <i class="fa-solid fa-phone"></i>
          <p>{contact.phone}</p>
        </div>

        <div className="infoSection_row">
          <i class="fa-solid fa-envelope"></i>
          <p>{contact.email}</p>
        </div>

        <div className="infoSection_row">
          <i class="fa-solid fa-house"></i>
          <p>{contact.address}</p>
        </div>

        <div className="infoSection_row">
          <i class="fa-solid fa-info"></i>
          <p>{contact.other}</p>
        </div>

        <button onClick={handleDelete}>Delete</button>
      </section>
    </article>
  );
}

export default ContactDetail;

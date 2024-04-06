import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function ContactsList({ contacts, BASE_URL_API }) {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.message && location.state.type) {
      setAlert({
        message: location.state.message,
        type: location.state.type,
      });
      setTimeout(() => setAlert({ message: '', type: '' }), 5000);

      location.state.message = '';
    }
  }, [location]);

  const alertStyles = {
    backgroundColor:
      alert.type === 'added'
        ? 'rgb(29, 215, 29)'
        : alert.type === 'edited'
          ? 'rgb(53, 162, 235)'
          : 'rgb(235, 77, 75)',
  };

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

  const handleLogout = () => {
    fetch(`${BASE_URL_API}/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.ok) {
        console.log('User logged out successfully.');
        sessionStorage.clear();
        window.location.reload();
      } else {
        console.error('Error logging out:', response.statusText);
      }
    }).catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <div>
        <header>
          {alert.message && (
            <div className="alertMsg" style={alertStyles}>
              {alert.message}
            </div>
          )}
          <div className="nav">
            <h2>Contacts</h2>
            <Link to="/log">
              <i className="fa-solid fa-right-to-bracket" onClick={handleLogout}></i>
            </Link>
          </div>
          <div className="search">
            <i className="fa-solid fa-search" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <main className="listMain">
          <article className="list" id="list">
            <Link to="/add">
              <i className="fa-solid fa-plus plusBtn" />
            </Link>

            {contactsAndSeparators.length > 0 ? (
              <ul>
                {contactsAndSeparators.map((item, index) =>
                  item.isSeparator ? (
                    <li
                      key={`separator-${item.letter}`}
                      className="separatorList"
                    >
                      {item.letter}
                    </li>
                  ) : (
                    <li key={item.id} className="otherLI">
                      <img src={`http://localhost/SAE_contactAPP/backend/public/uploads/${item.image}`}
                        alt={`${item.name}'s avatar`}></img>
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
          </article>
        </main>
      </div>
    </div>
  );
}

export default ContactsList;

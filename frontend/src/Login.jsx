import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ BASE_URL_API }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');

  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 5) {
      setError2('Veuillez entrer un mot de passe de minimum 5 caractères.');
      return;
    }

    const userData = {
      email: email,
      password: password
    };

    let url = `${BASE_URL_API}/login`;

    if (isActive) {
      url = `${BASE_URL_API}/register`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);

        if (jsonResponse.user && jsonResponse.user.id && jsonResponse.user.email) {
          sessionStorage.setItem('user_id', jsonResponse.user.id);
          sessionStorage.setItem('user_email', jsonResponse.user.email);
          sessionStorage.setItem('user_roles', JSON.stringify(jsonResponse.user.roles));

          // Une fois les données stockées, naviguer vers la page d'accueil
          navigate('/');
          // Rafraîchir la page après la navigation
          window.location.reload();
        } else {
          console.error('User ID or email is missing in the response.');
        }
      } else {
        const errorResponse = await response.json();
        if (isActive) {
          setError2(errorResponse.error);
        } else {
          setError1(errorResponse.error);
        }
        navigate('/log', {
          state: {
            message: "Les informations sont incorrectes. Veuillez réessayer.",
            type: 'deleted',
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRegisterClick = () => {
    setIsActive(true);
    setError1('');
  };

  const handleLoginClick = () => {
    setIsActive(false);
    setError2('');
  };

  return (
    <div className="container_FORM">
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error2 && <div className="error-message2">{error2}</div>}
            <button type="submit">Sign Up</button>
            <button className="ghost" id="signIn" onClick={handleLoginClick}>
              Sign In
            </button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error1 && <div className="error-message1">{error1}</div>}
            <button type="submit">Sign In</button>
            <button
              className="ghost mobileBtn"
              id="signUp"
              onClick={handleRegisterClick}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signIn" onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={handleRegisterClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

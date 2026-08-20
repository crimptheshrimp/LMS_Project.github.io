import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const validateInputs = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError(true);
      isValid = false;
    } else {
      setUsernameError(false);
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage('');

    if (validateInputs()) {
      try {
        await register(username, email, password);
        setServerMessage('Registration successful. You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/login');
      } catch (error) {
        setServerMessage(error.message || 'Unable to register');
      }
    }
  };

  return (
    <div className="form-wrapper">
      <h1>Welcome to the Learning Management System!</h1>
      <h2 className="center-text">Register</h2>
      <form onSubmit={handleSubmit} className='user-form'>
        <div className="form-group">
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {usernameError && <p className="error">Please enter a username.</p>}
        </div>

        <div className="form-group">
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="error">Please enter a valid email address.</p>}
        </div>

        <div className="form-group">
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <p className="error">Password must be at least 6 characters long.</p>}
        </div>

        {serverMessage && (
          <p className={serverMessage.includes('successful') ? 'success' : 'error'}>{serverMessage}</p>
        )}

        <button type="submit" className="primary-button">
          Register
        </button>
      </form>

      <p className="small-note">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
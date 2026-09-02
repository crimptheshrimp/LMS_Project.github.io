import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateInputs = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError(true);
      isValid = false;
    } else {
      setUsernameError(false);
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
    setServerError('');

    if (validateInputs()) {
      try {
        await login(username, password);
        navigate('/');
      } catch (error) {
        setServerError(error.message || 'Unable to log in');
      }
    }
  };

  return (
    <div className="form-wrapper auth-wrapper">
      <div className="brand-lockup" aria-label="LearningHub branding">
        <img src="/learninghub-logo.svg" alt="LearningHub logo" className="brand-mark brand-mark-large" />
        <div className="brand-wordmark brand-wordmark-large">
          <span className="brand-light">learning</span>
          <strong>hub</strong>
        </div>
      </div>
      <h1>Welcome to the Learning Management System!</h1>
      <h2 className="center-text">Login</h2>
      <form onSubmit={handleSubmit} className='user-form'>
        <div className="form-group">
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p className="error">Please enter your username.</p>}
        </div>

        <div className="form-group">
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error">Password must be at least 6 characters long.</p>}
        </div>

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit" className="primary-button">
          Sign In
        </button>
      </form>

      <p className="small-note">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
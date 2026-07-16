import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateInputs = () => {
    let isValid = true;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      console.log({
        email: email,
        password: password,
      });
      // Handle sign-in logic here
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Welcome to the Learning Management System!</h1>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit} className='user-form' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {emailError && <p style={{ color: 'red', margin: '0.25rem 0' }}>Please enter a valid email address.</p>}
        </div>
        
        <div>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {passwordError && <p style={{ color: 'red', margin: '0.25rem 0' }}>Password must be at least 6 characters long.</p>}
        </div>
        
        <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
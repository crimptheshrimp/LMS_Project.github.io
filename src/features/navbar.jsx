import { Link } from 'react-router-dom'

function Navbar() {
  const navStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    backgroundColor: '#396ea7',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'backgroundColor 0.3s ease',
  };

  return (
    <div id='navbar'>
        <nav style={navStyle}>
          <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Home</Link>
          <Link to="/register" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Register</Link>
          <Link to="/login" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Login</Link>
        </nav>
    </div>
  )
}

export default Navbar;
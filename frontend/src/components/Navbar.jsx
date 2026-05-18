import React, { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

function Navbar({ username, setUsername }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    navigate('/');
  }

  let navContent;
  console.log(`${username} is logged in now`);
  if (username) {
    navContent = (
      <>
        <Link to="/my-registrations">
          My Registrations
        </Link>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <span style={{ fontWeight: 600 }}>{username}</span>
        <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </>
    );
  }
  else {
    navContent = (
      <>
        <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          Login
        </Link>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          Sign Up
        </Link>
      </>
    );
  }
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand-logo">
          Saarang Hub
        </Link>
        <div className="nav-links">
          <Link to="/">
            Events
          </Link>
          {navContent}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
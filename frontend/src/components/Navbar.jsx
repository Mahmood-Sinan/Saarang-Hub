import React, { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    navigate('/');
  }

  let navContent;
  console.log(`${user} is logged in now`);
  if (token) {
    navContent = (
      <>
        <Link to="/my-registrations">
          My Registrations
        </Link>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <span style={{ fontWeight: 600 }}>{user}</span>
        <button onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  }
  else {
    navContent = (
      <>
        <Link to="/login">
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
        <Link to="/">
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
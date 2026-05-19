import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../utils/api';

const Register = ({username, setUsername}) => {
  const [usernamefield, setUsernamefield] = useState('');
  const [emailfield, setEmailfield] = useState('');
  const [passwordfield, setPasswordfield] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(event) => {

    event.preventDefault();
    try{
      const response = await api.post('/signup', {username: usernamefield, email: emailfield, password: passwordfield});
      localStorage.setItem('username', usernamefield);
      localStorage.removeItem('adminToken');
      setUsername(usernamefield);
      console.log(`signed up for ${response.data.token} and saved token to ${localStorage.getItem('token')}`);
      console.log(response.data.message);
      navigate('/');
    }
    catch(error){
      console.error(error);
    }
  };
  return (
    <div className="container">
      <div className='login_signup-container'>
        <h2 className="gradient-text text-center" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={usernamefield}
              onChange={(e) => setUsernamefield(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={emailfield}
              onChange={(e) => setEmailfield(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordfield}
              onChange={(e) => setPasswordfield(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

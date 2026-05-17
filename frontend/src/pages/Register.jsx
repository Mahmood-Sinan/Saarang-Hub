import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../utils/api';

const Register = ({user, setUser}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(event) => {

    event.preventDefault();
    try{
      const response = await api.post('/signup', {username: username, email: email, password: password});
      localStorage.setItem('user', response.data.username);
      console.log(`signed up for ${response.data.username} and saved to ${localStorage.getItem('user')}`);
      setUser(response.data.username);
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

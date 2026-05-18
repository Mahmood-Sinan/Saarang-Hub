import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../utils/api';

const Login = ({username, setUsername}) => {
  const [usernamefield, setUsernamefield] = useState('');
  const [passwordfield, setPasswordfield] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async(event) => {

    event.preventDefault();
    setLoading(true);
    setError('');
    try{
      const response = await api.post('/login', {username: usernamefield, password: passwordfield});
      if(response.data.message=='User Found'){
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', usernamefield);
        localStorage.removeItem('adminToken');
        setUsername(usernamefield);
        navigate('/');
      }
      else{
        console.log(response.data.message);
        setError('Incorrect Username or Password');
      }
    }
    catch(error){
      console.error(error);
    }
  };
  return (
    <div className="container">
      <div className='login_signup-container'>
        <h2 className="gradient-text text-center" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Welcome Back</h2>
        
        {error && <div className="error-message">{error}</div>}

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
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordfield}
              onChange={(e) => setPasswordfield(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = ({username, setUsername, isAdminLoggedIn, setIsAdminLoggedIn}) => {
  const [usernamefield, setUsernamefield] = useState('');
  const [passwordfield, setPasswordfield] = useState('');
  const [LogInError, setLogInError] = useState('');
  const [isLogginIn, setIsLogginIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);

  localStorage.removeItem('username');
  useEffect(() => {
    setUsername('');
    if (!isAdminLoggedIn) return;

    const fetchEvents = async () => {
      console.log('fetching events')
      try {
        const response = await api.get('/events');
        console.log(response.data);
        setEvents(response.data);
      }
      catch (e) {
        console.log(e);
        setError('Failed to fetch events.');
      }
      finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [isAdminLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLogginIn(true);
    setLogInError('');
    try {
      const response = await api.post(`/admin/login`, {username: usernamefield, password: passwordfield});
      console.log(response);
      if (response.data.message == 'Admin Auth Successful'){
        setIsAdminLoggedIn(true);
      }
      else {
        console.log(response.data.message);
        setLogInError('Incorrect Admin Credentials');
      }
    } catch (e) {
      console.log(e);
    } finally{
      setIsLogginIn(false);
    }
  };
  
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setEvents([]);
  };

  const handleDeleteEvent = async(id) => {
    if(window.confirm('Are you sure you want to delete this event ?')){
      try{
        await api.delete(`/events/${id}`);
        setEvents(events.filter(event=> event._id!=id))
      }catch(e){
        alert('Failed to delete event');
        console.log(e);
      }
    }
  };
  if (!isAdminLoggedIn) {
    return (
      <div className="container">
        <div className="login_signup-container">
          <h2 className="gradient-text text-center mb-6" style={{ fontSize: '2rem', marginBottom: '2rem'  }}>Admin Access</h2>
            {LogInError && <div className="error-message">{LogInError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Admin Username</label>
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
          <button type="submit" className="btn btn-primary btn-block">
            {isLogginIn ? 
                <div className="loading-inline">
                    <span>Logging in</span>
                    <div className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div> : 'Login to Dashboard'}
          </button>
          </form>
        </div>
      </div>
    );
  }
  if (loading) return <div className="container mt-8 text-center">Loading dashboard...</div>;
  const eventRows = [];
  for (const event of events) {
    eventRows.push(
      <tr key={event._id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
        <td style={{ padding: '1rem' }}>{event.title}</td>
        <td style={{ padding: '1rem' }}>{new Date(event.date).toLocaleDateString()}</td>
        <td style={{ padding: '1rem' }}>{event.location}</td>
        <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
          <Link to={`/admin/events/${event._id}/edit`} className="btn"
              style={{background: 'var(--primary)',
              padding: '0.4rem 0.8rem',
              fontSize: '0.875rem'}}>
            Edit
          </Link>
          <button onClick={() => handleDeleteEvent(event._id)} className="btn btn-danger"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.875rem'
            }}>
            Delete
          </button>
        </td>
      </tr>
    );
  }
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0 }}>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn" style={{ background: 'var(--bg-dark)', color: 'var(--text-muted)' }}>
          Logout Admin
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>All Events</h2>
          <Link to="/admin/events/new" className="btn btn-primary">
            + Create New Event
          </Link>
        </div>

        <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

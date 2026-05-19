import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../utils/api';

const EventDetail = () => {
  const id = useParams().id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [unregistering, setUnregistering] = useState(false);
  const username = localStorage.getItem('username');
  const [Error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventAPIresult = await api.get(`/events/${id}`)
        setEvent(eventAPIresult.data);
        console.log(eventAPIresult);

        if (username) {
          console.log('sdzoch')
          const res = await api.get(`/my-registrations/`);
          console.log(res);
          let registered = false;
          for (const regEvent of res.data.regEvents) {
            if (regEvent._id === id) {
              registered = true;
              break;
            }
          }
          console.log(`user is registered or not: ${registered}`)
          setIsRegistered(registered);
        }
      }
      catch (error) {
        console.error(error);
        setError('Failed to load event details.');
      }
      finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [id]);

  const handleRegister = async () => {
    console.log(`current user id is ${username} and requested for registration for ${id}`)
    if (!username) {
      navigate('/login');
      return;
    }
    setRegistering(true);
    setError('');
    try {
      const res = await api.post(`/events/${id}/register`);
      setIsRegistered(true);
      console.log(res);
    }
    catch (error) {
      console.error(error);
      setError('Failed to register.')
    } finally {
      setRegistering(false);
    }
  }
  const handleUnregister = async () => {
    console.log(`current user id is ${username} and requested for unregistration for ${id}`)
    if (!username) {
      navigate('/login');
      return;
    }
    setUnregistering(true);
    setError('');
    try {
      const res = await api.post(`/events/${id}/unregister`);
      setIsRegistered(false);
      console.log(res);
    }
    catch (error) {
      console.error(error);
      setError('Failed to unregister.');
    } finally {
      setUnregistering(false);
    }
  }

  if (loading) return <div className="text-center mt-8 container">Loading...</div>;
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <img
          src={event.imageUrl}
          alt={event.title}
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '2rem' }}
        />

        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{event.title}</h1>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          <div>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </div>
          <div>
            <strong>Location:</strong> {event.location}
          </div>
        </div>

        <div style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>About this event</h2>
          <p style={{ color: 'var(--text-muted)' }}>{event.description}</p>
        </div>

        {Error && <div className="error-message">{Error}</div>}

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
          {!isRegistered ? (
            <button
              className="btn btn-primary"
              onClick={handleRegister}
              disabled={registering}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem', cursor: registering ? 'not-allowed' : 'pointer' }}
            >
              {registering ? 'Registering...' : 'Register for Event'}
            </button>
          ) : (
            <div>
              <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '1rem' }}>✓ You are registered for this event</p>
              <button
                className="btn btn-danger"
                onClick={handleUnregister}
                disabled={unregistering}
                style={{ opacity: unregistering ? 0.7 : 1, cursor: unregistering ? 'not-allowed' : 'pointer' }}
              >
                {unregistering ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

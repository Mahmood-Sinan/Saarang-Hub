import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../utils/api';

const EventDetail = () => {
  console.log('calling eventdetail')
  const id = useParams().id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(loading)
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventAPIresult = await api.get(`/events/${id}`)
        setEvent(eventAPIresult.data);
        console.log(eventAPIresult);

        if(token){
          console.log('sdzoch')
          const res = await api.get(`/my-registrations/`,{headers: {authorization: `Bearer ${token}`}});
          console.log(res);
          let registered = false;
          for(const regEvent of res.data.regEvents){
            if(regEvent._id === id){
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
      }
      finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [id]);

  const handleRegister = async () => {
    console.log(`current user id is ${token} and requested for registration for ${id}`)
    if(!token){
      navigate('/login');
      return;
    }
    try{
      const res = await api.post(`/events/${id}/register`, {}, {headers: {authorization: `Bearer ${token}`}});
      setIsRegistered(true);
      console.log(res);
    }
    catch(error){
        console.error(error);
    }
  }
  const handleUnregister = async () => {
    console.log(`current user id is ${token} and requested for unregistration for ${id}`)
    if(!token){
      navigate('/login');
      return;
    }
    try{
      const res = await api.post(`/events/${id}/unregister`, {}, {headers: {authorization: `Bearer ${token}`}});
      setIsRegistered(false);
      console.log(res);
    }
    catch(error){
        console.error(error);
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
        
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
          {!isRegistered ? (
            <button
              className="btn btn-primary"
              onClick={handleRegister}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            >
              Register for Event
            </button>
          ) : (
            <div>
              <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '1rem' }}>✓ You are registered for this event</p>
              <button
                className="btn btn-danger"
                onClick={handleUnregister}
              >
                Cancel Registration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

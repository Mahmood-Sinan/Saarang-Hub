import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { useParams, useNavigate } from 'react-router-dom';

const MyRegistrations = () => {

  const [regEvents, setRegEvents] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  console.log(`user is ${token}`)
  useEffect(()=>{
    if(!token){
      console.log(token);
      navigate('/login');
      return;
    }
    const fetchRegistrations = async () => {
      try{
        const res = await api.get(`/my-registrations/`);
        console.log(`response for registered events:`);
        console.log(res.data.regEvents);
        setRegEvents(res.data.regEvents);
      }
      catch(error){
        console.error(error);
      }
    };
    fetchRegistrations();
  },[]);
  const eventElements = [];

  for(const event of regEvents){
      eventElements.push(
          <EventCard key={event._id} event={event} />
      );
  }
    return(
    <div className="container">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>My Registrations</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Events you have signed up for.
        </p>
      </div>
      {(regEvents.length === 0 ?(
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            You haven't registered for any events yet.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-3'>
        {eventElements}
        </div>
      ))}
    </div>
    );
};

export default MyRegistrations;
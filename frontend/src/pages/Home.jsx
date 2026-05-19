import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
function Home() {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                console.log(response.data);
                setEvents(response.data); //store events recieved from server via api
            } catch (error) {
                console.error(error);
                setError('Failed to load events.');
            } finally {
                setEventsLoading(false);
            }
        };
        fetchEvents();
    }, []);
    const eventElements = [];

    for (const event of events) {
        eventElements.push(
            <EventCard key={event._id} event={event} />
        );
    }

    return (
        <div className='container'>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    Upcoming Events
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                    Discover and register for Saarang events.
                </p>
            </div>
            {eventsLoading ? (
                <div className="loading-doodle text-center mt-8">
                    <span>Loading events</span>
                    <div className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div>
            ) :
                error ? (<div className="error-message text-center">{error}</div>) :
                    (<div className='grid grid-cols-3'>
                        {eventElements}
                    </div>)}
        </div>
    );
}

export default Home;
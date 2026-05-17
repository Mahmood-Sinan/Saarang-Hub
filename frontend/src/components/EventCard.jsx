import React from "react";
import { Link } from 'react-router-dom';

const EventCard = ({event}) => {
    return(
    <div className="card">
        <img src={event.imageUrl} alt={event.title} className="event-image"/>
        <div className="event-content">
            <span className="event-date">
                {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </span>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-desc">{event.description}</p>
            <div style={{marginTop: '1rem'}}>
                <Link to={`/events/${event._id}`} className='btn btn-primary' style={{display: 'inline-block', width: '100%'}}>
                    View Details
                </Link>
            </div>
        </div>
    </div> 
);
}
export default EventCard;
